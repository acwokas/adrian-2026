import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const intensityMap: Record<string, { description: string; tone: string }> = {
  measured: {
    description: "Professional critique, diplomatic but clear",
    tone: "Measured, professional, constructive. Raise concerns clearly but respectfully.",
  },
  adversarial: {
    description: "Direct challenge, no softening, assume hostile review",
    tone: "Direct, aggressive, adversarial. No hedging, no softening. Assume the audience is hostile and looking for flaws.",
  },
  forensic: {
    description: "Systematic deconstruction of logic and evidence",
    tone: "Methodical, analytical, precise. Deconstruct each claim systematically. Focus on evidence gaps and logical structure.",
  },
};

function buildSystemPrompt(intensity: string, focusAreas: string[]) {
  const config = intensityMap[intensity] || intensityMap.adversarial;
  const focusClause = focusAreas.length > 0
    ? `\n\nFocus especially on: ${focusAreas.join(", ")}`
    : "";

  return `You are a red team analysis tool designed for high-stakes strategic decisions.

Generate a three-perspective analysis calibrated to ${intensity} intensity:

## RED TEAM CHALLENGE

Attack the idea from multiple angles. Your goal is to find every vulnerability, weak assumption, and potential failure mode. Be ${config.description}.

Surface:
- Logical flaws in the reasoning
- Market/competitive assumptions that may not hold
- Execution risks that could derail the plan
- Stakeholder reactions that could create resistance
- Unintended consequences
- Alternative interpretations of the same data${focusClause}

## BLUE TEAM DEFENSE

Provide measured counter-arguments defending the idea. Acknowledge valid Red Team concerns but contextualize them:
- Which concerns are manageable with mitigation?
- Which trade-offs are acceptable?
- What's the affirmative case despite the risks?
- Where is Red Team being overly pessimistic?

## ASSUMPTIONS & FAULT LINES

Analytical perspective identifying:
- Unstated assumptions the idea depends on
- Dependencies that could break
- Structural fault lines (where small changes cause large failures)
- Reversibility: Can this be undone if wrong?
- Staging: Can this be tested incrementally?

Important:
- Match the specified intensity level precisely
- Don't artificially balance perspectives—if Red Team has strong points, don't weaken them
- Include specific, actionable concerns
- Use the actual context provided (audience, constraints, dependencies)

Tone: ${config.tone}`;
}

const SYNTHESIS_SYSTEM = `You are a strategic synthesis tool. Given a Red Team, Blue Team, and Fault Line analysis, provide exactly 3 paragraphs:

1. Most critical vulnerabilities to address immediately
2. Strongest defensive positions to leverage
3. Recommended next steps for stress-testing before presenting

Be direct and specific. No hedging. Reference specific points from the analysis.`;

const MITIGATION_SYSTEM = `You are a strategic mitigation planner. Given a specific Red Team concern, generate a concrete, actionable mitigation strategy with:

1. Immediate actions (this week)
2. Short-term positioning (next 30 days)
3. Monitoring triggers (what signals indicate this risk is materializing)

Be specific and practical. No generic advice. 3-5 bullet points per category maximum.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { mode } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let messages: { role: string; content: string }[];

    if (mode === "synthesis") {
      const { analysisText } = body;
      if (!analysisText) {
        return new Response(JSON.stringify({ error: "Analysis text required for synthesis." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      messages = [
        { role: "system", content: SYNTHESIS_SYSTEM },
        { role: "user", content: `Here is the full analysis:\n\n${analysisText}\n\nProvide your synthesis.` },
      ];
    } else if (mode === "mitigation") {
      const { concern, ideaContext } = body;
      if (!concern) {
        return new Response(JSON.stringify({ error: "Concern text required." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      messages = [
        { role: "system", content: MITIGATION_SYSTEM },
        { role: "user", content: `ORIGINAL IDEA CONTEXT: ${ideaContext || "Not provided"}\n\nRED TEAM CONCERN TO MITIGATE:\n${concern}\n\nGenerate a mitigation strategy.` },
      ];
    } else {
      // Main analysis
      const { idea, audience, dependencies, constraints, intensity, focusAreas } = body;
      if (!idea) {
        return new Response(JSON.stringify({ error: "Idea description is required." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const systemPrompt = buildSystemPrompt(intensity || "adversarial", focusAreas || []);
      const userPrompt = `IDEA/PLAN TO PRESSURE-TEST:\n${idea}\n\nINTENDED AUDIENCE: ${audience || "Not specified"}\n\nSUCCESS DEPENDS ON: ${dependencies || "Not specified"}\n\nKNOWN CONSTRAINTS: ${constraints || "Not specified"}\n\nCHALLENGE INTENSITY: ${intensity || "adversarial"}\n\nAnalyze this thoroughly.`;
      messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ];
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
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
      return new Response(JSON.stringify({ error: "Analysis service unavailable." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("redteam-analysis error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
