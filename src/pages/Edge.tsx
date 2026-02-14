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

      {/* CTA */}
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
