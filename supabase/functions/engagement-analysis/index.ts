import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { engagementData, context, generateResponses, objectionText } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt: string;

    if (generateResponses && objectionText) {
      systemPrompt = `You are a communications strategist. For the following objection/concern from audience engagement, generate 3 response templates:

1. **Empathetic response** - Acknowledge the concern warmly, validate, then redirect
2. **Direct response** - Address head-on with evidence or clarity
3. **Educational response** - Use it as a teaching moment

${context?.platforms ? `Platform: ${context.platforms.join(", ")}. Keep responses platform-appropriate in length.` : ""}

Objection/concern:
${objectionText}

Format each clearly with the label and the response text. Keep responses concise and ready to paste.`;
    } else {
      const platformContext = context?.platforms?.length ? `Consider platform-specific behaviours on ${context.platforms.join(", ")}.` : "";
      const timeContext = context?.timePeriod ? `Time period: ${context.timePeriod}.` : "";
      const topicContext = context?.postTopics ? `They were posting about: ${context.postTopics}.` : "";
      const questionContext = context?.specificQuestions ? `Pay special attention to these questions: ${context.specificQuestions}` : "";

      systemPrompt = `You are an engagement analyst helping someone understand what's resonating with their audience.

Analyse the engagement data provided and generate a structured analysis with four sections:

## INTEREST SIGNALS

What positive patterns emerge? What topics, angles, or framings are generating engagement?

Identify:
- Questions people are asking (shows curiosity)
- Requests for more detail (shows relevance)
- Sharing/tagging behaviour (shows value)
- Specific language used when people are interested
- Topics that spark conversation

Be specific with examples from the data.

## COMMON OBJECTIONS & CONCERNS

What pushback, scepticism, or confusion appears?

Identify:
- Misunderstandings about the offering
- Pricing/value concerns
- Competitive comparisons
- Trust/credibility questions
- Feature requests or gaps
- Language that triggers defensiveness

Quote specific examples where helpful.

## TOP-PERFORMING CONTENT

Which posts/topics generated the most valuable engagement?

Rank by:
- Depth of conversation
- Quality of questions
- Sharing behaviour
- Alignment with target audience

For each, explain WHY it worked.

## PRIORITISED RECOMMENDATIONS

Based on this analysis, what should they do next?

Provide 5-7 actionable recommendations prioritised by:
1. High impact, easy to implement (Quick win)
2. High impact, requires effort (Moderate)
3. Lower impact but worth considering (Significant)

For each recommendation:
- **What to do**
- **Why it matters** based on the data
- **How to execute it** (concrete steps)
- **Effort level**: Quick win | Moderate | Significant

${questionContext}
${platformContext}
${timeContext}
${topicContext}

Tone: Direct, analytical, action-oriented. Don't sugarcoat concerns but frame constructively. Use evidence from the data throughout.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: generateResponses ? "Generate response templates." : `Analyse this engagement data:\n\n${engagementData}` },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI processing failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("engagement-analysis error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
