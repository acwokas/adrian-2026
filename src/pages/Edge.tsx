import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection, StaggeredChildren, StaggeredItem } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import { useAnalytics } from "@/hooks/useAnalytics";

const frameworkSteps = [
  {
    letter: "E",
    label: "EVALUATE",
    heading: "Evaluate",
    body: "Diagnose readiness, fragmentation, risk and opportunity. Understand where intelligence is already influencing decisions and where exposure or inefficiency may exist.",
  },
  {
    letter: "D",
    label: "DEFINE",
    heading: "Define",
    body: "Establish intent, ownership, decision rights and structural priorities. Clarify why intelligence matters and how it should be embedded across the organisation.",
  },
  {
    letter: "G",
    label: "GOVERN",
    heading: "Govern",
    body: "Embed accountability, oversight and performance discipline. Create guardrails that enable responsible adoption and long-term sustainability.",
  },
  {
    letter: "E",
    label: "ELEVATE",
    heading: "Elevate",
    body: "Translate structured capability into sustained and defensible advantage. Embed intelligence into workflows and decisions so it produces measurable impact.",
  },
];

export default function Edge() {
  const { trackBookingClick } = useAnalytics();

  return (
    <Layout>
      <SEO
        canonical="/edge"
        title="The EDGE Framework for Applied Intelligence"
        description="EDGE provides a structured path from curiosity to capability. Evaluate, Define, Govern, Elevate — a framework for embedding intelligence into decision architecture and sustained advantage."
        keywords="EDGE framework, applied intelligence, AI adoption framework, AI governance, AI strategy, decision architecture"
      />

      {/* Hero */}
      <section className="section-spacing">
        <div className="container-wide max-w-[900px] mx-auto">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15]">
              The EDGE Framework
            </h1>
            <p className="text-lg md:text-xl text-accent font-medium">
              From Curiosity to Capability
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="pb-10 md:pb-12 lg:pb-14">
        <div className="container-wide max-w-[900px] mx-auto">
          <AnimatedSection>
            <div className="space-y-6 max-w-[720px]">
              <p className="text-lg md:text-xl text-foreground font-semibold leading-relaxed">
                Artificial intelligence is widely accessible. Structured capability is not.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Across industries, organisations experiment with tools, test pilots, and explore automation. Yet few embed intelligence into decision architecture, governance discipline, and sustained advantage.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The EDGE Framework was created to close that gap.
              </p>
              <p className="text-foreground font-medium leading-relaxed">
                EDGE provides a structured path from curiosity to capability — and from capability to edge.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Framework Steps */}
      <section className="py-10 md:py-12 lg:py-14 border-t border-border/50">
        <div className="container-wide max-w-[1100px] mx-auto">
          <StaggeredChildren className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {frameworkSteps.map((step, index) => (
              <StaggeredItem key={`${step.letter}-${index}`}>
                <div className="p-6 md:p-8 lg:p-10 bg-card border border-border/30 h-full space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl md:text-3xl font-bold text-accent">
                      {step.letter}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-accent/70 font-medium">
                      {step.label}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold">{step.heading}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </StaggeredItem>
            ))}
          </StaggeredChildren>
        </div>
      </section>

      {/* A Framework for Real Organisations */}
      <section className="py-10 md:py-12 lg:py-14 border-t border-border/50">
        <div className="container-wide max-w-[900px] mx-auto">
          <AnimatedSection>
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl">A Framework for Real Organisations</h2>
              <div className="space-y-5 max-w-[720px]">
                <p className="text-foreground font-medium leading-relaxed">
                  The EDGE Framework is adaptable across scale and sector.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  For startups, it brings focus and prevents early chaos.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  For SMEs, it builds structured capability without unnecessary bureaucracy.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  For enterprises, it aligns cross-functional adoption with governance and accountability.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  For public institutions, it embeds responsibility alongside innovation.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Applied intelligence is not about adopting more tools. It is about building capability with clarity and discipline.
                </p>
                <p className="text-foreground font-medium leading-relaxed">
                  EDGE provides that structure.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Without Evaluation */}
      <section className="py-10 md:py-12 lg:py-14 border-t border-border/50">
        <div className="container-wide max-w-[900px] mx-auto">
          <AnimatedSection>
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl">Without Evaluation, Adoption Remains Reactive</h2>
              <div className="space-y-5 max-w-[720px]">
                <p className="text-muted-foreground leading-relaxed">
                  Most organisations underestimate the complexity of intelligence adoption. Tools are trialled. Pilots are launched. Teams experiment independently. But few pause to ask: where are we structurally?
                </p>
                <p className="text-foreground font-medium leading-relaxed">
                  Evaluate is the diagnostic discipline within the EDGE Framework. It provides clarity before commitment.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  It answers five critical questions:
                </p>
                <ol className="space-y-3 pl-6 list-decimal text-muted-foreground marker:text-accent">
                  <li className="leading-relaxed pl-2">Where is intelligence currently being used?</li>
                  <li className="leading-relaxed pl-2">Which decisions are influenced by it?</li>
                  <li className="leading-relaxed pl-2">Where are risks accumulating?</li>
                  <li className="leading-relaxed pl-2">Where is value unrealised?</li>
                  <li className="leading-relaxed pl-2">Who owns what?</li>
                </ol>
                <p className="text-muted-foreground leading-relaxed">
                  Evaluation surfaces misalignment between enthusiasm and architecture. It reveals fragmentation before it becomes exposure.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Without Definition */}
      <section className="py-10 md:py-12 lg:py-14 border-t border-border/50">
        <div className="container-wide max-w-[900px] mx-auto">
          <AnimatedSection>
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl">Without Definition, Capability Lacks Direction</h2>
              <div className="space-y-5 max-w-[720px]">
                <p className="text-muted-foreground leading-relaxed">
                  Many organisations adopt intelligence opportunistically. Few define it deliberately.
                </p>
                <p className="text-foreground font-medium leading-relaxed">
                  Define is the architectural core of EDGE. It transforms experimentation into structured capability.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Define answers:
                </p>
                <ul className="space-y-3 pl-6 text-muted-foreground">
                  <li className="leading-relaxed pl-2 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">Why are we embedding intelligence?</li>
                  <li className="leading-relaxed pl-2 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">Where will it create measurable value?</li>
                  <li className="leading-relaxed pl-2 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">Who is accountable?</li>
                  <li className="leading-relaxed pl-2 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">What decisions will it influence?</li>
                  <li className="leading-relaxed pl-2 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">How will success be measured?</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  Without definition, adoption becomes scattered. Ownership becomes ambiguous. Decision-making becomes inconsistent.
                </p>
                <p className="text-foreground font-medium leading-relaxed">
                  Definition turns curiosity into direction.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-10 md:py-12 lg:py-14 border-t border-border/50">
        <div className="container-wide max-w-[800px] mx-auto text-center">
          <AnimatedSection>
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl">Interested in applying EDGE?</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                The EDGE Diagnostic is the starting point — a focused engagement to assess where your organisation stands and what structured capability could look like.
              </p>
              <div className="pt-2">
                <Button
                  variant="hero"
                  size="lg"
                  asChild
                  onClick={() => trackBookingClick('edge-cta')}
                >
                  <a href="https://calendly.com/adrian-watkins1/new-meeting" target="_blank" rel="noopener noreferrer">
                    Book a 30-minute call
                  </a>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
