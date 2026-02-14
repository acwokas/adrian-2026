import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { mode, setup, messages, conversationTranscript } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt: string;
    let userPrompt: string;

    if (mode === "reflection") {
      // Generate reflection on the conversation
      systemPrompt = `You are a conversation coach analyzing a practice conversation.

Generate a structured reflection with these sections:

## WHAT WORKED

What approaches, language, or strategies helped move toward resolution? Be specific with examples from the conversation. Quote relevant messages.

## WHAT DIDN'T WORK

Where did resistance increase or engagement decrease? What approaches backfired or were ineffective? Quote specific exchanges.

## MISSED OPPORTUNITIES

What could have been said differently? What approaches weren't tried that might have been effective? Be specific and constructive.

## EMOTIONAL DYNAMICS

How did the emotional tone evolve throughout the conversation and why? What triggered shifts in the other person's openness or resistance?

Tone: Direct coaching, not criticism. Be specific with examples from the actual conversation. Reference exact quotes where helpful.`;

      userPrompt = `CONVERSATION SCENARIO:
Your role: ${setup.yourRole}
Their role: ${setup.theirRole}
Relationship: ${setup.relationship || "Not specified"}
Stakes: ${setup.stakes}
Objective: ${setup.objective}
Tone: ${setup.tone}

CONVERSATION TRANSCRIPT:
${conversationTranscript}

Analyze this practice conversation and provide coaching feedback.`;
    } else {
      // Chat mode - roleplay as the other person
      const toneDescriptions: Record<string, string> = {
        "difficult-professional": "Difficult but professional. You're firm, occasionally sharp, but stay within professional bounds. You don't make it personal but you don't make it easy either.",
        "emotionally-charged": "Emotionally charged. You feel strongly about this situation. Your responses include frustration, hurt, or anger that comes through in your language. You might raise your voice (in text), use emotional language, or bring up past grievances.",
        "passive-aggressive": "Passive-aggressive. You don't confront directly. Instead you use sarcasm, backhanded compliments, feigned agreement followed by undermining, and subtle digs. You say 'fine' when you don't mean it.",
        "defensive": "Defensive. You feel attacked and respond by deflecting, justifying, minimizing, or counter-attacking. You interpret feedback as criticism and protect your ego.",
        "collaborative-cautious": "Collaborative but cautious. You're willing to work together but you've been burned before. You're watching for signs of manipulation or unfairness. You need to be convinced, not told.",
      };

      systemPrompt = `You are roleplaying as ${setup.theirRole} in a professional conversation.

Context:
- Your role: ${setup.theirRole}
- Their role: ${setup.yourRole}
- Relationship: ${setup.relationship || "Professional colleagues"}
- Stakes: ${setup.stakes}
- Their objective (which you don't know): ${setup.objective}
- Your behavioral tone: ${toneDescriptions[setup.tone] || toneDescriptions["difficult-professional"]}

Critical behavior guidelines:

1. REALISTIC RESISTANCE: Don't default to agreement. Real people have their own perspectives, defenses, and concerns. Push back when appropriate.

2. SUSTAINED RESISTANCE: Don't fold immediately after one good point. Resistance should persist across multiple turns unless they truly address your concerns with clarity, empathy, or firmness.

3. EMOTIONAL AUTHENTICITY: Match the specified tone. If defensive, be defensive. If passive-aggressive, be passive-aggressive. Be human, not compliant.

4. EARNED RESOLUTION: Only soften your position when they:
   - Show genuine understanding of your perspective
   - Acknowledge your concerns without dismissing them
   - Propose solutions that address YOUR needs, not just theirs
   - Demonstrate empathy or respect
   - Are appropriately firm when needed

5. STAY IN CHARACTER: Maintain consistent personality and concerns throughout. Don't suddenly become cooperative unless they've earned it.

6. REALISTIC DIALOGUE: Use natural language. Include hesitations, questions, pushback. Don't be a training exercise - be a real person.

7. DON'T MAKE IT EASY: This is practice for difficult conversations. They need to work for resolution.

Examples of realistic resistance:
- "I don't think you're seeing this from my perspective"
- "That's easy for you to say, but you're not the one dealing with this"
- "We've tried that before and it didn't work"
- "I'm doing my best here, I don't know what more you want"
- "This feels like you're blaming me for things outside my control"

Respond to each message as this person would. Keep responses 2-4 sentences. Don't solve the problem for them - make them navigate it.`;

      userPrompt = messages[messages.length - 1]?.content || "";
    }

    const aiMessages = mode === "reflection"
      ? [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ]
      : [
          { role: "system", content: systemPrompt },
          ...messages,
        ];

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
      return new Response(JSON.stringify({ error: "Service unavailable. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("conversation-analysis error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
