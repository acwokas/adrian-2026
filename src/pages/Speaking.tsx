import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/useAnalytics";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

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

      {/* Unique Positioning */}
      <section className="py-10 md:py-12 lg:py-14 border-t border-border/50">
        <div className="container-wide max-w-[900px] mx-auto">
          <AnimatedSection>
            <div className="border-l-2 border-accent pl-6 md:pl-8 space-y-4 max-w-[720px]">
              <h2 className="text-xl md:text-2xl">A Unique Perspective</h2>
              <p className="text-muted-foreground leading-relaxed text-[1.05rem]">
                The only framework combining board-level AI governance with executable tools, proven across Asia-Pacific markets. EDGE bridges the gap between strategic intent and operational reality, translating governance from restriction into competitive advantage.
              </p>
              <p className="text-muted-foreground leading-relaxed text-[1.05rem]">
                Drawing from 12 years across Singapore, Jakarta, Bangkok, Vietnam, Australia and beyond, and another 14 in London, I bring both commercial operating experience and governance discipline to help organisations move from experimentation to structured capability.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Recent & Upcoming Engagements */}
      <section className="py-10 md:py-12 lg:py-14 border-t border-border/50">
        <div className="container-wide max-w-[900px] mx-auto">
          <AnimatedSection>
            <div className="space-y-8">
              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl">Recent &amp; Upcoming Engagements</h2>
                <p className="text-muted-foreground leading-relaxed max-w-[720px]">
                  Keynotes, workshops, and interactive sessions across Asia-Pacific
                </p>
              </div>

              <div className="max-w-[720px] space-y-6">
                {/* Recent label */}
                <p className="text-accent text-xs font-medium tracking-widest uppercase">Recent</p>

                {/* Recent engagement */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="h-4 w-4 text-accent" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-foreground font-medium leading-relaxed">
                      Democratising Intelligence for a Sustainable Future
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Smart Living Sustainable Future 2025 — Taipei City Government, Taiwan (November 2025)
                    </p>
                    <p className="text-muted-foreground/70 text-sm leading-relaxed">
                      Keynote to 150+ officials, investors, and founders on building governance into infrastructure
                    </p>
                  </div>
                </div>

                {/* Upcoming label */}
                <p className="text-accent text-xs font-medium tracking-widest uppercase pt-4">Upcoming</p>

                {/* Upcoming engagement */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <ArrowRight className="h-4 w-4 text-accent" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-foreground font-medium leading-relaxed">
                      Business Model Canvas &amp; Marketing Workshop
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Launch Entrepreneurship Bootcamp 3 — National Library Board x Blackstorm Group, Singapore (1 March 2026)
                    </p>
                    <p className="text-muted-foreground/70 text-sm leading-relaxed">
                      Interactive workshop for aspiring entrepreneurs and early-stage founders on structuring business ideas and go-to-market strategy
                    </p>
                  </div>
                </div>
              </div>

              <div className="max-w-[720px] pt-4 space-y-5">
                <p className="text-muted-foreground leading-relaxed">
                  Available for keynotes, executive workshops, and interactive sessions on applied intelligence, AI governance, commercial strategy, and building structured capability.
                </p>
                <Button
                  variant="hero"
                  size="lg"
                  asChild
                  onClick={() => trackBookingClick('speaking-engagements-cta')}
                >
                  <a href="https://calendly.com/adrian-watkins1/new-meeting" target="_blank" rel="noopener noreferrer">
                    Discuss a speaking engagement →
                  </a>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-10 md:py-12 lg:py-14 border-t border-border/50">
        <div className="container-wide max-w-[900px] mx-auto">
          <AnimatedSection>
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl">What Participants Say</h2>
              <div className="border-l-2 border-accent pl-6 md:pl-8 max-w-[720px]">
                <p className="text-foreground text-lg md:text-xl leading-relaxed italic">
                  "Adrian's keynote at Smart Living Sustainable Future 2025 provided 150+ officials, investors and founders with a framework for embedding governance into infrastructure, not layering it on top. His ability to translate complex AI governance into actionable strategy was exceptional."
                </p>
                <div className="mt-4">
                  <p className="text-accent font-medium text-sm">Conference Organiser</p>
                  <p className="text-muted-foreground text-sm">Smart Living Sustainable Future 2025, Taipei</p>
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
                <div className="mt-8 pt-8 border-t border-border/30">
                  <h3 className="text-xl md:text-2xl mb-3">What Teams Walk Away With</h3>
                  <p className="text-muted-foreground leading-relaxed mb-5">
                    These are not training programmes. They are decision-making sessions that produce concrete outputs.
                  </p>
                  <ul className="space-y-4 pl-6 text-muted-foreground">
                    <li className="leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">
                      <span className="text-foreground font-medium">Decision Ownership Map:</span> Clear accountability for AI adoption across functions
                    </li>
                    <li className="leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">
                      <span className="text-foreground font-medium">Risk Assessment Checklist:</span> Governance, compliance, and execution risks identified
                    </li>
                    <li className="leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">
                      <span className="text-foreground font-medium">30-Day Action Roadmap:</span> Prioritised next steps with assigned ownership
                    </li>
                    <li className="leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">
                      <span className="text-foreground font-medium">Framework Templates:</span> Downloadable decision matrices, escalation protocols, and review structures
                    </li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-5">
                    Workshops typically run 2-4 hours and can be delivered in-person or remotely to executive teams, boards, or portfolio companies.
                  </p>
                </div>
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
