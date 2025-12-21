import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";

export default function WhatIDo() {
  return (
    <Layout>
      <SEO 
        title="What I Do"
        description="Advisory sprints, fractional leadership, mentoring, and workshops. Senior commercial and operational support for organisations navigating complexity."
        canonical="/what-i-do"
      />
      {/* Header */}
      <section className="section-spacing border-b border-border/50">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-6">
              <h1>What I do</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                My work focuses on helping leaders make decisions, align teams, and move forward with clarity and accountability. I am typically brought in when complexity, change, or pressure makes progress difficult.
              </p>
              <p className="text-lg text-foreground/80 font-medium">
                I work across four engagement models.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Advisory Sprints */}
      <section id="advisory" className="section-spacing border-b border-border/50 scroll-mt-24">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-10">
              <h2>Advisory Sprints</h2>
              
              <div className="grid md:grid-cols-3 gap-10">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-accent uppercase tracking-wider">
                    What this is
                  </h4>
                  <p className="text-muted-foreground">
                    Short, focused engagements designed to unblock decisions and create momentum.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-accent uppercase tracking-wider">
                    When it is used
                  </h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Early-stage ambiguity</li>
                    <li>Stalled initiatives</li>
                    <li>High-stakes decisions</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-accent uppercase tracking-wider">
                    What leaders walk away with
                  </h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Clarifies priorities</li>
                    <li>Identifies what to stop</li>
                    <li>Unblocks stalled decisions</li>
                  </ul>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Fractional Leadership */}
      <section id="fractional" className="section-spacing border-b border-border/50 scroll-mt-24 bg-[hsl(var(--section-light))] md:bg-transparent">
        <div className="container-narrow">
          <AnimatedSection delay={0.05}>
            <div className="space-y-10">
              <h2>Fractional Leadership</h2>
              
              <p className="text-muted-foreground max-w-2xl">
                In fractional roles, I work directly with the CEO or executive team. I operate as a senior peer, not a consultant, with responsibility for shaping direction, aligning teams, and supporting execution across strategy, operations, and governance.
              </p>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-accent uppercase tracking-wider">
                  Typical focus areas
                </h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Strategic alignment and governance</li>
                  <li>Commercial and operating model execution</li>
                </ul>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Mentoring and Capability Building */}
      <section id="mentoring" className="section-spacing border-b border-border/50 scroll-mt-24">
        <div className="container-narrow">
          <AnimatedSection delay={0.1}>
            <div className="space-y-10">
              <h2>Mentoring and Capability Building</h2>
              
              <p className="text-muted-foreground max-w-2xl">
                Mentoring and capability building form part of how I work with leaders and teams, particularly where long-term strength matters more than short-term fixes.
              </p>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-accent uppercase tracking-wider">
                    Who this is for
                  </h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Founders</li>
                    <li>Senior operators</li>
                    <li>Leadership teams</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-accent uppercase tracking-wider">
                    Why it matters
                  </h4>
                  <p className="text-muted-foreground">
                    This work provides early visibility into common failure patterns, decision bottlenecks, and scaling issues that established organisations often encounter later.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Workshops and Bootcamps */}
      <section id="workshops" className="section-spacing border-b border-border/50 scroll-mt-24 bg-[hsl(var(--section-light))] md:bg-transparent">
        <div className="container-narrow">
          <AnimatedSection delay={0.15}>
            <div className="space-y-10">
              <h2>Workshops and Bootcamps</h2>
              
              <p className="text-muted-foreground max-w-2xl">
                Workshops and bootcamps are used where alignment, shared language, and collective decision-making are required.
              </p>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-accent uppercase tracking-wider">
                    Used for
                  </h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Leadership alignment</li>
                    <li>Strategy resets</li>
                    <li>Capability uplift at scale</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-accent uppercase tracking-wider">
                    Delivered through
                  </h4>
                  <p className="text-muted-foreground">
                    Direct engagements and selected partners, including Blackstorm Asia.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <div className="space-y-8">
              <h2>Interested in working together?</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                If this sounds relevant, the best next step is a short conversation to assess fit and scope.
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
