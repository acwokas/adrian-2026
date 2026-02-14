import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { AnimatedSection, StaggeredChildren, StaggeredItem } from "@/components/AnimatedSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, ShieldCheck } from "lucide-react";

const tools = [
  {
    title: "Governance Review Simulator",
    description:
      "Rehearse defending AI decisions to boards, investors, or leadership. Face realistic scrutiny about ROI, risk, oversight, and accountability.",
    badge: "Interactive Q&A",
    icon: <ShieldCheck className="h-5 w-5 text-accent" />,
    href: "/tools/govern/governance-review",
    features: [
      "Board-level questioning simulation",
      "8–12 questions across 5 governance areas",
      "Custom governance frameworks generated",
      "Downloadable templates & checklists",
    ],
  },
];

const quickStartItems = [
  "Know your AI capability and business case before starting",
  "Be honest about governance gaps — the tool targets these",
  "Have ROI figures and risk assessments ready",
  "Use the generated frameworks as starting points, not final documents",
  "Download and share frameworks with your team",
];

export default function GovernHub() {
  return (
    <Layout>
      <SEO
        canonical="/tools/govern"
        title="Govern Instruments — EDGE Tools"
        description="Governance and oversight tools for establishing accountability, policy boundaries, risk management, and performance discipline in AI implementations."
        keywords="EDGE govern, AI governance, oversight tools, accountability framework, risk management"
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
              <p className="text-muted-foreground leading-relaxed">
                Frameworks and simulations for establishing accountability, policy boundaries, risk management, and performance discipline in AI implementations.
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
                <Link
                  to={tool.href}
                  className="block p-6 md:p-8 bg-card border border-border/30 hover:border-accent/30 transition-colors group"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        {tool.icon}
                        <h2 className="text-lg font-semibold group-hover:text-accent transition-colors">
                          {tool.title}
                        </h2>
                        <Badge variant="outline" className="text-[10px] tracking-wide uppercase font-normal text-muted-foreground border-border/40">
                          {tool.badge}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed max-w-[560px]">
                        {tool.description}
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 pt-2">
                        {tool.features.map((f) => (
                          <li key={f} className="text-xs text-muted-foreground/70 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-accent/60 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-accent transition-colors shrink-0 mt-1 hidden md:block" />
                  </div>
                </Link>
              </StaggeredItem>
            ))}
          </StaggeredChildren>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="pb-10 md:pb-12 lg:pb-14">
        <div className="container-wide max-w-[900px] mx-auto">
          <AnimatedSection>
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full text-left py-3 border-t border-border/20 group">
                <span className="text-sm font-medium">How to get the most from these tools</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="space-y-2 py-4">
                  {quickStartItems.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground flex items-start gap-2 pl-4">
                      <span className="w-1 h-1 rounded-full bg-accent/60 shrink-0 mt-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 md:pb-20">
        <div className="container-wide max-w-[900px] mx-auto">
          <AnimatedSection>
            <div className="border-t border-border/20 pt-8 space-y-4">
              <p className="text-sm text-muted-foreground">
                Built on the{" "}
                <Link to="/edge" className="text-accent hover:underline underline-offset-4">
                  EDGE Framework for Applied Intelligence
                </Link>
              </p>
              <p className="text-sm text-muted-foreground/70">
                These tools operationalise the EDGE Govern pillar. Explore the full framework to understand how governance connects to evaluation, definition, and elevation.
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
