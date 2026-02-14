import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { AnimatedSection, StaggeredChildren, StaggeredItem } from "@/components/AnimatedSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, UserCircle, CalendarDays, MessageSquareText, Lock, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const PROFILE_KEY = "define-brand-profile-latest";
const SPRINT_KEY = "define-content-sprint-latest";
const ANALYSIS_KEY = "define-engagement-analysis-latest";

function hasProfile() {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) { const p = JSON.parse(saved); return !!p?.formData?.productName; }
  } catch {}
  return false;
}

function getProfileName() {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) { const p = JSON.parse(saved); return p?.formData?.productName || null; }
  } catch {}
  return null;
}

function hasSprint() {
  try { return !!localStorage.getItem(SPRINT_KEY); } catch { return false; }
}

function hasAnalysis() {
  try { return !!localStorage.getItem(ANALYSIS_KEY); } catch { return false; }
}

export default function DefineHub() {
  const [workflowOpen, setWorkflowOpen] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [sprintExists, setSprintExists] = useState(false);
  const [analysisExists, setAnalysisExists] = useState(false);

  useEffect(() => {
    setProfileExists(hasProfile());
    setProfileName(getProfileName());
    setSprintExists(hasSprint());
    setAnalysisExists(hasAnalysis());
  }, []);

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
      cta: profileExists ? "View brand profile" : "Create brand profile",
      badge: "Start here",
      badgeVariant: "accent" as const,
      icon: UserCircle,
      status: profileExists ? `Profile: ${profileName}` : null,
      enabled: true,
    },
    {
      title: "Content Sprint Generator",
      description: "Generate 7 or 14 days of platform-specific content based on your brand profile. Copy-ready posts with CTAs, hashtags, and posting guidance.",
      features: [
        "Day-by-day content calendar",
        "Platform-optimised posts (LinkedIn, X, etc.)",
        "Hashtags and keywords per post",
        "Timing and formatting recommendations",
      ],
      href: "/tools/define/content-sprint",
      cta: "Generate content sprint",
      badge: "Requires profile",
      badgeVariant: profileExists ? "default" as const : "muted" as const,
      icon: CalendarDays,
      status: sprintExists ? "Sprint generated" : null,
      enabled: true,
    },
    {
      title: "Engagement Analyzer",
      description: "Paste comments, feedback, or conversations from your posts. Get structured analysis of what's resonating, common objections, and what to do next.",
      features: [
        "Interest signals identified",
        "Common objections surfaced",
        "Top-performing content themes",
        "Prioritised next-step recommendations",
      ],
      href: "/tools/define/engagement",
      cta: "Analyse engagement",
      badge: "Works standalone",
      badgeVariant: "default" as const,
      icon: MessageSquareText,
      status: analysisExists ? "Analysis available" : null,
      enabled: true,
    },
  ];

  const workflowSteps = [
    { step: 1, title: "Start with Brand Profile Generator", desc: "Creates your positioning foundation", done: profileExists },
    { step: 2, title: "Generate Content Sprint", desc: "Use your profile to create platform-specific content", done: sprintExists },
    { step: 3, title: "Post and collect feedback", desc: "Share your content and gather engagement data", done: false },
    { step: 4, title: "Analyse Engagement", desc: "Paste real feedback to understand what's working", done: analysisExists },
    { step: 5, title: "Refine & Repeat", desc: "Update your profile based on engagement insights", done: false },
  ];

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
                Create positioning clarity, generate platform-specific content, and understand what's resonating with your audience.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Getting Started */}
      <section className="pb-8 md:pb-10">
        <div className="container-wide max-w-[900px] mx-auto">
          <div className="border border-accent/20 bg-accent/5 rounded-sm p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent shrink-0" />
              <p className="text-sm font-medium text-foreground">Getting started</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              New to positioning clarity? Start with the <Link to="/tools/define/brand-profile" className="text-accent hover:underline underline-offset-4">Brand Profile Generator</Link>, then use it to power your Content Sprints and Engagement Analysis.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Diagram */}
      <section className="pb-8 md:pb-10">
        <div className="container-wide max-w-[900px] mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            {[
              { label: "Brand Profile", active: profileExists },
              { label: "Content Sprint", active: sprintExists },
              { label: "Post Content", active: false },
              { label: "Analyse Engagement", active: analysisExists },
              { label: "Refine Profile", active: false },
            ].map((item, i, arr) => (
              <span key={item.label} className="flex items-center gap-2">
                <span className={cn(
                  "px-3 py-1.5 rounded-sm border transition-colors",
                  item.active
                    ? "border-accent/40 bg-accent/10 text-accent font-medium"
                    : "border-border/30 bg-card text-muted-foreground/60"
                )}>
                  {item.label}
                </span>
                {i < arr.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground/30" />}
              </span>
            ))}
            <ArrowRight className="h-3 w-3 text-muted-foreground/30 rotate-[135deg]" />
          </div>
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
                        <div className="space-y-1.5">
                          <h3 className="text-xl font-semibold">{tool.title}</h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] uppercase tracking-wider font-medium",
                                tool.badgeVariant === "accent"
                                  ? "text-accent border-accent/30 bg-accent/5"
                                  : tool.badgeVariant === "muted"
                                  ? "text-muted-foreground/50 border-border/30"
                                  : "text-muted-foreground border-border/30"
                              )}
                            >
                              {tool.badge}
                            </Badge>
                            {tool.status && (
                              <span className="text-[10px] text-accent/70 flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-accent/60" />
                                {tool.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">{tool.description}</p>

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
                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                      <span className={cn("text-accent mr-1", s.done && "line-through opacity-60")}>{s.step}.</span>
                      <span className={cn(s.done && "text-muted-foreground")}>{s.title}</span>
                      {s.done && <span className="text-[10px] text-accent/60 bg-accent/10 px-1.5 py-0.5 rounded-sm">Done</span>}
                    </p>
                    <p className="text-sm text-muted-foreground/70 pl-7">{s.desc}</p>
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
              These tools operationalise the EDGE Define pillar.{" "}
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
