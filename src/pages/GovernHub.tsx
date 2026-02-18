import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { AnimatedSection, StaggeredChildren, StaggeredItem } from "@/components/AnimatedSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, ShieldCheck, Scale, ClipboardCheck } from "lucide-react";

const tools = [
  {
    title: "Governance Review Simulator",
    description:
      "Rehearse defending AI decisions to boards, investors, or leadership. Practice explaining ROI, risk, oversight, and accountability under realistic scrutiny.",
    badge: "Board-level rehearsal",
    icon: <ShieldCheck className="h-5 w-5 text-accent" />,
    href: "/tools/govern/governance-review",
    buttonLabel: "Enter governance review",
    practice: [
      "Defending business case and expected returns",
      "Explaining risk mitigation and oversight structures",
      "Demonstrating accountability mechanisms",
      "Articulating performance measurement",
    ],
    outputs: [
      "AI Decision Ownership Map",
      "Performance Accountability Template",
      "Governance Review Checklist",
    ],
  },
  {
    title: "Ethical Dilemma Simulator",
    description:
      "Navigate ethical tensions in AI deployment. Practice decision-making when efficiency conflicts with fairness, transparency with advantage, or automation with dignity.",
    badge: "Ethics rehearsal",
    icon: <Scale className="h-5 w-5 text-accent" />,
    href: "/tools/govern/ethical-dilemma",
    buttonLabel: "Navigate ethical dilemma",
    practice: [
      "Identifying ethical tensions before they become crises",
      "Balancing competing stakeholder interests",
      "Explaining difficult decisions with clear reasoning",
      "Setting policy boundaries for experimentation",
    ],
    outputs: [
      "Risk Exposure Checklist",
      "Decision Escalation Matrix",
      "Experimentation Policy Template",
    ],
  },
  {
    title: "AI Governance Maturity Assessment",
    description:
      "Evaluate your organisation's governance maturity across 5 dimensions. Get a personalised roadmap and identify which gaps to address first.",
    badge: "5–10 minutes",
    icon: <ClipboardCheck className="h-5 w-5 text-accent" />,
    href: "/tools/govern/maturity-assessment",
    buttonLabel: "Take assessment",
    practice: [
      "Where you are on the governance maturity spectrum (Reactive to Optimised)",
      "Which dimensions need immediate attention",
      "Benchmark comparison for your organisational stage",
      "Personalised roadmap for improvement",
    ],
    practiceLabel: "What you'll discover",
    outputs: [
      "Maturity score report with visual breakdown",
      "Dimension-by-dimension analysis",
      "Prioritised action plan",
      "Links to tools addressing your gaps",
    ],
    note: "No signup required. Results calculated in browser.",
  },
];

