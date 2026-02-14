import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import { TrackedLink } from "@/components/TrackedLink";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function Experience() {
  const { trackContactCTA } = useAnalytics();
  
  return (
    <Layout>
      <SEO 
        title="About — Adrian Watkins"
        description="Two decades of senior commercial and operational leadership across Asia Pacific. Board-level advisory, fractional executive positions, and executive decision support in AI, media, and technology sectors."
        canonical="/about"
        keywords="Adrian Watkins, commercial leadership, operational leadership, board advisory, executive decision support, Asia Pacific, AI advisory, EDGE Framework, governance"
        breadcrumb={[{ name: "About", path: "/about" }]}
      />
      
      {/* Narrative Intro */}
      <section className="section-spacing lg:pb-12">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
              {/* Photo */}
              <div className="w-full max-w-[320px] md:max-w-[400px] flex-shrink-0 mx-auto md:mx-0">
                <img
                  src="/adrian-headshot.webp"
                  alt="Adrian Watkins"
                  className="w-full h-auto rounded-sm border border-border/20"
                  loading="eager"
                />
              </div>
              {/* Narrative */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <h1>Adrian Watkins</h1>
                  <p className="text-accent font-medium">Creator, EDGE Framework for Applied Intelligence</p>
                  <p className="text-muted-foreground text-sm">SVP Commercial Operations &amp; Governance, SQREEM Technologies</p>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    After 15 years watching organisations fragment AI adoption across Asia-Pacific — from Singapore to Jakarta to Bangkok — I kept seeing the same pattern: enthusiasm without architecture. Pilots launched. Tools trialled. Teams experiment. But few embed intelligence into decision-making with clarity and discipline.
                  </p>
                  <p>
                    The EDGE Framework emerged from that gap. It is not theory. It is the structure I wish had existed when I was navigating fragmentation, exposure, and illusion of progress across commercial leadership, advisory, and fractional roles.
                  </p>
                  <p>
                    EDGE provides what scattered adoption cannot: a path from curiosity to capability, and from capability to sustained advantage.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Experience Context */}
      <section className="py-6 md:py-5 lg:py-8 border-t border-border/50">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-4 max-w-3xl">
              <p className="text-xl lg:text-[1.375rem] leading-relaxed text-muted-foreground">
                My experience spans senior commercial and operational leadership, advisory and fractional roles, and building platforms and ecosystems. I have operated across different growth stages and complex environments, often where clarity, governance, and execution were critical.
              </p>
              <p className="text-base text-muted-foreground/70">
                The sections below are grouped by responsibility rather than chronology.
              </p>
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

      {/* Section 3: Platforms and Thought Leadership */}
      <section className="py-6 md:py-5 lg:py-7">
        <div className="container-narrow">
          <AnimatedSection delay={0.1}>
            {/* Mobile: stacked layout */}
            <div className="lg:hidden space-y-6">
              <h2>Platforms and Thought Leadership</h2>
              <p className="text-muted-foreground">
                Beyond commercial and operational roles, I have built platforms and frameworks that reflect a commitment to democratising applied intelligence.
              </p>
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-foreground font-medium">EDGE Framework for Applied Intelligence (2024 – Present)</p>
                  <p className="text-muted-foreground text-sm">A leadership-level framework for structuring AI adoption in modern organisations. Applied through diagnostics, workshops, and advisory engagements. Includes 12 simulation rooms, maturity assessment, and implementation frameworks for boards and executives.</p>
                  <ul className="space-y-1 text-muted-foreground text-sm pl-4">
                    <li className="pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">12 simulation &amp; assessment tools</li>
                    <li className="pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">AI Governance Maturity Model</li>
                    <li className="pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">Implementation guide &amp; frameworks</li>
                    <li className="pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">White paper &amp; resources</li>
                  </ul>
                  <Button variant="hero" size="sm" asChild className="mt-2">
                    <Link to="/edge">Explore EDGE →</Link>
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-foreground font-medium"><a href="https://www.aiinasia.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-accent transition-colors">AiinASIA.com</a> (2020 – Present)</p>
                  <p className="text-muted-foreground text-sm">Founder and Publisher. Practical AI insight for Asia-Pacific markets, reaching 10,000 monthly readers with zero paid marketing. Provides continuous feedback from founders, operators, and policymakers.</p>
                  <Button variant="hero" size="sm" asChild className="mt-2">
                    <a href="https://www.aiinasia.com" target="_blank" rel="noopener noreferrer">Read articles →</a>
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-foreground font-medium"><a href="https://promptandgo.ai" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-accent transition-colors">PromptAndGo.ai</a> (2023 – Present)</p>
                  <p className="text-muted-foreground text-sm">An ecosystem of tools and resources designed to democratise access to capability often locked behind large organisations or underutilised due to lack of knowledge. Scout AI system for generating, optimising, and adapting prompts across platforms. 3,000+ prompt library with platform-specific rewrites and educational resources.</p>
                  <ul className="space-y-1 text-muted-foreground text-sm pl-4">
                    <li className="pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">Prompt Generator (AI-powered)</li>
                    <li className="pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">Prompt Optimiser (before/after)</li>
                    <li className="pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">Platform Adapters (11 platforms)</li>
                    <li className="pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">3,000+ Prompt Library</li>
                  </ul>
                  <Button variant="hero" size="sm" asChild className="mt-2">
                    <a href="https://promptandgo.ai" target="_blank" rel="noopener noreferrer">Visit PromptAndGo →</a>
                  </Button>
                </div>
                <div className="space-y-1">
                  <p className="text-foreground font-medium">Blackstorm Group (2024 – Present)</p>
                  <p className="text-muted-foreground text-sm">Fractional Advisor and Workshop Facilitator. Executive workshops on business model innovation and AI strategy for portfolio companies.</p>
                </div>
              </div>
            </div>

            {/* Desktop: two-column layout */}
            <div className="hidden lg:grid lg:grid-cols-[30%_70%] lg:gap-12 lg:items-start">
              <div className="pt-1">
                <h2 className="text-[2rem] font-medium leading-snug">Platforms and<br />Thought Leadership</h2>
              </div>
              <div className="space-y-6">
                <p className="text-base leading-[1.85] text-muted-foreground">
                  Beyond commercial and operational roles, I have built platforms and frameworks that reflect a commitment to democratising applied intelligence.
                </p>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-base text-foreground font-medium">EDGE Framework for Applied Intelligence (2024 – Present)</p>
                    <p className="text-base leading-[1.85] text-muted-foreground">A leadership-level framework for structuring AI adoption in modern organisations. Applied through diagnostics, workshops, and advisory engagements. Includes 12 simulation rooms, maturity assessment, and implementation frameworks for boards and executives.</p>
                    <ul className="space-y-1 text-sm text-muted-foreground pl-4">
                      <li className="pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">12 simulation &amp; assessment tools</li>
                      <li className="pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">AI Governance Maturity Model</li>
                      <li className="pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">Implementation guide &amp; frameworks</li>
                      <li className="pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">White paper &amp; resources</li>
                    </ul>
                    <Button variant="hero" size="sm" asChild className="mt-2">
                      <Link to="/edge">Explore EDGE →</Link>
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-base text-foreground font-medium"><a href="https://www.aiinasia.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-accent transition-colors">AiinASIA.com</a> (2020 – Present)</p>
                    <p className="text-base leading-[1.85] text-muted-foreground">Founder and Publisher. Practical AI insight for Asia-Pacific markets, reaching 10,000 monthly readers with zero paid marketing. Provides continuous feedback from founders, operators, and policymakers.</p>
                    <Button variant="hero" size="sm" asChild className="mt-2">
                      <a href="https://www.aiinasia.com" target="_blank" rel="noopener noreferrer">Read articles →</a>
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-base text-foreground font-medium"><a href="https://promptandgo.ai" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-accent transition-colors">PromptAndGo.ai</a> (2023 – Present)</p>
                    <p className="text-base leading-[1.85] text-muted-foreground">An ecosystem of tools and resources designed to democratise access to capability often locked behind large organisations or underutilised due to lack of knowledge. Scout AI system for generating, optimising, and adapting prompts across platforms. 3,000+ prompt library with platform-specific rewrites and educational resources.</p>
                    <ul className="space-y-1 text-sm text-muted-foreground pl-4">
                      <li className="pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">Prompt Generator (AI-powered)</li>
                      <li className="pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">Prompt Optimiser (before/after)</li>
                      <li className="pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">Platform Adapters (11 platforms)</li>
                      <li className="pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent">3,000+ Prompt Library</li>
                    </ul>
                    <Button variant="hero" size="sm" asChild className="mt-2">
                      <a href="https://promptandgo.ai" target="_blank" rel="noopener noreferrer">Visit PromptAndGo →</a>
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <p className="text-base text-foreground font-medium">Blackstorm Group (2024 – Present)</p>
                    <p className="text-base leading-[1.85] text-muted-foreground">Fractional Advisor and Workshop Facilitator. Executive workshops on business model innovation and AI strategy for portfolio companies.</p>
                  </div>
                </div>
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
              <p className="text-muted-foreground">
                Startups fail predictably. Founders make the same structural mistakes — unclear ownership, scattered tools, governance as afterthought. I work with founders who want to avoid those patterns, not repeat them.
              </p>
              <p className="text-muted-foreground font-medium">This work focuses on:</p>
              <ul className="space-y-3 text-muted-foreground">
                <li>Mentoring founders and early leadership teams through growth and transition</li>
                <li>Advising on decision-making, structure, and operating focus in early stages</li>
                <li>Building governance discipline before it becomes crisis management</li>
                <li>Selective long-term advisory and investment relationships</li>
              </ul>
              <p className="text-muted-foreground pt-2">
                Most engagements are referral-based. I work with founders who value clarity over speed, and structure over scramble.
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
                <p className="text-base leading-[1.85] text-muted-foreground">
                  Startups fail predictably. Founders make the same structural mistakes — unclear ownership, scattered tools, governance as afterthought. I work with founders who want to avoid those patterns, not repeat them.
                </p>
                <p className="text-base leading-[1.85] text-foreground font-medium">This work focuses on:</p>
                <ul className="space-y-4 text-base leading-[1.85] text-muted-foreground">
                  <li>Mentoring founders and early leadership teams through growth and transition</li>
                  <li>Advising on decision-making, structure, and operating focus in early stages</li>
                  <li>Building governance discipline before it becomes crisis management</li>
                  <li>Selective long-term advisory and investment relationships</li>
                </ul>
                <p className="text-base leading-[1.85] text-foreground pt-2">
                  Most engagements are referral-based. I work with founders who value clarity over speed, and structure over scramble.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CV Download */}
      <section className="py-6 md:py-7 lg:py-9">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-6">
              <h2>For a Detailed Role History and Responsibilities</h2>
              <p className="text-lg lg:text-xl text-muted-foreground">
                For a detailed role history and responsibilities, see my Executive CV.
              </p>
              <Button
                variant="hero"
                size="lg"
                asChild
              >
                <a href="/documents/AdrianWatkins_Executive-CV.pdf" target="_blank" rel="noopener noreferrer">
                  Download Executive CV (PDF)
                </a>
              </Button>
            </div>
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
                onClick={() => trackContactCTA('experience-page')}
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