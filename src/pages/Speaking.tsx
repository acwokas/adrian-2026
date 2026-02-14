import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/useAnalytics";
import { motion } from "framer-motion";

export default function Speaking() {
  const { trackBookingClick } = useAnalytics();

  return (
    <Layout>
      <SEO
        canonical="/speaking"
        title="Speaking & Workshops — Adrian Watkins"
        description="Executive workshops, keynotes, and advisory engagements on applied intelligence, commercial strategy, and building capability without dependency."
        keywords="executive workshops, AI keynote speaker, applied intelligence workshops, board advisory, commercial strategy speaker, Asia Pacific"
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
            <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15]">
              Speaking &amp; Workshops
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-[720px]">
              I work with executive teams, boards, and portfolio companies on applied intelligence, commercial strategy, and building capability without dependency.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Recent Keynotes */}
      <section className="py-10 md:py-12 lg:py-14 border-t border-border/50">
        <div className="container-wide max-w-[900px] mx-auto">
          <AnimatedSection>
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl">Recent Keynotes</h2>
              <div className="space-y-5 max-w-[720px]">
                <p className="text-muted-foreground leading-relaxed">
                  Recent speaking engagements include:
                </p>
                <div className="space-y-2 pl-6 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">
                  <p className="text-foreground font-medium leading-relaxed pl-2">
                    Democratising Intelligence for a Sustainable Future
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed pl-2">
                    Taipei City Government, Smart Living Sustainable Future 2025, Taiwan (November 2025)
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed pl-2">
                    Keynote address to 130+ officials, investors and founders on building governance into infrastructure and making intelligence accessible beyond compute access.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Executive Workshops */}
      <section className="py-10 md:py-12 lg:py-14 border-t border-border/50">
        <div className="container-wide max-w-[900px] mx-auto">
          <AnimatedSection>
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl">Executive Workshops</h2>
              <div className="space-y-5 max-w-[720px]">
                <p className="text-muted-foreground leading-relaxed">
                  Intensive sessions designed to shift thinking and unlock action. Recent engagements include:
                </p>
                <ul className="space-y-3 pl-6 text-muted-foreground">
                  <li className="leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">
                    Business Model Canvas &amp; AI Strategy (Blackstorm Group, 2024–2026)
                  </li>
                  <li className="leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">
                    Applied Intelligence for Portfolio Companies (Blackstorm Group)
                  </li>
                  <li className="leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">
                    Strategic Planning &amp; Execution Discipline
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  These are not training programmes. They focus on helping leaders make decisions, act on them, and move forward with clarity and accountability.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Keynotes & Speaking */}
      <section className="py-10 md:py-12 lg:py-14 border-t border-border/50">
        <div className="container-wide max-w-[900px] mx-auto">
          <AnimatedSection>
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl">Speaking Topics</h2>
              <div className="space-y-5 max-w-[720px]">
                <p className="text-muted-foreground leading-relaxed">
                  Speaking topics include:
                </p>
                <ul className="space-y-3 pl-6 text-muted-foreground">
                  <li className="leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">
                    The EDGE Framework: Structuring Intelligence for Capability
                  </li>
                  <li className="leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">
                    From Experimentation to Execution: Making AI Adoption Systematic
                  </li>
                  <li className="leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">
                    Governance as Enabler: Building Trust Through Discipline
                  </li>
                  <li className="leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">
                    Commercial Strategy in Complex Environments
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  Recent engagements span startup accelerators, industry conferences, and executive forums across Asia-Pacific.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Advisory & Board Engagement */}
      <section className="py-10 md:py-12 lg:py-14 border-t border-border/50">
        <div className="container-wide max-w-[900px] mx-auto">
          <AnimatedSection>
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl">Advisory &amp; Board Engagement</h2>
              <div className="space-y-5 max-w-[720px]">
                <p className="text-muted-foreground leading-relaxed">
                  Board-level engagement focused on:
                </p>
                <ul className="space-y-3 pl-6 text-muted-foreground">
                  <li className="leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">
                    Strategic direction and commercial priorities
                  </li>
                  <li className="leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">
                    Investment readiness and execution risk
                  </li>
                  <li className="leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">
                    Governance and accountability frameworks
                  </li>
                  <li className="leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">
                    M&amp;A integration and transformation
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  I work with CEOs and leadership teams where clarity, pace, and consequence matter.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 md:py-12 lg:py-14 border-t border-border/50">
        <div className="container-wide max-w-[800px] mx-auto text-center">
          <AnimatedSection>
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl">Interested in Working Together?</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                A short conversation is often the best way to assess fit and scope.
              </p>
              <div className="pt-2">
                <Button
                  variant="hero"
                  size="lg"
                  asChild
                  onClick={() => trackBookingClick('speaking-cta')}
                >
                  <a href="https://calendly.com/adrian-watkins1/new-meeting" target="_blank" rel="noopener noreferrer">
                    Book a 30-minute clarity call
                  </a>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