const collapsibleSections = [
  {
    title: "Suggested workflow",
    content: (
      <>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">Recommended approach:</p>
        <ol className="space-y-2 mb-4">
          {[
            { label: "Assess", desc: "Take the Maturity Assessment (5–10 min)" },
            { label: "Practice", desc: "Use simulators to rehearse weak areas" },
            { label: "Document", desc: "Download frameworks from simulators" },
            { label: "Improve", desc: "Implement recommendations" },
            { label: "Re-assess", desc: "Track progress over time" },
          ].map((step, i) => (
            <li key={step.label} className="text-sm text-muted-foreground flex items-start gap-3 pl-4">
              <span className="text-accent/60 font-medium shrink-0">{i + 1}.</span>
              <span><span className="font-medium text-foreground/80">{step.label}</span> — {step.desc}</span>
            </li>
          ))}
        </ol>
        <p className="text-sm text-muted-foreground/70 leading-relaxed">
          Or jump straight to simulators if you know your gaps.
        </p>
      </>
    ),
  },
  {
    title: "Why simulators, not templates",
    content: (
      <>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Governance requires judgment under pressure — not just following templates.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">These simulators help you:</p>
        <ul className="space-y-2 mb-4">
          {[
            "Practice defending decisions before facing actual boards",
            "Identify governance gaps through realistic questioning",
            "Develop consistent ethical reasoning across scenarios",
            "Generate custom frameworks based on YOUR context",
          ].map((item) => (
            <li key={item} className="text-sm text-muted-foreground flex items-start gap-2 pl-4">
              <span className="w-1 h-1 rounded-full bg-accent/60 shrink-0 mt-2" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground/70 leading-relaxed">
          The templates you download are customised to your actual gaps and decisions — not generic checklists.
        </p>
      </>
    ),
  },
  {
    title: "Governance principles",
    content: (
      <ol className="space-y-3">
        {[
          { label: "Ownership Clarity", desc: "Who owns which AI decisions? Who approves? Who reviews?" },
          { label: "Risk Management", desc: "What could go wrong? How do we mitigate? What's our exposure?" },
          { label: "Performance Discipline", desc: "What metrics matter? Who tracks? What triggers action?" },
          { label: "Ethical Boundaries", desc: "What values guide decisions? Where do we draw lines?" },
          { label: "Accountability Structures", desc: "Who's responsible when things go wrong? How do we ensure it?" },
        ].map((p, i) => (
          <li key={p.label} className="text-sm text-muted-foreground flex items-start gap-3 pl-4">
            <span className="text-accent/60 font-medium shrink-0">{i + 1}.</span>
            <span><span className="font-medium text-foreground/80">{p.label}</span> — {p.desc}</span>
          </li>
        ))}
        <li className="text-xs text-muted-foreground/50 pt-2 pl-4 list-none leading-relaxed">
          These are not abstract concepts — they are practised through simulation and documented through frameworks.
        </li>
      </ol>
    ),
  },
  {
    title: "Governance vs compliance",
    content: (
      <>
        <p className="text-sm font-medium text-foreground/80 mb-3">Governance ≠ Compliance</p>
        <div className="space-y-2 mb-4">
          <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground/70">Compliance:</span> Meeting legal and regulatory requirements (necessary but insufficient)</p>
          <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground/70">Governance:</span> Decision-making structures ensuring AI serves organisational values and stakeholder interests</p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          These tools focus on governance — the hard decisions compliance does not answer:
        </p>
        <ul className="space-y-2">
          {[
            "Should we deploy even if legally allowed?",
            "Who decides when AI conflicts with human judgment?",
            "How do we balance competing ethical values?",
            "What experimentation is allowed vs prohibited?",
          ].map((item) => (
            <li key={item} className="text-sm text-muted-foreground flex items-start gap-2 pl-4">
              <span className="w-1 h-1 rounded-full bg-accent/60 shrink-0 mt-2" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
];

export default function GovernHub() {
  return (
    <Layout>
      <SEOHead
        canonical="/tools/govern"
        title="Govern Tools | EDGE Framework"
        description="Governance and oversight tools for establishing accountability, policy boundaries, risk management, and performance discipline in AI implementations."
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
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link to="/tools" className="hover:text-foreground transition-colors">Tools</Link>
              <span>/</span>
              <span className="text-foreground">Govern</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15]">
              Governance & Oversight Tools
            </h1>
            <div className="space-y-4 max-w-[720px]">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Establish accountability, manage risk, and make ethical decisions under scrutiny.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Governance is not paperwork — it is decision-making under pressure. Start with the Maturity Assessment to identify gaps, then use simulators to practise governance reviews and navigate ethical dilemmas before facing real scrutiny.
              </p>
              <div className="flex items-start gap-2 text-sm text-muted-foreground/70">
                <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-accent/60" />
                <span>These tools run entirely in your browser. Nothing is stored on servers. No accounts, no tracking, no history.</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tool Cards */}
      <section className="pb-10 md:pb-12 lg:pb-14">
        <div className="container-wide max-w-[900px] mx-auto">
          <StaggeredChildren className="grid gap-5 lg:gap-6">
            {tools.map((tool) => (
              <StaggeredItem key={tool.title}>
                <div className="p-6 md:p-8 bg-card border border-border/30 space-y-5">
                  <div className="flex items-center gap-3">
                    {tool.icon}
                    <h2 className="text-lg font-semibold">{tool.title}</h2>
                    <Badge variant="outline" className="text-[10px] tracking-wide uppercase font-normal text-muted-foreground border-border/40">
                      {tool.badge}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[640px]">
                    {tool.description}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-6 pt-2">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground/50 mb-2">
                        {(tool as any).practiceLabel || "What you'll practise"}
                      </p>
                      <ul className="space-y-1.5">
                        {tool.practice.map((f) => (
                          <li key={f} className="text-xs text-muted-foreground/70 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-accent/60 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground/50 mb-2">What you'll get</p>
                      <ul className="space-y-1.5">
                        {tool.outputs.map((f) => (
                          <li key={f} className="text-xs text-muted-foreground/70 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-accent/60 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {(tool as any).note && (
                    <p className="text-xs text-muted-foreground/50 leading-relaxed">
                      {(tool as any).note}
                    </p>
                  )}

                  <div className="pt-2">
                    <Button variant="heroOutline" size="sm" asChild>
                      <Link to={tool.href}>
                        {tool.buttonLabel} <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </StaggeredItem>
            ))}
          </StaggeredChildren>
        </div>
      </section>

      {/* Collapsible Sections */}
      <section className="pb-10 md:pb-12 lg:pb-14">
        <div className="container-wide max-w-[900px] mx-auto space-y-0">
          {collapsibleSections.map((section) => (
            <AnimatedSection key={section.title}>
              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-left py-3 border-t border-border/20 group">
                  <span className="text-sm font-medium">{section.title}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="py-4">{section.content}</div>
                </CollapsibleContent>
              </Collapsible>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 md:pb-20">
        <div className="container-wide max-w-[900px] mx-auto">
          <AnimatedSection>
            <div className="border-t border-border/20 pt-8 space-y-4">
              <p className="text-sm text-muted-foreground">
                These tools operationalise the{" "}
                <Link to="/edge" className="text-accent hover:underline underline-offset-4">
                  EDGE Govern pillar
                </Link>
                . Explore the full framework to understand how governance connects to evaluation, definition, and elevation.
              </p>
              <Button variant="heroOutline" size="sm" asChild>
                <Link to="/edge">
                  Explore the EDGE Framework <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
