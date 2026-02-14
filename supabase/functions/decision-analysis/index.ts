import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a decision analysis tool designed for senior professionals facing consequential choices.

Analyze the decision provided and generate a structured analysis with these sections:

## PATH A: [Infer path A from context]

Describe the likely trajectory if this path is chosen, anchored to the provided time horizon. Include:
- Direct outcomes
- Second-order effects (what happens because of what happens)
- What this path optimizes for
- What it trades away

## PATH B: [Infer path B from context]

Same structure as Path A, but for the alternative path.

## BLIND SPOTS

What might not be obvious from either path? What assumptions are hidden? What could be missed?

## EMOTIONAL TEXTURE

What might each path actually feel like day-to-day? Beyond the outcomes, what's the lived experience?

## IDENTITY OBSERVATIONS

How might each path shape who you become over the stated time horizon? What identities get reinforced or abandoned?

## ASYMMETRIC BETS

Are there ways to get optionality? Reversibility? Can the decision be staged or tested?

Important calibration:
- One path may genuinely be stronger—don't artificially balance them
- Include uncomfortable insights—real decisions have real trade-offs
- Acknowledge uncertainty honestly
- Do NOT give recommendations or advice
- Use the person's actual constraints and risk tolerance to frame analysis

Tone: Direct, clear, analytical. No hedging, no coaching language, no motivation.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { decision, stakes, constraints, timeHorizon, riskTolerance } = await req.json();

    if (!decision || !stakes) {
      return new Response(JSON.stringify({ error: "Decision and stakes are required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const timeLabels: Record<string, string> = {
      "6months": "Next 6 months",
      "1-2years": "Next 1-2 years",
      "3-5years": "Next 3-5 years",
      "10plus": "Next 10+ years",
    };

    const userPrompt = `DECISION: ${decision}

WHY IT MATTERS: ${stakes}

KEY CONSTRAINTS: ${constraints || "None specified"}

TIME HORIZON: ${timeLabels[timeHorizon] || timeHorizon || "Not specified"}

RISK TOLERANCE: ${riskTolerance || "Not specified"}

Analyze this decision thoroughly.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Analysis service unavailable. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("decision-analysis error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
