import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";

export default function HowIWork() {
  return (
    <Layout>
      <SEO 
        title="How I Work"
        description="Clarity, accountability, and progress. How I approach problems, work with leadership teams, and build capability without dependency."
        canonical="/how-i-work"
      />
      {/* Header */}
      <section className="section-spacing border-b border-border/50">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-6">
              <h1>How I work</h1>
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
      <section className="py-12 md:py-16 border-b border-border/50">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-8">
              <h2 className="text-2xl">How I approach problems</h2>
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
          </AnimatedSection>
        </div>
      </section>

      {/* Working with leadership teams */}
      <section className="py-12 md:py-16 border-b border-border/50 bg-[hsl(var(--section-light))] md:bg-transparent">
        <div className="container-narrow">
          <AnimatedSection delay={0.03}>
            <div className="space-y-8">
              <h2 className="text-2xl">Working with leadership teams</h2>
              <p className="text-muted-foreground">
                I work directly with CEOs and executive teams as a senior peer. My role is to support decision-making, align priorities, and maintain momentum, particularly when complexity or pressure makes this difficult.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>Direct and candid conversations</li>
                <li>Focus on shared accountability</li>
                <li>Clear ownership of next steps</li>
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Governance and responsibility */}
      <section className="py-12 md:py-16 border-b border-border/50">
        <div className="container-narrow">
          <AnimatedSection delay={0.06}>
            <div className="space-y-8">
              <h2 className="text-2xl">Governance and responsibility</h2>
              <p className="text-muted-foreground">
                Governance and responsibility are integral to how I work. I am comfortable operating in regulated and high-trust environments, where decisions carry commercial, operational, and reputational consequences.
              </p>
              <p className="text-foreground/90 font-medium">
                Good governance enables speed and confidence, rather than slowing progress.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Building capability, not dependency */}
      <section className="py-12 md:py-16 border-b border-border/50 bg-[hsl(var(--section-light))] md:bg-transparent">
        <div className="container-narrow">
          <AnimatedSection delay={0.09}>
            <div className="space-y-8">
              <h2 className="text-2xl">Building capability, not dependency</h2>
              <p className="text-muted-foreground">
                My aim is to leave teams stronger than I found them. That means building capability, shared language, and confidence so progress continues without ongoing dependence on external support.
              </p>
              <p className="text-foreground/90 font-medium">
                Mentoring, workshops, and structured engagement are part of how this is achieved.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Staying close to the ecosystem */}
      <section className="py-12 md:py-16 border-b border-border/50">
        <div className="container-narrow">
          <AnimatedSection delay={0.12}>
            <div className="space-y-8">
              <h2 className="text-2xl">Staying close to the ecosystem</h2>
              <p className="text-muted-foreground">
                Staying close to the ecosystem matters. Through advisory work, mentoring, and platforms such as AIinASIA, I maintain a constant feedback loop with founders, operators, and practitioners. This keeps my judgement grounded in what is actually working.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Different from Consulting */}
      <section className="section-spacing bg-card border-y border-border/50">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-6">
              <h2>How my work differs from traditional consulting</h2>
              <p className="text-muted-foreground">
                I do not run large consulting programmes or deliver long decks that sit on shelves. My work focuses on helping leaders make decisions, act on them, and move forward with clarity and accountability.
              </p>
              <p className="text-foreground/90 font-medium">
                I remain close to execution and am comfortable owning outcomes, not just advising on them.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <div className="space-y-8">
              <h2>Interested in how this could work in practice?</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                A short conversation is often the best way to assess fit and scope.
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">
                  Book a 30-minute clarity call
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
