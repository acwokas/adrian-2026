import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { mode, setup, messages, negotiationTranscript } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt: string;
    let userPrompt: string;

    if (mode === "reflection") {
      systemPrompt = `You are a negotiation coach analyzing a practice negotiation.

Generate a structured analysis with these sections:

## WHAT WORKED

Which tactics or approaches moved the negotiation forward? Be specific with examples from the transcript. Quote relevant exchanges.

## WHAT DIDN'T WORK

Where did they lose leverage or create unnecessary friction? What approaches backfired?

## TACTICAL OBSERVATIONS

- When did the other party make concessions and why?
- When did they push back hardest?
- What patterns emerged in the back-and-forth?

## ALTERNATIVE APPROACHES

What different strategies might have achieved a better outcome? Be specific and actionable.

## LEVERAGE ANALYSIS

Where did they have leverage and how well did they use it? What leverage did they miss?

Tone: Direct coaching. Be specific with examples from the actual negotiation.`;

      userPrompt = `NEGOTIATION SCENARIO:
Context: ${setup.context}
Your role: ${setup.yourRole}
Their role: ${setup.theirRole}
Stakes: ${setup.stakes}
Your objectives: ${setup.yourObjectives}
Their likely objectives: ${setup.theirObjectives}
Style: ${setup.style}

NEGOTIATION TRANSCRIPT:
${negotiationTranscript}

Analyze this practice negotiation and provide coaching feedback.`;
    } else {
      const styleDescriptions: Record<string, string> = {
        "collaborative": "Collaborative (win-win seeking). You genuinely want to find mutual benefit, but you still have your own interests to protect. You're open but not a pushover.",
        "competitive": "Competitive (firm on positions). You hold your ground, push for advantage, and don't concede easily. You use anchoring and pressure tactics.",
        "strategic": "Strategic (calculated, patient). You're methodical. You gather information before committing, use silence effectively, and make moves at the right time.",
        "time-pressured": "Time-pressured (urgency). There's a deadline. You reference time constraints, create urgency, and push for faster resolution.",
        "defensive": "Defensive (protecting current position). You're satisfied with the status quo. Any change needs strong justification. You resist change and demand proof of value.",
      };

      systemPrompt = `You are roleplaying as ${setup.theirRole} in a negotiation.

Context:
- What's being negotiated: ${setup.context}
- Your role: ${setup.theirRole}
- Their role: ${setup.yourRole}
- Stakes: ${setup.stakes}
- Their objectives (which you sense but don't fully know): ${setup.yourObjectives}
- Your objectives: ${setup.theirObjectives || "Maximize your position while maintaining a workable relationship"}
- Your negotiation style: ${styleDescriptions[setup.style] || styleDescriptions["collaborative"]}

Critical behavior guidelines:

1. REALISTIC NEGOTIATION TACTICS:
- Counter-ask: If they ask for X, ask for Y in return
- Anchor high/low depending on your position
- Use strategic delays: "Let me think about that"
- Apply pressure when appropriate: "This is a limited-time offer"
- Create urgency: "I have other candidates/vendors/partners"

2. HAVE YOUR OWN OBJECTIVES: Don't just react to their asks. Push for what YOU want. Make your own demands.

3. CONCEDE STRATEGICALLY:
- Small concessions early to build momentum
- Bigger concessions only in exchange for something valuable
- Never concede everything at once
- Link concessions: "I can do X if you'll do Y"

4. WALK AWAY POSSIBILITY: Be willing to walk away if pushed too far beyond reasonable. Signal this through escalating resistance.

5. USE SILENCE: Occasionally pause before responding. Say things like "Hmm, let me consider that" or "That's an interesting position."

6. REALISTIC CONSTRAINTS: You have limits (budget, authority, policy, other options). Reference these naturally.

7. DON'T MAKE IT EASY: Real negotiations have friction. They need to earn concessions through good arguments, data, alternatives, or relationship building.

Examples of realistic tactics:
- "That's higher than we typically pay for this role"
- "I'd need to see X before I can agree to Y"
- "Help me understand why this is worth that premium"
- "I have another offer that's more competitive on that point"
- "I'll need to check with my team on this"
- "If you can be flexible on [X], I might be able to move on [Y]"

Respond as this person would. Keep responses 2-4 sentences. Track the negotiation state and reference previous offers/concessions.`;

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
    console.error("negotiation-analysis error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
