import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection, StaggeredChildren, StaggeredItem } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";

export default function Experience() {
  return (
    <Layout>
      <SEO 
        title="Experience"
        description="Senior commercial and operational leadership, advisory and fractional roles, and platform building across Asia Pacific and beyond."
        canonical="/experience"
      />
      
      {/* Header */}
      <section className="section-spacing border-b border-border/50">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-6">
              <h1>Experience</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                My experience spans senior commercial and operational leadership, advisory and fractional roles, and building platforms and ecosystems. I have operated across different growth stages and complex environments, often where clarity, governance, and execution were critical.
              </p>
              <p className="text-lg text-muted-foreground">
                The examples below are grouped by responsibility rather than chronology.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 1: Commercial and Operational Leadership */}
      <section className="section-spacing border-b border-border/50">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-8">
              <div className="space-y-4">
                <h2>Commercial and Operational Leadership</h2>
                <p className="text-lg text-muted-foreground">
                  Senior commercial and operational leadership roles with direct responsibility for commercial outcomes, operating models, and execution across complex and multi-market environments.
                </p>
              </div>

              <StaggeredChildren className="space-y-4 pt-2">
                <StaggeredItem>
                  <div className="pl-6 border-l border-border/50 hover:border-accent/50 transition-colors">
                    <p className="text-muted-foreground">
                      Ownership of commercial outcomes, operating performance, and delivery accountability
                    </p>
                  </div>
                </StaggeredItem>
                <StaggeredItem>
                  <div className="pl-6 border-l border-border/50 hover:border-accent/50 transition-colors">
                    <p className="text-muted-foreground">
                      Design and oversight of operating models across growth and transformation phases
                    </p>
                  </div>
                </StaggeredItem>
                <StaggeredItem>
                  <div className="pl-6 border-l border-border/50 hover:border-accent/50 transition-colors">
                    <p className="text-muted-foreground">
                      Leadership across cross-functional teams and senior stakeholders
                    </p>
                  </div>
                </StaggeredItem>
              </StaggeredChildren>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 2: Advisory and Fractional Leadership */}
      <section className="section-spacing border-b border-border/50 bg-[hsl(var(--section-light))] md:bg-transparent">
        <div className="container-narrow">
          <AnimatedSection delay={0.05}>
            <div className="space-y-8">
              <div className="space-y-4">
                <h2>Advisory and Fractional Leadership</h2>
                <p className="text-lg text-muted-foreground">
                  These engagements involve shared accountability for outcomes, not advisory input alone.
                </p>
              </div>

              <StaggeredChildren className="space-y-4 pt-2">
                <StaggeredItem>
                  <div className="pl-6 border-l border-border/50 hover:border-accent/50 transition-colors">
                    <p className="text-muted-foreground">
                      Decision support and leadership at CEO and executive team level
                    </p>
                  </div>
                </StaggeredItem>
                <StaggeredItem>
                  <div className="pl-6 border-l border-border/50 hover:border-accent/50 transition-colors">
                    <p className="text-muted-foreground">
                      Alignment of strategy, operations, and execution during periods of change
                    </p>
                  </div>
                </StaggeredItem>
                <StaggeredItem>
                  <div className="pl-6 border-l border-border/50 hover:border-accent/50 transition-colors">
                    <p className="text-muted-foreground">
                      Time-bound leadership roles with clear ownership and mandate
                    </p>
                  </div>
                </StaggeredItem>
              </StaggeredChildren>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 3: Platforms and Ecosystems */}
      <section className="section-spacing border-b border-border/50">
        <div className="container-narrow">
          <AnimatedSection delay={0.1}>
            <div className="space-y-8">
              <div className="space-y-4">
                <h2>Platforms and Ecosystems</h2>
                <p className="text-lg text-muted-foreground">
                  Building and contributing to platforms and ecosystems designed to improve access to insight, capability, and decision-making—including AIinASIA and the broader you.withthepowerof.ai ecosystem.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 4: Founders, Startups, and Scale-ups */}
      <section className="section-spacing border-b border-border/50 bg-[hsl(var(--section-light))] md:bg-transparent">
        <div className="container-narrow">
          <AnimatedSection delay={0.15}>
            <div className="space-y-8">
              <div className="space-y-4">
                <h2>Founders, Startups, and Scale-ups</h2>
                <p className="text-lg text-muted-foreground">
                  Working alongside founders and early-stage leadership teams at critical moments in their growth journey.
                </p>
              </div>

              <StaggeredChildren className="space-y-4 pt-2">
                <StaggeredItem>
                  <div className="pl-6 border-l border-border/50 hover:border-accent/50 transition-colors">
                    <p className="text-muted-foreground">
                      Mentoring founders and early leadership teams through growth and transition
                    </p>
                  </div>
                </StaggeredItem>
                <StaggeredItem>
                  <div className="pl-6 border-l border-border/50 hover:border-accent/50 transition-colors">
                    <p className="text-muted-foreground">
                      Advising on decision-making, structure, and operating focus in early stages
                    </p>
                  </div>
                </StaggeredItem>
                <StaggeredItem>
                  <div className="pl-6 border-l border-border/50 hover:border-accent/50 transition-colors">
                    <p className="text-muted-foreground">
                      Selective long-term advisory and investment relationships
                    </p>
                  </div>
                </StaggeredItem>
              </StaggeredChildren>

              <p className="text-muted-foreground pt-4">
                This work provides early visibility into common failure patterns and scaling challenges.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing">
        <div className="container-narrow">
          <AnimatedSection>
            <p className="text-lg text-muted-foreground">
              For a detailed role history and responsibilities, see my{" "}
              <Link to="/resume" className="text-foreground underline underline-offset-4 hover:text-accent transition-colors">
                Resume
              </Link>.
            </p>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
