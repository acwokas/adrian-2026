import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { formData, regenerateSection } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const companySizeMap: Record<string, string> = {
      startup: "Startups (1-20 people)",
      small: "Small teams (21-100 people)",
      mid: "Mid-market (101-1000 people)",
      enterprise: "Enterprise (1000+ people)",
      "not-specific": "Not company-specific",
    };

    const context = `
- Product: ${formData.productName} - ${formData.productDescription}
- Audience: ${formData.audienceRole}, ${companySizeMap[formData.companySize] || formData.companySize}, cares about ${formData.audienceCares}
- Markets: ${formData.primaryMarkets}${formData.marketNotes ? `. Considerations: ${formData.marketNotes}` : ""}
- Problem: ${formData.coreProblem}
- Differentiators: ${formData.differentiators}
- Direct Competitors: ${formData.directCompetitors || "Not specified"}
- Indirect Alternatives: ${formData.indirectAlternatives || "Not specified"}
- Tone: ${formData.tones?.replace(/,/g, ", ")}${formData.toneNotes ? `. Notes: ${formData.toneNotes}` : ""}
- Platforms: ${formData.platforms?.replace(/,/g, ", ")}
`.trim();

    let systemPrompt: string;

    if (regenerateSection) {
      systemPrompt = `You are a brand positioning strategist. Based on the brand context provided, regenerate just the ${regenerateSection} section with more depth, clarity, and specificity. Use the same format as the original. Be specific to this brand's actual context. Avoid generic advice.

Brand context:
${context}

Generate only the ${regenerateSection} section. Start with the section heading (## ${regenerateSection.toUpperCase()}).`;
    } else {
      systemPrompt = `You are a brand positioning strategist. Based on the information provided, generate a comprehensive brand profile with four sections.

## POSITIONING SUMMARY

A clear, concise statement of:
- What the product is
- Who it's for (role, company size)
- What problem it solves
- Why it's different from alternatives
- Primary value proposition

Write this as 2-3 paragraphs that could be shared with a team, used in pitches, or referenced when creating content. Be specific, avoid jargon, focus on clarity.

## AUDIENCE PERSONAS

Create 2-3 detailed personas based on the audience information provided.

For each persona include:
- **Name and title** (realistic)
- **Day-to-day responsibilities**
- **Core challenges**
- **What they care about when evaluating solutions**
- **How they prefer to consume information**
- **What language resonates with them**

## BRAND VOICE GUIDE

Based on selected tone attributes and context, define:
- **Voice characteristics** (expand on selected tones)
- **Language to use** vs **Language to avoid**
- **Sentence structure preferences** (short/long, active/passive)
- **Degree of formality**
- **How to handle technical complexity**
- **Example phrases that work** vs **Example phrases that don't work**

Make this actionable for someone writing content.

## CONTENT PILLARS

Identify 4-6 core themes this brand should talk about consistently.

For each pillar:
- **Pillar name**
- **Why it matters** to the audience
- **Example topics/angles** within this pillar
- **How it connects** to the product value

Use all provided context. Be specific to their actual situation. Avoid generic advice. This should feel custom-built for this exact brand.

Brand context:
${context}`;
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
          { role: "user", content: "Generate the brand profile based on the context provided." },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI processing failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("brand-profile-generate error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
