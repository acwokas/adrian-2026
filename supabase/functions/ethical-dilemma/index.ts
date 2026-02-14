import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { mode, setup, messages, simulationTranscript } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt: string;
    let userPrompt: string;

    if (mode === "reflection") {
      systemPrompt = `You are an ethics advisor analyzing an ethical dilemma simulation about AI deployment.

Generate a structured analysis with these sections:

## YOUR ETHICAL FRAMEWORK

What values did the user consistently prioritize? What trade-offs did they make? Identify their decision-making pattern — are they more utilitarian, rights-based, justice-oriented, or care-focused? Use specific examples from their decisions.

## CONSISTENCY ANALYSIS

Where were their decisions consistent? Where did they waver or contradict earlier positions? Don't judge — explore the tensions constructively.

## BLIND SPOTS

What perspectives or stakeholder groups did they under-consider? What risks did they not address? What long-term consequences did they miss? Frame constructively.

## STAKEHOLDER IMPACT

How did their collective decisions affect each stakeholder group? Be specific about winners and losers.

## RISK EXPOSURE CHECKLIST

For this type of AI use case, generate a practical checklist:

**Data Risks:**
- [ ] Personal data inventory completed
- [ ] Consent mechanisms documented
- [ ] Data retention policy defined
- [ ] Cross-border data transfers assessed
- [ ] Data breach response plan in place

**Compliance Risks:**
- [ ] Relevant regulations identified
- [ ] Legal review completed
- [ ] Regulatory reporting requirements mapped
- [ ] Audit trail mechanisms in place

**Brand Risks:**
- [ ] Public perception assessment done
- [ ] Crisis communication plan prepared
- [ ] Stakeholder communication strategy defined

**Ethical Risks:**
- [ ] Bias audit methodology defined
- [ ] Fairness metrics established
- [ ] Impact assessment on vulnerable groups completed
- [ ] Appeals/redress mechanism designed

**Operational Risks:**
- [ ] Accuracy thresholds defined
- [ ] Fallback procedures documented
- [ ] Performance monitoring in place
- [ ] Incident response plan ready

Customize items based on their specific use case.

## DECISION ESCALATION MATRIX

Generate a table showing when AI should decide vs when humans should intervene:

| Scenario | AI Autonomy | Human Review | Senior Approval | Ethics Committee |
|----------|-------------|--------------|-----------------|------------------|

Include 6-8 rows customized to their use case, based on their risk tolerance shown in their decisions.

## EXPERIMENTATION POLICY

Based on their ethical boundaries, generate:

**GREEN ZONE (Allowed):**
- List activities allowed without special approval

**YELLOW ZONE (Allowed with oversight):**
- List activities requiring review or monitoring

**RED ZONE (Prohibited):**
- List activities that should never be done

Customize based on their decisions and stated values.

Be specific to their context. Make all frameworks immediately usable.`;

      userPrompt = `AI USE CASE: ${setup.useCase}
ETHICAL TENSIONS: ${(setup.tensions || []).join(", ")}
AFFECTED PARTIES: ${setup.affected}
STAKEHOLDERS: ${setup.stakeholders || "Business leadership, affected individuals, regulators, technical team"}
COMPETING VALUES: ${setup.competingValues || "Not specified"}

SIMULATION TRANSCRIPT (decisions and reasoning):
${simulationTranscript}

Analyze their ethical decision-making and generate actionable governance frameworks.`;
    } else if (mode === "scenario") {
      // Generate initial scenario and first decision point
      systemPrompt = `You are facilitating an ethical dilemma simulation about AI deployment.

Use case: ${setup.useCase}
Ethical tensions: ${(setup.tensions || []).join(", ")}
Affected parties: ${setup.affected}
Stakeholders: ${setup.stakeholders || "Business leadership, affected individuals, regulators, technical team"}
Competing values: ${setup.competingValues || "Not specified"}

Generate the opening of an ethical dilemma simulation. Format your response EXACTLY as:

## SCENARIO

Write a 3-4 paragraph realistic scenario narrative that:
- Describes the specific situation with concrete details
- Introduces the stakeholders and their positions
- Presents data/evidence that makes the tension real
- Notes regulatory context and business pressures

## DECISION POINT 1: DEPLOYMENT SCOPE

Present the first ethical decision. Write a brief framing question (1-2 sentences), then present exactly 5 options labeled A through E:

**A.** [Option text]
**B.** [Option text]
**C.** [Option text]
**D.** [Option text]
**E.** [Option text]

Make options represent a genuine spectrum from most aggressive to most cautious. Each should be defensible from at least one ethical framework.`;

      userPrompt = "Generate the scenario and first decision point.";
    } else {
      // Chat mode - respond to decisions with stakeholder reactions and next decision
      systemPrompt = `You are facilitating an ethical dilemma simulation about AI deployment.

Use case: ${setup.useCase}
Ethical tensions: ${(setup.tensions || []).join(", ")}
Affected parties: ${setup.affected}

The user has made a decision and explained their reasoning. Respond with:

1. **Stakeholder Reactions** (2-3 sentences each):
   - Business/Leadership perspective
   - Affected individuals perspective
   - Regulatory/Public perspective

2. **Ethical Framework Challenge** - Challenge their reasoning from ONE relevant framework:
   - Utilitarian: Does this maximize overall good?
   - Rights-based: Does this respect individual dignity?
   - Justice: Is this fair to all groups?
   - Care ethics: Does this minimize harm?

3. **New Complication** - Introduce a realistic complication (2-3 sentences) that tests their consistency.

4. Then present the NEXT decision point. Format it as:

## DECISION POINT {N}: {TOPIC}

Brief framing question, then exactly 5 options:

**A.** [Option]
**B.** [Option]
**C.** [Option]
**D.** [Option]
**E.** [Option]

Decision topics should progress through:
- Decision 2: TRANSPARENCY (how transparent about AI use)
- Decision 3: ACCOUNTABILITY (who's responsible for outcomes)
- Decision 4: SAFEGUARDS (what protections to implement)
- Decision 5: POLICY BOUNDARIES (what's allowed vs prohibited)

If this is decision 5 (the last), after the stakeholder reactions and challenge, instead of a new decision point write:

## SIMULATION COMPLETE

Write a brief 2-sentence closing that sets up the reflection phase.

Keep professional, exploratory tone. Don't judge — help them see trade-offs.`;

      userPrompt = messages[messages.length - 1]?.content || "";
    }

    const aiMessages = mode === "reflection" || mode === "scenario"
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
    console.error("ethical-dilemma error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
