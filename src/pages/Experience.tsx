import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
                My experience spans senior commercial and operational leadership, advisory and fractional roles, and building platforms and ecosystems. I have worked across different growth stages and complex environments, often where clarity, governance, and execution were critical.
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
                  Senior leadership roles with responsibility for commercial strategy, operations, governance, and execution across multi-market environments.
                </p>
              </div>

              <StaggeredChildren className="space-y-4 pt-2">
                <StaggeredItem>
                  <div className="pl-6 border-l border-border/50 hover:border-accent/50 transition-colors">
                    <p className="text-muted-foreground">
                      P&L and commercial accountability across technology and media businesses in Asia Pacific
                    </p>
                  </div>
                </StaggeredItem>
                <StaggeredItem>
                  <div className="pl-6 border-l border-border/50 hover:border-accent/50 transition-colors">
                    <p className="text-muted-foreground">
                      Operating model design and oversight during restructuring and growth phases
                    </p>
                  </div>
                </StaggeredItem>
                <StaggeredItem>
                  <div className="pl-6 border-l border-border/50 hover:border-accent/50 transition-colors">
                    <p className="text-muted-foreground">
                      Cross-functional leadership spanning commercial, product, and operations teams
                    </p>
                  </div>
                </StaggeredItem>
                <StaggeredItem>
                  <div className="pl-6 border-l border-border/50 hover:border-accent/50 transition-colors">
                    <p className="text-muted-foreground">
                      Working directly with executive teams and boards on strategic and operational priorities
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
                  Advisory and fractional leadership roles supporting CEOs, founders, and executive teams during periods of change, ambiguity, or growth.
                </p>
              </div>

              <StaggeredChildren className="space-y-4 pt-2">
                <StaggeredItem>
                  <div className="pl-6 border-l border-border/50 hover:border-accent/50 transition-colors">
                    <p className="text-muted-foreground">
                      Decision support at senior level on strategic direction and commercial priorities
                    </p>
                  </div>
                </StaggeredItem>
                <StaggeredItem>
                  <div className="pl-6 border-l border-border/50 hover:border-accent/50 transition-colors">
                    <p className="text-muted-foreground">
                      Bridging strategy to execution, particularly during transitions and complex initiatives
                    </p>
                  </div>
                </StaggeredItem>
                <StaggeredItem>
                  <div className="pl-6 border-l border-border/50 hover:border-accent/50 transition-colors">
                    <p className="text-muted-foreground">
                      Temporary but accountable leadership roles as fractional COO and commercial lead
                    </p>
                  </div>
                </StaggeredItem>
              </StaggeredChildren>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 3: Platforms, Ecosystems, and Thought Leadership */}
      <section className="section-spacing border-b border-border/50">
        <div className="container-narrow">
          <AnimatedSection delay={0.1}>
            <div className="space-y-8">
              <div className="space-y-4">
                <h2>Platforms, Ecosystems, and Thought Leadership</h2>
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
                      Mentoring founders on commercial strategy, leadership, and operational discipline
                    </p>
                  </div>
                </StaggeredItem>
                <StaggeredItem>
                  <div className="pl-6 border-l border-border/50 hover:border-accent/50 transition-colors">
                    <p className="text-muted-foreground">
                      Advising early-stage leadership teams navigating growth, fundraising, and market expansion
                    </p>
                  </div>
                </StaggeredItem>
                <StaggeredItem>
                  <div className="pl-6 border-l border-border/50 hover:border-accent/50 transition-colors">
                    <p className="text-muted-foreground">
                      Selective long-term advisory relationships with high-potential ventures
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
              For a detailed role history, see my{" "}
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
