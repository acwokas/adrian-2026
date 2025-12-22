import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import { TrackedLink } from "@/components/TrackedLink";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { trackEvent } from "@/hooks/useAnalytics";

export default function Experience() {
  return (
    <Layout>
      <SEO 
        title="Experience - Commercial Leadership & Advisory Background"
        description="Two decades of senior commercial and operational leadership across Asia Pacific. Board-level advisory, fractional executive positions, and executive decision support in AI, media, and technology sectors."
        canonical="/experience"
        keywords="commercial leadership experience, operational leadership, board advisory, executive decision support, Asia Pacific executive, AI advisory, fractional executive experience, governance"
        breadcrumb={[{ name: "Experience", path: "/experience" }]}
      />
      
      {/* Header */}
      <section className="section-spacing lg:pb-12">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-6">
              <h1>Experience</h1>
              {/* Mobile intro */}
              <div className="lg:hidden space-y-4">
                <p className="text-xl text-muted-foreground max-w-2xl">
                  My experience spans senior commercial and operational leadership, advisory and fractional roles, and building platforms and ecosystems. I have operated across different growth stages and complex environments, often where clarity, governance, and execution were critical.
                </p>
                <p className="text-lg text-muted-foreground">
                  The examples below are grouped by responsibility rather than chronology.
                </p>
              </div>
              {/* Desktop intro - enhanced authority */}
              <div className="hidden lg:block space-y-4">
                <p className="text-[1.375rem] leading-relaxed text-muted-foreground max-w-3xl">
                  My experience spans senior commercial and operational leadership, advisory and fractional roles, and building platforms and ecosystems. I have operated across different growth stages and complex environments, often where clarity, governance, and execution were critical.
                </p>
                <p className="text-base text-muted-foreground/70">
                  The examples below are grouped by responsibility rather than chronology.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 1: Commercial and Operational Leadership - Primary section */}
      <section className="py-6 md:py-5 lg:py-8">
        <div className="container-narrow">
          <AnimatedSection>
            {/* Mobile: stacked layout */}
            <div className="lg:hidden space-y-6">
              <h2>Commercial and Operational Leadership</h2>
              <p className="text-muted-foreground">
                Senior commercial and operational leadership roles with direct responsibility for commercial outcomes, operating models, and execution across complex and multi-market environments.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li>Ownership of commercial outcomes, operating performance, and delivery accountability</li>
                <li>Design and oversight of operating models across growth and transformation phases</li>
                <li>Leadership across cross-functional teams and senior stakeholders</li>
              </ul>
            </div>

            {/* Desktop: two-column layout */}
            <div className="hidden lg:grid lg:grid-cols-[30%_70%] lg:gap-12 lg:items-start">
              <div className="pt-1">
                <h2 className="text-[2rem] font-medium leading-snug">Commercial and<br />Operational Leadership</h2>
              </div>
              <div className="space-y-6">
                <p className="text-base leading-[1.85] text-foreground">
                  Senior commercial and operational leadership roles with direct responsibility for commercial outcomes, operating models, and execution across complex and multi-market environments.
                </p>
                <ul className="space-y-4 text-base leading-[1.85] text-muted-foreground">
                  <li>Ownership of commercial outcomes, operating performance, and delivery accountability</li>
                  <li>Design and oversight of operating models across growth and transformation phases</li>
                  <li>Leadership across cross-functional teams and senior stakeholders</li>
                </ul>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 2: Advisory and Fractional Leadership */}
      <section className="py-6 md:py-5 lg:py-7 bg-[hsl(var(--section-light))] md:bg-transparent">
        <div className="container-narrow">
          <AnimatedSection delay={0.05}>
            {/* Mobile: stacked layout */}
            <div className="lg:hidden space-y-6">
              <h2>Advisory and Fractional Leadership</h2>
              <p className="text-muted-foreground font-medium">
                These engagements involve shared accountability for outcomes, not advisory input alone.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li>Decision support and leadership at CEO and executive team level</li>
                <li>Alignment of strategy, operations, and execution during periods of change</li>
                <li>Time-bound leadership roles with clear ownership and mandate</li>
              </ul>
              <p className="text-muted-foreground pt-2">
                This work often includes board-level engagement, executive decision support, and governance context.
              </p>
            </div>

            {/* Desktop: two-column layout */}
            <div className="hidden lg:grid lg:grid-cols-[30%_70%] lg:gap-12 lg:items-start">
              <div className="pt-1">
                <h2 className="text-[2rem] font-medium leading-snug">Advisory and<br />Fractional Leadership</h2>
              </div>
              <div className="space-y-6">
                <p className="text-base leading-[1.85] text-foreground font-medium">
                  These engagements involve shared accountability for outcomes, not advisory input alone.
                </p>
                <ul className="space-y-4 text-base leading-[1.85] text-muted-foreground">
                  <li>Decision support and leadership at CEO and executive team level</li>
                  <li>Alignment of strategy, operations, and execution during periods of change</li>
                  <li>Time-bound leadership roles with clear ownership and mandate</li>
                </ul>
                <p className="text-base leading-[1.85] text-muted-foreground pt-2">
                  This work often includes board-level engagement, executive decision support, and governance context.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 3: Platforms and Ecosystems */}
      <section className="py-6 md:py-5 lg:py-7">
        <div className="container-narrow">
          <AnimatedSection delay={0.1}>
            {/* Mobile: stacked layout */}
            <div className="lg:hidden space-y-6">
              <h2>Platforms and Ecosystems</h2>
              <p className="text-muted-foreground">
                Building and contributing to platforms and ecosystems designed to improve access to insight, capability, and decision-making. This includes <a href="https://www.aiinasia.com" target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-4 hover:text-accent transition-colors">AIinASIA.com</a> and the broader <a href="https://you.withthepowerof.ai" target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-4 hover:text-accent transition-colors">you.withthepowerof.ai</a> ecosystem.
              </p>
            </div>

            {/* Desktop: two-column layout */}
            <div className="hidden lg:grid lg:grid-cols-[30%_70%] lg:gap-12 lg:items-start">
              <div className="pt-1">
                <h2 className="text-[2rem] font-medium leading-snug">Platforms and<br />Ecosystems</h2>
              </div>
              <div>
                <p className="text-base leading-[1.85] text-muted-foreground">
                  Building and contributing to platforms and ecosystems designed to improve access to insight, capability, and decision-making. This includes <a href="https://www.aiinasia.com" target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-4 hover:text-accent transition-colors">AIinASIA.com</a> and the broader <a href="https://you.withthepowerof.ai" target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-4 hover:text-accent transition-colors">you.withthepowerof.ai</a> ecosystem.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 4: Founders, Startups, and Scale-ups */}
      <section className="py-6 md:py-5 lg:py-7 bg-[hsl(var(--section-light))] md:bg-transparent">
        <div className="container-narrow">
          <AnimatedSection delay={0.15}>
            {/* Mobile: stacked layout */}
            <div className="lg:hidden space-y-6">
              <h2>Founders, Startups, and Scale-ups</h2>
              <p className="text-muted-foreground">
                Working alongside founders and early-stage leadership teams at critical moments in their growth journey.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li>Mentoring founders and early leadership teams through growth and transition</li>
                <li>Advising on decision-making, structure, and operating focus in early stages</li>
                <li>Selective long-term advisory and investment relationships</li>
              </ul>
              <p className="text-muted-foreground pt-2">
                This work provides early visibility into common failure patterns and scaling challenges.
              </p>
            </div>

            {/* Desktop: two-column layout */}
            <div className="hidden lg:grid lg:grid-cols-[30%_70%] lg:gap-12 lg:items-start">
              <div className="pt-1">
                <h2 className="text-[2rem] font-medium leading-snug">Founders, Startups,<br />and Scale-ups</h2>
              </div>
              <div className="space-y-6">
                <p className="text-base leading-[1.85] text-muted-foreground">
                  Working alongside founders and early-stage leadership teams at critical moments in their growth journey.
                </p>
                <ul className="space-y-5 text-base leading-[1.85] text-muted-foreground">
                  <li>Mentoring founders and early leadership teams through growth and transition</li>
                  <li>Advising on decision-making, structure, and operating focus in early stages</li>
                  <li>Selective long-term advisory and investment relationships</li>
                </ul>
                <p className="text-base leading-[1.85] text-foreground pt-2">
                  This work provides early visibility into common failure patterns and scaling challenges.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Closing statement */}
      <section className="py-6 md:py-7 lg:py-9">
        <div className="container-narrow">
          <AnimatedSection>
            <p className="text-lg lg:text-xl text-muted-foreground">
              For a detailed role history and responsibilities, see my{" "}
              <TrackedLink to="/executive-cv" eventName="executive_cv_link" className="text-foreground underline underline-offset-4 hover:text-accent transition-colors">
                Executive CV
              </TrackedLink>.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Module */}
      <section className="pt-4 pb-14 md:pt-6 md:pb-16 lg:pt-8 lg:pb-20">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="flex flex-col items-center text-center space-y-6">
              <h2>Interested in working together?</h2>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-xl">
                If this sounds relevant, the best next step is a short conversation to assess fit and scope.
              </p>
              <Button 
                variant="hero" 
                size="xl" 
                asChild 
                className="min-w-[300px]"
                onClick={() => trackEvent({ eventType: 'cta_click', eventName: 'book_clarity_call_experience' })}
              >
                <a href="/contact">
                  <Calendar size={20} />
                  Book a 30-minute clarity call
                </a>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}