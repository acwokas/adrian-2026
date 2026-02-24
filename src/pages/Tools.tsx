import { Layout } from "@/components/layout/Layout";
import { AnimatedSection, StaggeredChildren, StaggeredItem } from "@/components/AnimatedSection";
import { SEOHead } from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Search, Lightbulb, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const evaluateTools = [
  { label: "Decision Simulation", desc: "Map terrain before choosing", href: "/tools/evaluate/decision", badge: "Popular", badgeColor: "accent" as const },
  { label: "Red Team Simulation", desc: "Pressure-test before presenting", href: "/tools/evaluate/redteam" },
  { label: "Conversation Simulator", desc: "Rehearse difficult conversations", href: "/tools/evaluate/conversation" },
  { label: "Before You Send", desc: "Check how messages will land", href: "/tools/evaluate/before-you-send" },
  { label: "Negotiation Simulator", desc: "Practice negotiation dynamics", href: "/tools/evaluate/negotiation" },
];

const defineTools = [
  { label: "Brand Profile Generator", desc: "8-step positioning foundation", href: "/tools/define/brand-profile" },
  { label: "Content Sprint Generator", desc: "7 or 14-day content calendars", href: "/tools/define/content-sprint" },
  { label: "Engagement Analyzer", desc: "Paste feedback, get insights", href: "/tools/define/engagement" },
];

interface ToolItem {
  label: string;
  desc: string;
  href: string;
  badge?: string;
  badgeColor?: "accent" | "purple";
}

interface ToolSection {
  pillar: string;
  heading: string;
  body: string;
  tools?: ToolItem[];
  hubHref?: string;
  hubLabel?: string;
  note?: string;
}

const toolSections: ToolSection[] = [
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
    body: "Create positioning clarity, generate platform-specific content, and understand what resonates with your audience. Built for founders, operators, and marketers who need to think clearly before they act.",
    tools: defineTools,
    hubHref: "/tools/define",
    hubLabel: "Explore positioning tools",
    note: "These tools work together as a complete positioning and content system, or use them standalone for quick tasks.",
  },
  {
    pillar: "GOVERN",
    heading: "Governance & Oversight Tools",
    body: "Rehearse governance reviews and navigate ethical dilemmas. Establish accountability, manage risk, and make decisions under scrutiny.",
    tools: [
      { label: "Governance Review Simulator", desc: "Defend AI decisions to boards and leadership", href: "/tools/govern/governance-review", badge: "Produces frameworks", badgeColor: "purple" as const },
      { label: "Ethical Dilemma Simulator", desc: "Navigate competing values and stakeholder interests", href: "/tools/govern/ethical-dilemma" },
      { label: "Maturity Assessment", desc: "Evaluate governance maturity across 5 dimensions", href: "/tools/govern/maturity-assessment", badge: "Start here", badgeColor: "accent" as const },
    ],
    hubHref: "/tools/govern",
    hubLabel: "Explore governance tools",
    note: "Governance simulators produce downloadable frameworks: Decision Ownership Maps, Risk Checklists, Escalation Matrices, and Experimentation Policies, all customised to your context.",
  },
  {
    pillar: "ELEVATE",
    heading: "Performance & Optimization Tools",
    body: "Optimize AI interactions and elevate prompt quality for better results. Generate, improve, and adapt prompts using proven engineering principles.",
    tools: [
      { label: "Prompt Engineer", desc: "3 modes: Generate | Optimize | Adapt", href: "/tools/elevate/prompt-engineer" },
    ],
    hubHref: "/tools/elevate",
    hubLabel: "Open Prompt Engineer",
    note: "Built on prompt engineering best practices. For advanced features including 3,000+ prompt library and 16 template builders, explore PromptAndGo.ai",
  },
];

export default function Tools() {
  return (
    <Layout>
      <SEOHead
        canonical="/tools"
        title="EDGE Framework Tools & Simulations"
        description="Free AI governance tools: decision simulation, governance review, maturity assessment, ethical dilemma navigation. Session-based and privacy-first."
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
              EDGE Tools
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

      {/* Getting Started */}
      <section className="pb-10 md:pb-12 lg:pb-14">
        <div className="container-wide max-w-[1100px] mx-auto">
          <AnimatedSection>
            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl">New to EDGE? Start Here</h2>
                <p className="text-muted-foreground leading-relaxed max-w-[720px]">
                  The 12 EDGE tools work together as a system, but you don't need to use them all at once. Here's how to begin:
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                {[
                  {
                    icon: Search,
                    heading: "Diagnose First",
                    tool: "Maturity Assessment",
                    desc: "Not sure where you are? Start with the 5-dimension Maturity Assessment to understand your governance baseline across decision ownership, risk management, performance oversight, ethical boundaries, and accountability.",
                    button: "Take Maturity Assessment →",
                    href: "/tools/govern/maturity-assessment",
                  },
                  {
                    icon: Lightbulb,
                    heading: "Practice Decisions",
                    tool: "Decision Simulation",
                    desc: "Have a strategic decision coming up? Use the Decision Simulation room to map terrain, identify blind spots, and stress-test your assumptions before commitment.",
                    button: "Try Decision Simulation →",
                    href: "/tools/evaluate/decision",
                  },
                  {
                    icon: FileText,
                    heading: "Build Frameworks",
                    tool: "Governance Review Simulator",
                    desc: "Need to prepare for board review or establish oversight? The Governance Review Simulator helps you rehearse AI decisions and build downloadable frameworks (Decision Ownership Maps, Risk Checklists, Escalation Matrices).",
                    button: "Start Governance Review →",
                    href: "/tools/govern/governance-review",
                  },
                ].map((path) => (
                  <div
                    key={path.heading}
                    className="p-6 md:p-8 bg-card border border-border/30 h-full flex flex-col space-y-4 hover:border-accent/30 transition-colors duration-300"
                  >
                    <path.icon className="h-6 w-6 text-accent" />
                    <h3 className="text-lg font-semibold">{path.heading}</h3>
                    <p className="text-accent text-sm font-medium">{path.tool}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                      {path.desc}
                    </p>
                    <Button variant="hero" size="sm" asChild className="w-full mt-auto">
                      <Link to={path.href}>{path.button}</Link>
                    </Button>
                  </div>
                ))}
              </div>

              <p className="text-center text-muted-foreground/60 text-sm pt-2">
                All tools are free, session-based, and privacy-first. No signup required.
              </p>
            </div>
          </AnimatedSection>
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
                            <div className="flex items-center gap-2">
                              <span className="text-foreground group-hover:text-accent transition-colors font-medium">{tool.label}</span>
                              {tool.badge && (
                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                                  tool.badgeColor === "purple"
                                    ? "bg-[hsl(258_60%_55%/0.15)] text-[hsl(258_60%_65%)]"
                                    : "bg-accent/15 text-accent"
                                }`}>
                                  {tool.badge}
                                </span>
                              )}
                              <span className="text-muted-foreground/60 ml-1 hidden sm:inline">: {tool.desc}</span>
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
                        {section.note && (
                          <p className="text-xs text-muted-foreground/50 pt-2 leading-relaxed">
                            {section.note}
                          </p>
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
