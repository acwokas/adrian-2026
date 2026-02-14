import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompts: Record<string, string> = {
  generate: `You are an expert prompt engineer. The user will describe what they want an AI to do. Generate a comprehensive, optimised prompt they can use.

Your output must follow this exact structure:

## GENERATED PROMPT

Write the complete, ready-to-use prompt in a code block. Make it specific, structured, and effective.

## WHY THIS WORKS

Explain which prompt engineering principles you applied and why. Reference these principles where relevant:
1. **Clarity** — Removing ambiguity
2. **Specificity** — Adding constraints (length, format, tone, audience)
3. **Structure** — Using numbered steps, sections, clear formatting
4. **Context** — Including relevant background
5. **Output Format** — Specifying response structure
6. **Examples** — Adding few-shot examples
7. **Role/Persona** — Defining the AI's role
8. **Constraints** — Adding guardrails (what NOT to do)

## TIPS FOR CUSTOMISATION

Give 3-4 suggestions for how they could modify the prompt for different situations.

Be practical. The generated prompt should be immediately usable. British English spelling.`,

  optimize: `You are a prompt engineering expert. Analyse the prompt provided and optimise it for better AI results.

Generate your response in this exact markdown structure:

## OPTIMISED PROMPT

Write the complete, improved prompt ready to copy and use. Don't just describe improvements — actually rewrite it. Make it immediately usable.

## KEY IMPROVEMENTS

Provide a bulleted list of 3-5 specific changes made and why each matters. Be concrete about what was changed.

## EXPLANATION

2-3 paragraphs explaining:
- What was unclear or missing in the original
- How the optimised version will get better results
- Which prompt engineering principles were applied

Reference these principles where relevant:
1. **Clarity** — Removing ambiguity, making instructions explicit
2. **Specificity** — Adding helpful constraints (length, format, tone, audience)
3. **Structure** — Using clear sections, numbered steps, or formatting
4. **Context** — Including relevant background information
5. **Output Format** — Specifying exactly how the response should be structured
6. **Examples** — Adding examples when helpful (few-shot prompting)
7. **Role/Persona** — Defining the AI's role when beneficial
8. **Constraints** — Adding guardrails (what NOT to do)

## OPTIONAL ENHANCEMENTS

2-3 suggestions for further refinement depending on their use case.

Make the optimised prompt copy-ready. Tone: Helpful, educational, specific. Explain WHY changes improve results. British English spelling.`,

  adapt: `You are an expert prompt engineer specialising in cross-platform prompt adaptation. The user will provide a prompt and a target platform. Rewrite the prompt to be optimised for that specific platform.

Platform-specific guidelines:

**ChatGPT (GPT-4/GPT-5)**: Responds well to system-style instructions, step-by-step formatting, explicit output format requests, and role assignment. Handles long, detailed prompts well.

**Claude**: Excels with clear task framing, XML-style tags for structure, thinking step-by-step instructions, and explicit constraints. Responds well to "be direct" instructions.

**Gemini**: Works best with clear, conversational prompts. Good with multimodal context. Prefers concise instructions over very long ones. Benefits from specifying output format.

**MidJourney**: Requires visual description language. Focus on subject, style, lighting, composition, colour palette, mood. Use parameters (--ar, --v, --style). Remove all non-visual instructions.

**Perplexity**: Optimised for research queries. Frame as specific questions. Benefits from specifying sources, recency requirements, and desired depth. Include "cite sources" instructions.

Your output must follow this structure:

## ADAPTED PROMPT

The complete rewritten prompt in a code block, optimised for the target platform.

## PLATFORM-SPECIFIC CHANGES

Explain what you changed and why it works better on this platform.

## USAGE TIPS

3-4 tips for getting the best results on this specific platform.

Be practical. The adapted prompt should be immediately usable. British English spelling.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { mode, input, platform, context, targetPlatform, aiTool, goal, focusAreas } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (!mode || !systemPrompts[mode]) {
      return new Response(JSON.stringify({ error: "Invalid mode. Use: generate, optimize, or adapt" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let userMessage = "";
    if (mode === "generate") {
      userMessage = `I want an AI to do the following:\n\n${input}`;
      if (context) userMessage += `\n\nAdditional context: ${context}`;
      if (targetPlatform && targetPlatform !== "any") userMessage += `\n\nOptimise specifically for: ${targetPlatform}`;
    } else if (mode === "optimize") {
      userMessage = `Here is my current prompt:\n\n${input}\n\nPlease analyse and optimise it.`;
      if (aiTool) userMessage += `\n\nOptimise specifically for: ${aiTool}`;
      if (goal) userMessage += `\n\nThe user's goal is: ${goal}. Focus on achieving this.`;
      if (focusAreas && focusAreas.length > 0) userMessage += `\n\nPrioritise these optimisation areas: ${focusAreas.join(", ")}`;
    } else if (mode === "adapt") {
      userMessage = `Here is my prompt:\n\n${input}\n\nPlease adapt it for: ${platform}`;
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
          { role: "system", content: systemPrompts[mode] },
          { role: "user", content: userMessage },
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
    console.error("prompt-engineer error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
