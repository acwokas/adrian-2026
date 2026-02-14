import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { mode, setup, messages, reviewTranscript } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt: string;
    let userPrompt: string;

    const reviewerTypes = (setup.reviewers || []).join(", ") || "Board of Directors";

    if (mode === "reflection") {
      systemPrompt = `You are a governance advisor analyzing a practice governance review simulation.

Generate a structured analysis with these sections:

## REVIEW SUMMARY

Overall assessment: Where governance is strong, where it needs work. Be specific about what the person demonstrated well and where they struggled.

## IDENTIFIED GAPS

Specific areas where governance structures are missing or weak. For each gap:
- What's missing
- Why it matters
- Priority level (Critical / Important / Nice-to-have)

Quote from their answers where relevant.

## AI DECISION OWNERSHIP MAP

Generate a practical framework table:

| Decision Type | Owner | Approver | When Required | Documentation |
|--------------|-------|----------|---------------|---------------|
| Deploy to production | [Role] | [Role] | Before any production release | Deployment checklist, risk assessment |
| Pause/rollback | [Role] | [Role] | Performance below threshold | Incident report |
| Override AI output | [Role] | [Role] | Edge cases, complaints | Override log with justification |
| Escalate concerns | [Role] | [Role] | Safety, bias, or compliance issues | Escalation form |
| Terminate/sunset | [Role] | [Role] | Strategic review, performance failure | Sunset plan, migration strategy |

Customize roles based on their context: ${setup.capability}

## PERFORMANCE ACCOUNTABILITY TEMPLATE

Framework for ongoing monitoring:

**Metrics to Track:**
- [Specific to their AI capability]
- Review frequency recommendations

**Review Cadence:**
- Daily: [what to check]
- Weekly: [what to review]
- Monthly: [what to report]
- Quarterly: [what to assess]

**Escalation Triggers:**
- Performance drops below [X]%
- Customer complaints exceed [threshold]
- Bias detected in [area]

## GOVERNANCE REVIEW CHECKLIST

For future reviews, prepare:

- [ ] Business case with ROI data
- [ ] Risk assessment (updated)
- [ ] Current oversight structure
- [ ] Performance data (last period)
- [ ] Incident log and resolutions
- [ ] Ethical review findings
- [ ] Compliance status
- [ ] Stakeholder feedback summary

Customize based on their specific capability and gaps identified.

Be specific to their context. Make templates immediately usable.`;

      userPrompt = `AI CAPABILITY: ${setup.capability}
BUSINESS IMPACT: ${setup.businessImpact}
DEPLOYMENT STAGE: ${setup.stage}
REVIEWERS: ${reviewerTypes}
THEIR CONCERNS: ${setup.concerns || "Not specified"}
KNOWN GAPS: ${setup.gaps || "Not specified"}

REVIEW TRANSCRIPT:
${reviewTranscript}

Analyze this governance review simulation and provide actionable frameworks.`;
    } else {
      // Chat mode - Q&A governance review
      const stageContext: Record<string, string> = {
        "planning": "They're still in planning - focus on whether they've thought ahead about governance structures.",
        "pilot": "They're piloting - ask about what they've learned, how they're measuring, and what happens after pilot.",
        "limited": "Limited deployment - ask about scaling plans, monitoring gaps, and edge cases encountered.",
        "production": "Full production - ask about ongoing oversight, performance tracking, and incident response.",
        "scaling": "Scaling/expanding - ask about governance that scales, automation of oversight, and organizational accountability.",
      };

      systemPrompt = `You are a senior member of the ${reviewerTypes} reviewing an AI implementation proposal.

AI Capability: ${setup.capability}
Business Impact: ${setup.businessImpact}
Deployment Stage: ${setup.stage}
${stageContext[setup.stage] || ""}
Their concerns (which you should probe): ${setup.concerns || "General governance"}
Known gaps (probe these especially): ${setup.gaps || "Unknown - discover through questioning"}

Your role is to ask rigorous questions about governance. You want to ensure proper oversight exists. You're not trying to block progress — you want good governance.

Question strategy (cover across the conversation):
1. START with business case and ROI — "Walk me through the business case"
2. MOVE TO risk and mitigation — "What could go wrong?"
3. DIG INTO oversight and accountability — "Who owns this decision?"
4. PROBE performance measurement — "How do we know it's working?"
5. END WITH ethics and responsibility — "Have we considered bias?"

Critical behavior:
- Ask ONE question at a time
- After their response, briefly acknowledge (1-2 sentences), note gaps, then ask follow-up OR move to next category
- Be firm but fair — you want good governance, not to intimidate
- Reference specific details from their answers
- If they're vague, push for specifics: "Can you be more concrete about that?"
- If they're strong, acknowledge it: "Good. That's clear."
- Track which areas you've covered and move through all 5 categories

Don't make it easy — but don't be adversarial. This is oversight, not interrogation.

Keep responses to 2-4 sentences: brief acknowledgment + next question.`;

      userPrompt = messages[messages.length - 1]?.content || "";
    }

    const aiMessages = mode === "reflection"
      ? [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }]
      : [{ role: "system", content: systemPrompt }, ...messages];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: aiMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please try again later." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Service unavailable. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("governance-review error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
