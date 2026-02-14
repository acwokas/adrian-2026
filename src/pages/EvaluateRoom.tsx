import { SimulationProvider, SimulationLayout, FormField, ExampleScenario, ResultsDisplay, useSimulation } from "@/components/simulation";
import type { SimulationRoomConfig } from "@/components/simulation";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { ArrowRight } from "lucide-react";

const roomConfig: SimulationRoomConfig = {
  id: "evaluate-readiness",
  title: "AI Readiness Diagnostic",
  pillar: "EVALUATE",
  icon: "🔍",
  description: "Assess your organisation's readiness to adopt and operationalise applied intelligence. Identify structural gaps before committing resources.",
  howItWorks: [
    "Describe your organisation's current state across a few key dimensions.",
    "The diagnostic analyses patterns across strategy, data, governance, and capability.",
    "Receive a structured readiness assessment with specific recommendations.",
  ],
  fields: [
    {
      id: "org_context",
      label: "Organisation context",
      type: "textarea",
      placeholder: "Briefly describe your organisation — industry, size, and what prompted interest in AI/intelligence adoption.",
      tooltip: "General context helps calibrate the assessment. No confidential details needed.",
      example: "Mid-size financial services firm (~2,000 staff) in Southeast Asia. Board has mandated an AI strategy but no central function exists yet.",
      maxLength: 500,
      required: true,
    },
    {
      id: "current_state",
      label: "Current AI/data initiatives",
      type: "textarea",
      placeholder: "What AI or data initiatives exist today? Include any tools, teams, or experiments underway.",
      example: "Marketing runs a chatbot. Data team of 4 produces monthly dashboards. Two failed ML pilots last year in credit scoring.",
      maxLength: 500,
      required: true,
    },
    {
      id: "primary_challenge",
      label: "Primary challenge",
      type: "select",
      placeholder: "Select your biggest challenge...",
      options: [
        { value: "strategy", label: "No clear AI strategy or roadmap" },
        { value: "data", label: "Data quality or accessibility issues" },
        { value: "talent", label: "Lack of skilled talent or capability" },
        { value: "governance", label: "No governance or oversight framework" },
        { value: "adoption", label: "Low adoption / resistance to change" },
        { value: "integration", label: "Can't integrate AI into existing workflows" },
      ],
      required: true,
    },
    {
      id: "desired_outcome",
      label: "Desired outcome",
      type: "textarea",
      placeholder: "What does success look like in 12 months?",
      example: "A functioning AI governance committee, two production AI use cases, and a clear capability roadmap endorsed by the executive team.",
      maxLength: 400,
    },
  ],
  examples: [
    {
      id: "finserv",
      title: "Financial Services — Early Stage",
      description: "A mid-size bank exploring AI with no central function.",
      values: {
        org_context: "Mid-size financial services firm (~2,000 staff) in Southeast Asia. Board has mandated an AI strategy but no central function exists yet.",
        current_state: "Marketing runs a chatbot. Data team of 4 produces monthly dashboards. Two failed ML pilots last year in credit scoring.",
        primary_challenge: "strategy",
        desired_outcome: "A functioning AI governance committee, two production AI use cases, and a clear capability roadmap endorsed by the executive team.",
      },
    },
    {
      id: "manufacturing",
      title: "Manufacturing — Scaling Pilots",
      description: "A manufacturer with successful pilots struggling to scale.",
      values: {
        org_context: "Large manufacturing company (8,000 employees) with operations across APAC. Have been experimenting with predictive maintenance and quality control AI.",
        current_state: "Three successful pilot projects in one factory. Dedicated data science team of 12. No framework to scale across other sites.",
        primary_challenge: "integration",
        desired_outcome: "Standardised deployment framework, AI integrated into operations at 5 sites, and measurable efficiency gains reported quarterly.",
      },
    },
  ],
  steps: [
    { id: "input", label: "Your context" },
    { id: "analysis", label: "Analysis" },
    { id: "results", label: "Results" },
  ],
};

function EvaluateContent() {
  const { phase, formData, setFormValue, setPhase, setLoading } = useSimulation();

  const canSubmit = formData.org_context?.trim() && formData.current_state?.trim() && formData.primary_challenge;

  const handleSubmit = () => {
    setPhase("active");
    setLoading(true);
    // Simulation logic will be wired in when we build the AI integration
    // For now, transition to reflection after a delay
    setTimeout(() => {
      setLoading(false);
      setPhase("reflection");
    }, 2000);
  };

  if (phase === "setup") {
    return (
      <div className="space-y-6">
        <ExampleScenario examples={roomConfig.examples} />
        {roomConfig.fields.map((field) => (
          <FormField key={field.id} config={field} value={formData[field.id] || ""} onChange={(v) => setFormValue(field.id, v)} />
        ))}
        <div className="pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            variant="hero"
            size="lg"
          >
            Run diagnostic
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  return <ResultsDisplay />;
}

export default function EvaluatePage() {
  return (
    <>
      <SEO
        canonical="/tools/evaluate"
        title="AI Readiness Diagnostic — EDGE Evaluate"
        description="Assess your organisation's readiness to adopt applied intelligence. Identify structural gaps in strategy, data, governance, and capability."
      />
      <SimulationProvider roomId={roomConfig.id} totalSteps={roomConfig.steps.length}>
        <SimulationLayout
          pillar="Evaluate"
          pillarPath="/tools"
          roomTitle={roomConfig.title}
          roomDescription={roomConfig.description}
          howItWorks={roomConfig.howItWorks}
        >
          <EvaluateContent />
        </SimulationLayout>
      </SimulationProvider>
    </>
  );
}
