import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { AnimatedSection, StaggeredChildren, StaggeredItem } from "@/components/AnimatedSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, GitBranch, Shield, MessageCircle, Send, Handshake, ChevronDown, ShieldCheck } from "lucide-react";

const tools = [
  {
    title: "Decision Simulation",
    description:
      "Map the terrain before you choose. Analyse decisions from multiple angles without telling you what to do.",
    badge: "45–90 second analysis",
    icon: <GitBranch className="h-5 w-5 text-accent" />,
    href: "/tools/evaluate/decision",
    features: [
      "Side-by-side path comparison",
      "Identity-level observations",
      "Asymmetric bet analysis",
      "Private reflection space",
    ],
  },
  {
    title: "Red Team Simulation",
    description:
      "Pressure-test before you present. Attack your idea from multiple angles to find weaknesses before others do.",
    badge: "60–120 second analysis",
    icon: <Shield className="h-5 w-5 text-accent" />,
    href: "/tools/evaluate/redteam",
    features: [
      "Three-perspective analysis",
      "Adjustable challenge intensity",
      "Mitigation planning",
      "Synthesis generation",
    ],
  },
  {
    title: "Conversation Simulator",
    description:
      "Rehearse difficult conversations with realistic AI pushback. Resolution must be earned through clarity, empathy, and firmness.",
    badge: "Interactive chat",
    icon: <MessageCircle className="h-5 w-5 text-accent" />,
    href: "/tools/evaluate/conversation",
    features: [
      "Realistic resistance & pushback",
      "5 conversation tone modes",
      "Turn-by-turn coaching reflection",
      "Downloadable transcripts",
    ],
  },
  {
    title: "Before You Send",
    description:
      "Analyse how different audiences might interpret your message. Surface perception gaps and ambiguities before you hit send.",
    badge: "30–45 second analysis",
    icon: <Send className="h-5 w-5 text-accent" />,
    href: "/tools/evaluate/before-you-send",
    features: [
      "Multi-audience interpretation analysis",
      "Perception risk identification",
      "Side-by-side audience comparison",
      "Iterative revision helper",
    ],
  },
  {
    title: "Negotiation Simulator",
    description:
      "Rehearse negotiation dynamics with realistic AI counterparty. Counter-asks, pressure tactics, and strategic delays included.",
    badge: "Interactive chat",
    icon: <Handshake className="h-5 w-5 text-accent" />,
    href: "/tools/evaluate/negotiation",
    features: [
      "Realistic counter-asks & tactics",
      "Pause & strategise feature",
      "5 negotiation style modes",
      "Leverage analysis in reflection",
    ],
  },
];

const quickStartItems = [
  "Come with a specific decision or idea",
  "Be honest about constraints",
  "Don't paste confidential information",
  "Use the reflection phase to capture insights",
  "Download or save results before closing",
];

export default function EvaluateHub() {
  return (
    <Layout>
      <SEO
        canonical="/tools/evaluate"
        title="Evaluate Tools | EDGE Framework"
        description="Diagnostic and simulation tools for assessing intelligence readiness, testing decisions, and pressure-testing ideas before deployment."
        keywords="EDGE evaluate, AI readiness, decision simulation, red team analysis, applied intelligence tools"
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
              <span className="text-foreground">Evaluate</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15]">
              Evaluate Instruments
            </h1>
            <div className="space-y-4 max-w-[720px]">
              <p className="text-muted-foreground leading-relaxed">
                Diagnostic and simulation tools for assessing readiness, testing decisions, and pressure-testing ideas before deployment.
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
                These tools operationalise the EDGE Evaluate pillar. Explore the full framework to understand how evaluation connects to definition, governance, and elevation.
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
