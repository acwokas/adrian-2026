import { Layout } from "@/components/layout/Layout";
import { StaggeredChildren, StaggeredItem } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const evaluateTools = [
  { label: "Decision Simulation", desc: "Map terrain before choosing", href: "/tools/evaluate/decision" },
  { label: "Red Team Simulation", desc: "Pressure-test before presenting", href: "/tools/evaluate/redteam" },
];

const defineTools = [
  { label: "Brand Profile Generator", desc: "8-step positioning foundation", href: "/tools/define/brand-profile" },
  { label: "Content Sprint Generator", desc: "7 or 14-day content calendars", href: "/tools/define/content-sprint" },
  { label: "Engagement Analyzer", desc: "Paste feedback, get insights", href: "/tools/define/engagement" },
];

const toolSections = [
  {
    pillar: "EVALUATE",
    heading: "Diagnostic & Simulation Tools",
    body: "Rehearse decisions and pressure-test ideas before they matter. Private, realistic analysis without coaching or content generation.",
    tools: evaluateTools,
    hubHref: "/tools/evaluate",
    hubLabel: "Explore all Evaluate tools",
  },
  {
    pillar: "DEFINE",
    heading: "Positioning & Content Tools",
    body: "Create positioning clarity, generate platform-specific content, and understand what's resonating with your audience.",
    tools: defineTools,
    hubHref: "/tools/define",
    hubLabel: "Explore positioning tools",
  },
  {
    pillar: "GOVERN",
    heading: "Governance & Oversight Tools",
    body: "Frameworks and templates for establishing accountability, policy boundaries, risk management, and performance discipline.",
  },
  {
    pillar: "ELEVATE",
    heading: "Performance & Optimisation Tools",
    body: "Optimise AI interactions, improve prompt quality, and get better results faster. Built on proven prompt engineering principles.",
    tools: [
      { label: "Prompt Engineer", desc: "Generate, optimise, or adapt prompts", href: "/tools/elevate/prompt-engineer" },
    ],
    hubHref: "/tools/elevate",
    hubLabel: "Explore performance tools",
  },
];

export default function Tools() {
  return (
    <Layout>
      <SEO
        canonical="/tools"
        title="EDGE Instruments — Tools for Applied Intelligence"
        description="Structured tools and templates aligned to each EDGE Framework pillar. Diagnostic, planning, governance, and performance instruments for practical intelligence adoption."
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

      {/* Tool Cards */}
      <section className="pb-10 md:pb-12 lg:pb-14">
        <div className="container-wide max-w-[1100px] mx-auto">
          <StaggeredChildren className="grid md:grid-cols-2 gap-5 lg:gap-8">
            {toolSections.map((section) => (
              <StaggeredItem key={section.pillar}>
                <div className="p-6 md:p-8 lg:p-10 bg-card border border-border/30 h-full space-y-4">
                  <span className="text-xs uppercase tracking-widest text-accent font-medium">
                    {section.pillar}
                  </span>
                  <h3 className="text-xl font-semibold">{section.heading}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.body}
                  </p>
                  <div className="pt-4 border-t border-border/20">
                    {section.tools ? (
                      <div className="space-y-3">
                        {section.tools.map((tool) => (
                          <Link
                            key={tool.href}
                            to={tool.href}
                            className="flex items-center justify-between group text-sm"
                          >
                            <div>
                              <span className="text-foreground group-hover:text-accent transition-colors font-medium">{tool.label}</span>
                              <span className="text-muted-foreground/60 ml-2 hidden sm:inline">— {tool.desc}</span>
                            </div>
                            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-accent transition-colors shrink-0" />
                          </Link>
                        ))}
                        {section.hubHref && (
                          <Link
                            to={section.hubHref}
                            className="inline-flex items-center text-xs text-accent hover:underline underline-offset-4 pt-1"
                          >
                            {section.hubLabel || "Explore all tools"} <ArrowRight className="h-3 w-3 ml-1" />
                          </Link>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground/60 italic">
                        Tools coming soon
                      </p>
                    )}
                  </div>
                </div>
              </StaggeredItem>
            ))}
          </StaggeredChildren>
        </div>
      </section>
    </Layout>
  );
}
