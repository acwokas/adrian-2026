import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/hooks/useAnalytics";

export default function HowIWork() {
  return (
    <Layout>
      <SEO 
        title="Working Approach - Executive Advisory & Leadership Style"
        description="Clarity, accountability, and progress over process. How Adrian Watkins approaches complex problems, works with executive teams, and builds lasting capability without dependency."
        canonical="/how-i-work"
        keywords="executive working style, leadership approach, advisory methodology, problem-solving framework, executive team collaboration, capability building"
        breadcrumb={[{ name: "How I Work", path: "/how-i-work" }]}
      />
      {/* Header */}
      <section className="section-spacing lg:pb-24">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-6">
              <h1>How I Work</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                How I work is shaped by experience operating in complex environments where decisions matter and time is limited. My focus is on clarity, accountability, and progress rather than process for its own sake.
              </p>
              <p className="text-lg text-foreground/80 font-medium">
                This is how I typically engage with leaders and teams.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* How I approach problems */}
      <section className="py-16 md:py-20 lg:py-28">
        <div className="container-narrow">
          <AnimatedSection>
            {/* Mobile: stacked layout */}
            <div className="lg:hidden space-y-6">
              <h2>How I Approach Problems</h2>
              <div className="space-y-5 text-muted-foreground">
                <p>
                  I start by understanding what is actually blocking progress, not just what is visible on the surface.
                </p>
                <p>
                  I challenge assumptions early, before they harden into plans that waste time and resources.
                </p>
                <p>
                  I prioritise decisions over analysis. Clarity about what to do next matters more than comprehensive diagnostics.
                </p>
              </div>
            </div>

            {/* Desktop: two-column layout */}
            <div className="hidden lg:grid lg:grid-cols-[30%_70%] lg:gap-12 lg:items-start">
              <div className="pt-1">
                <h2 className="text-[2rem] font-medium leading-snug">How I Approach<br />Problems</h2>
              </div>
              <div className="space-y-5">
                <p className="text-base leading-[1.85] text-muted-foreground">
                  I start by understanding what is actually blocking progress, not just what is visible on the surface.
                </p>
                <p className="text-base leading-[1.85] text-muted-foreground">
                  I challenge assumptions early, before they harden into plans that waste time and resources.
                </p>
                <p className="text-base leading-[1.85] text-muted-foreground">
                  I prioritise decisions over analysis. Clarity about what to do next matters more than comprehensive diagnostics.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Working with leadership teams */}
      <section className="py-16 md:py-20 lg:py-28 bg-[hsl(var(--section-light))] md:bg-transparent">
        <div className="container-narrow">
          <AnimatedSection delay={0.03}>
            {/* Mobile: stacked layout */}
            <div className="lg:hidden space-y-6">
              <h2>Working With Leadership Teams</h2>
              <p className="text-muted-foreground">
                I work directly with CEOs and executive teams as a senior peer. My role is to support decision-making, align priorities, and maintain momentum, particularly when complexity or pressure makes this difficult.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>Direct and candid conversations</li>
                <li>Focus on shared accountability</li>
                <li>Clear ownership of next steps</li>
              </ul>
            </div>

            {/* Desktop: two-column layout */}
            <div className="hidden lg:grid lg:grid-cols-[30%_70%] lg:gap-12 lg:items-start">
              <div className="pt-1">
                <h2 className="text-[2rem] font-medium leading-snug">Working With<br />Leadership Teams</h2>
              </div>
              <div className="space-y-5">
                <p className="text-base leading-[1.85] text-muted-foreground">
                  I work directly with CEOs and executive teams as a senior peer. My role is to support decision-making, align priorities, and maintain momentum, particularly when complexity or pressure makes this difficult.
                </p>
                <ul className="space-y-2 text-base leading-[1.85] text-muted-foreground">
                  <li>Direct and candid conversations</li>
                  <li>Focus on shared accountability</li>
                  <li>Clear ownership of next steps</li>
                </ul>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Governance and responsibility */}
      <section className="py-16 md:py-20 lg:py-28">
        <div className="container-narrow">
          <AnimatedSection delay={0.06}>
            {/* Mobile: stacked layout */}
            <div className="lg:hidden space-y-6">
              <h2>Governance and Responsibility</h2>
              <p className="text-muted-foreground">
                Governance and responsibility are integral to how I work. I am comfortable operating in regulated and high-trust environments, where decisions carry commercial, operational, and reputational consequences.
              </p>
              <p className="text-foreground/90 font-medium">
                Good governance enables speed and confidence, rather than slowing progress.
              </p>
            </div>

            {/* Desktop: two-column layout */}
            <div className="hidden lg:grid lg:grid-cols-[30%_70%] lg:gap-12 lg:items-start">
              <div className="pt-1">
                <h2 className="text-[2rem] font-medium leading-snug">Governance and<br />Responsibility</h2>
              </div>
              <div className="space-y-5">
                <p className="text-base leading-[1.85] text-muted-foreground">
                  Governance and responsibility are integral to how I work. I am comfortable operating in regulated and high-trust environments, where decisions carry commercial, operational, and reputational consequences.
                </p>
                <p className="text-base leading-[1.85] text-foreground font-medium">
                  Good governance enables speed and confidence, rather than slowing progress.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Building capability, not dependency */}
      <section className="py-16 md:py-20 lg:py-28 bg-[hsl(var(--section-light))] md:bg-transparent">
        <div className="container-narrow">
          <AnimatedSection delay={0.09}>
            {/* Mobile: stacked layout */}
            <div className="lg:hidden space-y-6">
              <h2>Building Capability, Not Dependency</h2>
              <p className="text-muted-foreground">
                My aim is to leave teams stronger than I found them. That means building capability, shared language, and confidence so progress continues without ongoing dependence on external support.
              </p>
              <p className="text-foreground/90 font-medium">
                Mentoring, workshops, and structured engagement are part of how this is achieved.
              </p>
            </div>

            {/* Desktop: two-column layout */}
            <div className="hidden lg:grid lg:grid-cols-[30%_70%] lg:gap-12 lg:items-start">
              <div className="pt-1">
                <h2 className="text-[2rem] font-medium leading-snug">Building Capability,<br />Not Dependency</h2>
              </div>
              <div className="space-y-5">
                <p className="text-base leading-[1.85] text-muted-foreground">
                  My aim is to leave teams stronger than I found them. That means building capability, shared language, and confidence so progress continues without ongoing dependence on external support.
                </p>
                <p className="text-base leading-[1.85] text-foreground font-medium">
                  Mentoring, workshops, and structured engagement are part of how this is achieved.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Staying close to the ecosystem */}
      <section className="py-16 md:py-20 lg:py-28">
        <div className="container-narrow">
          <AnimatedSection delay={0.12}>
            {/* Mobile: stacked layout */}
            <div className="lg:hidden space-y-6">
              <h2>Staying Close to the Ecosystem</h2>
              <p className="text-muted-foreground">
                Staying close to the ecosystem matters. Through advisory work, mentoring, and platforms such as AIinASIA.com, I maintain a constant feedback loop with founders, operators, and practitioners. This keeps my judgement grounded in what is actually working.
              </p>
            </div>

            {/* Desktop: two-column layout */}
            <div className="hidden lg:grid lg:grid-cols-[30%_70%] lg:gap-12 lg:items-start">
              <div className="pt-1">
                <h2 className="text-[2rem] font-medium leading-snug">Staying Close to<br />the Ecosystem</h2>
              </div>
              <div className="space-y-5">
                <p className="text-base leading-[1.85] text-muted-foreground">
                  Staying close to the ecosystem matters. Through advisory work, mentoring, and platforms such as AIinASIA.com, I maintain a constant feedback loop with founders, operators, and practitioners. This keeps my judgement grounded in what is actually working.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Different from Consulting - Capstone section */}
      <section className="py-20 md:py-28 lg:py-40 bg-card">
        <div className="container-narrow">
          <AnimatedSection>
            {/* Mobile: stacked layout */}
            <div className="lg:hidden space-y-6">
              <h2>How My Work Differs From Traditional Consulting</h2>
              <p className="text-muted-foreground">
                I do not run large consulting programmes or deliver long decks that sit on shelves. My work focuses on helping leaders make decisions, act on them, and move forward with clarity and accountability.
              </p>
              <p className="text-foreground/90 font-medium">
                I remain close to execution and am comfortable owning outcomes, not just advising on them.
              </p>
            </div>

            {/* Desktop: single column, visually distinct capstone */}
            <div className="hidden lg:block max-w-3xl">
              <div className="space-y-6">
                <h2 className="text-[2.25rem] font-medium leading-snug">How My Work Differs From<br />Traditional Consulting</h2>
                <p className="text-base leading-[1.85] text-muted-foreground">
                  I do not run large consulting programmes or deliver long decks that sit on shelves. My work focuses on helping leaders make decisions, act on them, and move forward with clarity and accountability.
                </p>
                <p className="text-base leading-[1.85] text-foreground font-medium">
                  I remain close to execution and am comfortable owning outcomes, not just advising on them.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 md:py-40 lg:py-48">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <div className="space-y-8">
              <h2>Interested in How This Could Work in Practice?</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                A short conversation is often the best way to assess fit and scope.
              </p>
              <Button 
                variant="hero" 
                size="lg" 
                asChild
                onClick={() => trackEvent({ eventType: 'cta_click', eventName: 'book_clarity_call', eventData: { page: 'how-i-work' } })}
              >
                <a 
                  href="https://calendly.com/adrian-watkins1/new-meeting" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Book a 30-minute clarity call
                  <ArrowRight size={16} />
                </a>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}