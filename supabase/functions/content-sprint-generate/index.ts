import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { profileData, sprintConfig, optimizePost } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const companySizeMap: Record<string, string> = {
      startup: "Startups (1-20 people)",
      small: "Small teams (21-100 people)",
      mid: "Mid-market (101-1000 people)",
      enterprise: "Enterprise (1000+ people)",
      "not-specific": "Not company-specific",
    };

    let systemPrompt: string;

    if (optimizePost) {
      systemPrompt = `You are a content strategist. Improve this ${optimizePost.platform} post. Make it more engaging, specific, and actionable. Keep the core message but sharpen execution. Follow the brand voice.

Brand voice: ${optimizePost.tones || "Professional, Direct"}

Original post:
${optimizePost.content}

Return ONLY the improved post text. No explanations.`;
    } else {
      const formData = profileData.formData || profileData;
      const profile = profileData.profile || "";
      const duration = sprintConfig.duration || 7;
      const platforms = sprintConfig.platforms || [];
      const themes = sprintConfig.themes || [];
      const events = sprintConfig.events || "";
      const toneSlider = sprintConfig.toneSlider ?? 50;

      const toneDirection = toneSlider < 30 ? "Lean more professional and formal." :
        toneSlider > 70 ? "Lean more conversational and casual." : "Balance professional and conversational.";

      const context = `
- Product: ${formData.productName} - ${formData.productDescription}
- Audience: ${formData.audienceRole}, ${companySizeMap[formData.companySize] || formData.companySize}, cares about ${formData.audienceCares}
- Markets: ${formData.primaryMarkets || "Global"}
- Problem: ${formData.coreProblem}
- Differentiators: ${formData.differentiators}
- Tone: ${formData.tones?.replace(/,/g, ", ")}${formData.toneNotes ? `. Notes: ${formData.toneNotes}` : ""}
- Tone adjustment: ${toneDirection}
- Content Pillars: ${themes.length > 0 ? themes.join(", ") : "Balance all pillars equally"}
${events ? `- Special events: ${events}` : ""}
`.trim();

      systemPrompt = `You are a content strategist creating a ${duration}-day content calendar.

Based on the brand profile provided, generate daily content for these platforms: ${platforms.join(", ")}.

For EACH DAY, provide:

## Day {N}

**Theme**: {Which content pillar this post reinforces}

${platforms.map(p => `### ${p}

**Post**:
{Write the actual post copy, platform-optimised}

**Why this works**:
{1-2 sentences explaining the positioning/angle}

**Hashtags**: {Platform-appropriate tags}

**Best time to post**: {Suggest timing based on platform and audience}

**CTA**: {Include a clear call-to-action}

**Notes**: {Any platform-specific formatting guidance}`).join("\n\n")}

CONTENT STRATEGY GUIDELINES:
- Use the brand's positioning to stay on-message
- Write for ${formData.audienceRole}
- Follow the brand voice: ${formData.tones?.replace(/,/g, ", ")}
- ${toneDirection}
- Platform-specific optimisation:
  * LinkedIn: Professional thought leadership, 1500 char max, 3-5 hashtags
  * X (Twitter): Concise, conversational, 280 char max, 2-3 hashtags, thread if complex
  * Reddit: Community-focused, helpful not promotional, subreddit-aware
  * Company blog: Long-form, SEO-optimised, comprehensive
  * Newsletter: Personal, value-first, segmented by interest
- Vary post types: questions, insights, case studies, tips, stories
- Build narrative arc across the sprint (don't repeat themes back-to-back)
- Include mix of educational, engaging, and promotional (70/20/10 ratio)
${events ? `- Weave in these events: ${events}` : ""}

Brand context:
${context}

${profile ? `Full brand profile for reference:\n${profile}` : ""}

Be specific, actionable, and copy-ready. This should be ready to paste and post.`;
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
          { role: "user", content: optimizePost ? "Improve this post." : `Generate the ${sprintConfig?.duration || 7}-day content sprint.` },
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
    console.error("content-sprint-generate error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
