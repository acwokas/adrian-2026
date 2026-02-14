import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { AnimatedSection, StaggeredChildren, StaggeredItem } from "@/components/AnimatedSection";
import { PrivacyNotice } from "@/components/simulation/PrivacyNotice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, UserCircle, CalendarDays, MessageSquareText, Lock } from "lucide-react";
import { useState } from "react";

const defineTools = [
  {
    title: "Brand Profile Generator",
    description: "Create your positioning foundation. An 8-step process that generates positioning summary, audience personas, brand voice guide, and content pillars.",
    features: [
      "Positioning clarity you can share with your team",
      "Audience profiles based on your market",
      "Brand voice guide for consistent messaging",
      "Content pillars to guide what you talk about",
    ],
    href: "/tools/define/brand-profile",
    cta: "Create brand profile",
    badge: "8-step guided process",
    icon: UserCircle,
  },
  {
    title: "Content Sprint Generator",
    description: "Generate 7 or 14 days of platform-specific content based on your brand profile. Copy-ready posts with CTAs, hashtags, and posting guidance.",
    features: [
      "Day-by-day content calendar",
      "Platform-optimized posts (LinkedIn, X, etc.)",
      "Hashtags and keywords per post",
      "Timing and formatting recommendations",
    ],
    href: "/tools/define/content-sprint",
    cta: "Generate content sprint",
    badge: "7 or 14-day calendars",
    note: "Requires brand profile",
    icon: CalendarDays,
  },
  {
    title: "Engagement Analyzer",
    description: "Paste comments, feedback, or conversations from your posts. Get structured analysis of what's resonating, common objections, and what to do next.",
    features: [
      "Interest signals identified",
      "Common objections surfaced",
      "Top-performing content themes",
      "Prioritized next-step recommendations",
    ],
    href: "/tools/define/engagement",
    cta: "Analyze engagement",
    badge: "Paste & analyze",
    icon: MessageSquareText,
  },
];

const workflowSteps = [
  { step: 1, title: "Start with Brand Profile Generator", desc: "Creates your positioning foundation" },
  { step: 2, title: "Generate Content Sprint", desc: "Use your profile to create platform-specific content" },
  { step: 3, title: "Analyze Engagement", desc: "Paste real feedback to understand what's working" },
  { step: 4, title: "Refine & Repeat", desc: "Update your profile based on engagement insights" },
];

export default function DefineHub() {
  const [workflowOpen, setWorkflowOpen] = useState(false);

  return (
    <Layout>
      <SEO
        canonical="/tools/define"
        title="EDGE Define — Positioning & Content Tools"
        description="Define your positioning, create platform-specific content, and understand what worked. Tools for founders, operators, and marketers."
        keywords="brand positioning, content strategy, content calendar, engagement analysis, EDGE framework, define tools"
        breadcrumb={[
          { name: "Tools", path: "/tools" },
          { name: "Define", path: "/tools/define" },
        ]}
      />

      {/* Hero */}
      <section className="section-spacing">
        <div className="container-wide max-w-[900px] mx-auto">
          <AnimatedSection>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-widest text-accent font-medium">Define</span>
                <span className="text-muted-foreground/30">·</span>
                <span className="text-xs text-muted-foreground/60">EDGE Framework</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15]">
                Positioning & Content Tools
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-[720px]">
                Define your positioning, create platform-specific content, and understand what worked.
              </p>
              <p className="text-muted-foreground leading-relaxed max-w-[720px]">
                These tools help you establish positioning clarity, generate platform-ready content, and analyze engagement patterns. Built for founders, operators, and marketers who need to think clearly before they act.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Tool Cards */}
      <section className="pb-10 md:pb-12 lg:pb-14">
        <div className="container-wide max-w-[900px] mx-auto">
          <StaggeredChildren className="space-y-6">
            {defineTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <StaggeredItem key={tool.title}>
                  <div className="p-6 md:p-8 lg:p-10 bg-card border border-border/30 space-y-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                        <div className="space-y-1">
                          <h3 className="text-xl font-semibold">{tool.title}</h3>
                          <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-medium text-accent border-accent/30">
                            {tool.badge}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">{tool.description}</p>

                    {tool.note && (
                      <p className="text-xs text-muted-foreground/60 italic">Note: {tool.note}</p>
                    )}

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground/80">What you'll get:</p>
                      <ul className="space-y-1.5">
                        {tool.features.map((f) => (
                          <li key={f} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-accent mt-1.5 h-1 w-1 rounded-full bg-accent shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={tool.href}>
                          {tool.cta} <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </StaggeredItem>
              );
            })}
          </StaggeredChildren>
        </div>
      </section>

      {/* Privacy Notice */}
      <section className="pb-10 md:pb-12">
        <div className="container-wide max-w-[900px] mx-auto">
          <div className="border border-accent/20 bg-accent/5 rounded-sm p-5 flex items-start gap-3">
            <Lock className="h-4 w-4 text-accent mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Session-only:</span> Your data is processed in your browser and cleared when you close the page. Nothing is stored on servers. No accounts required.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Guidance */}
      <section className="pb-10 md:pb-12">
        <div className="container-wide max-w-[900px] mx-auto">
          <Collapsible open={workflowOpen} onOpenChange={setWorkflowOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors w-full text-left">
              <ChevronDown className={`h-4 w-4 transition-transform ${workflowOpen ? "rotate-180" : ""}`} />
              How to use these tools together
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <div className="space-y-4 pl-6 border-l border-border/30">
                {workflowSteps.map((s) => (
                  <div key={s.step} className="space-y-0.5">
                    <p className="text-sm font-medium text-foreground">
                      <span className="text-accent mr-2">{s.step}.</span>
                      {s.title}
                    </p>
                    <p className="text-sm text-muted-foreground/70 pl-5">{s.desc}</p>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 md:pb-20">
        <div className="container-wide max-w-[900px] mx-auto">
          <div className="border-t border-border/20 pt-8">
            <p className="text-sm text-muted-foreground">
              These tools operationalize the EDGE Define pillar.{" "}
              <Link to="/edge" className="text-accent hover:underline underline-offset-4 inline-flex items-center gap-1">
                Explore the full framework <ArrowRight className="h-3 w-3" />
              </Link>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
