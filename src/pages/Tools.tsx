import { Layout } from "@/components/layout/Layout";
import { AnimatedSection, StaggeredChildren, StaggeredItem } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";

const toolSections = [
  {
    pillar: "EVALUATE",
    heading: "Diagnostic & Simulation Tools",
    body: "Tools for assessing intelligence readiness, identifying fragmentation, and testing scenarios before deployment.",
  },
  {
    pillar: "DEFINE",
    heading: "Clarity & Planning Tools",
    body: "Frameworks and templates for establishing intent, ownership, priorities and decision architecture.",
  },
  {
    pillar: "ELEVATE",
    heading: "Performance & Optimization Tools",
    body: "Instruments for measuring impact, optimizing execution, and translating capability into sustained advantage.",
  },
];

export default function Tools() {
  return (
    <Layout>
      <SEO
        canonical="/tools"
        title="EDGE Instruments — Tools for Applied Intelligence"
        description="Structured tools and templates aligned to each EDGE Framework pillar. Diagnostic, planning, and performance instruments for practical intelligence adoption."
        keywords="EDGE tools, AI readiness assessment, intelligence diagnostic, AI governance tools, applied intelligence instruments"
      />

      {/* Hero */}
      <section className="section-spacing">
        <div className="container-wide max-w-[900px] mx-auto">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15]">
              EDGE Instruments
            </h1>
            <div className="space-y-4 max-w-[720px]">
              <p className="text-muted-foreground leading-relaxed">
                The EDGE Framework is operationalised through structured tools and templates aligned to each pillar.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                These tools support practical application of the framework across different organisational contexts.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tool Sections */}
      <section className="pb-10 md:pb-12 lg:pb-14">
        <div className="container-wide max-w-[900px] mx-auto">
          <StaggeredChildren className="space-y-8 lg:space-y-10">
            {toolSections.map((section) => (
              <StaggeredItem key={section.pillar}>
                <div className="p-6 md:p-8 lg:p-10 bg-card border border-border/30 space-y-4">
                  <span className="text-xs uppercase tracking-widest text-accent font-medium">
                    {section.pillar}
                  </span>
                  <h2 className="text-xl md:text-2xl font-semibold">{section.heading}</h2>
                  <p className="text-muted-foreground leading-relaxed max-w-[640px]">
                    {section.body}
                  </p>
                  <div className="pt-4 border-t border-border/20 mt-4">
                    <p className="text-sm text-muted-foreground/60 italic">
                      Tools will be integrated here
                    </p>
                  </div>
                </div>
              </StaggeredItem>
            ))}
          </StaggeredChildren>
        </div>
      </section>

      {/* Govern Note */}
      <section className="pb-10 md:pb-12 lg:pb-14">
        <div className="container-wide max-w-[900px] mx-auto">
          <AnimatedSection>
            <div className="p-6 md:p-8 border-l-2 border-accent/40">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="text-accent font-medium">GOVERN</span> — Governance tools are typically frameworks and templates delivered through advisory engagements rather than digital tools.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
