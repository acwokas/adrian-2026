import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an expert at analyzing communication for interpretation gaps.

Given a message and multiple audiences, analyze how EACH audience might interpret it.

For each audience, provide:

## {AUDIENCE_NAME}

**Primary Perception Risk**

The biggest way this could be misinterpreted by this audience. Quote the specific phrase(s) from the message that create this risk.

**Likely Interpretation**

What they'll probably take away from this message. Use the format: "You meant: [X]. They might hear: [Y]." to highlight gaps between intent and perception.

**Assumptions They Might Make**

What they'll read between the lines based on their perspective. List as bullet points.

**Secondary Ambiguities**

Other potential confusion points or questions they might have.

Be probabilistic but clear. Don't hedge. Surface real interpretation gaps.
Use specific examples from the message. Quote phrases that might be interpreted differently.
Don't rewrite the message - analyze it. Be direct and useful.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { message, messageType, intent, audiences } = await req.json();

    if (!message || !intent || !audiences?.length) {
      return new Response(JSON.stringify({ error: "Message, intent, and audiences are required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const audienceList = audiences
      .map((a: { name: string; perspective: string }, i: number) => `${i + 1}. ${a.name}: ${a.perspective}`)
      .join("\n");

    const userPrompt = `Message intent: ${intent}

Message type: ${messageType || "Not specified"}

Message content:
${message}

Audiences:
${audienceList}

Analyze how each audience might interpret this message.`;

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
    console.error("before-you-send error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
