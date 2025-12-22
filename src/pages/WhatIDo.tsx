import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/hooks/useAnalytics";
import { TrackedExternalLink } from "@/components/TrackedLink";

export default function WhatIDo() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.hash]);
  return (
    <Layout>
      <SEO 
        title="Services - Advisory, Fractional Leadership & Capability Building"
        description="Helping leaders make decisions, align teams, and move forward with clarity. Advisory sprints, fractional executive leadership, and mentoring for organisations where stakes are high."
        canonical="/what-i-do"
        keywords="advisory sprints, fractional COO, fractional CCO, executive mentoring, capability building, leadership development, strategic advisory, decision support"
        breadcrumb={[{ name: "What I Do", path: "/what-i-do" }]}
      />
      {/* Header */}
      <section className="section-spacing lg:pb-24">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-6">
              <h1>What I do</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                My work focuses on helping leaders make decisions, align teams, and move forward with clarity and accountability. I am typically brought in when progress stalls, stakes are high, and the cost of getting decisions wrong is significant.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Advisory Sprints - Visually Primary */}
      <section id="advisory" className="py-6 md:py-6 lg:py-8 scroll-mt-24">
        <div className="container-narrow">
          <AnimatedSection>
            {/* Mobile: stacked layout */}
            <div className="lg:hidden space-y-8">
              <h2>Advisory Sprints</h2>
              <div className="space-y-6 max-w-2xl">
                <p className="text-muted-foreground">
                  Short, focused engagements designed to unblock decisions and restore momentum.
                </p>
                <p className="text-muted-foreground">
                  I am typically brought in when initiatives stall after pilots, when leadership teams are under pressure to act, or when high-stakes decisions need to be made with incomplete information.
                </p>
                <div className="space-y-3">
                  <p className="text-foreground/90 font-medium">Leaders walk away with:</p>
                  <ul className="space-y-2 text-muted-foreground pl-4">
                    <li>Clear priorities and decision paths</li>
                    <li>What to stop, not just what to do next</li>
                    <li>Alignment on next steps, ownership, and decision authority</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Desktop: two-column layout */}
            <div className="hidden lg:grid lg:grid-cols-[30%_70%] lg:gap-12 lg:items-start">
              <div className="pt-1">
                <h2 className="text-[2rem] font-medium leading-snug">Advisory Sprints</h2>
              </div>
              <div className="space-y-5">
                <p className="text-base leading-[1.8] text-muted-foreground">
                  Short, focused engagements designed to unblock decisions and restore momentum.
                </p>
                <p className="text-base leading-[1.8] text-muted-foreground">
                  I am typically brought in when initiatives stall after pilots, when leadership teams are under pressure to act, or when high-stakes decisions need to be made with incomplete information.
                </p>
                <div className="space-y-3 pt-1">
                  <p className="text-base text-foreground font-medium">Leaders walk away with:</p>
                  <ul className="space-y-2 text-base leading-[1.8] text-muted-foreground pl-5">
                    <li>Clear priorities and decision paths</li>
                    <li>What to stop, not just what to do next</li>
                    <li>Alignment on next steps, ownership, and decision authority</li>
                  </ul>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Fractional Leadership - Increased Visual Weight */}
      <section id="fractional" className="py-6 md:py-6 lg:py-9 scroll-mt-24">
        <div className="container-narrow">
          <AnimatedSection delay={0.05}>
            {/* Mobile: stacked layout */}
            <div className="lg:hidden space-y-8">
              <h2>Fractional Leadership</h2>
              <div className="space-y-6 max-w-2xl">
                <p className="text-muted-foreground">
                  In fractional roles, I work directly with the CEO or executive team. I operate as a senior peer, not a consultant, with responsibility for shaping direction, aligning teams, and supporting execution across strategy, operations, and governance.
                </p>
                <div className="space-y-3">
                  <p className="text-foreground/90 font-medium">Typical focus areas include:</p>
                  <ul className="space-y-2 text-muted-foreground pl-4">
                    <li>Strategic and operational alignment at executive level</li>
                    <li>Shaping commercial and operating model decisions</li>
                    <li>Governance and execution during periods of change</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Desktop: two-column layout */}
            <div className="hidden lg:grid lg:grid-cols-[30%_70%] lg:gap-12 lg:items-start">
              <div className="pt-1">
                <h2 className="text-[2rem] font-medium leading-snug">Fractional Leadership</h2>
              </div>
              <div className="space-y-5">
                <p className="text-base leading-[1.8] text-muted-foreground">
                  In fractional roles, I work directly with the CEO or executive team. I operate as a senior peer, not a consultant, with responsibility for shaping direction, aligning teams, and supporting execution across strategy, operations, and governance.
                </p>
                <div className="space-y-3 pt-1">
                  <p className="text-base text-foreground font-medium">Typical focus areas include:</p>
                  <ul className="space-y-2 text-base leading-[1.8] text-muted-foreground pl-5">
                    <li>Strategic and operational alignment at executive level</li>
                    <li>Shaping commercial and operating model decisions</li>
                    <li>Governance and execution during periods of change</li>
                  </ul>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Mentoring and Capability Building */}
      <section id="mentoring" className="py-6 md:py-6 lg:py-7 scroll-mt-24">
        <div className="container-narrow">
          <AnimatedSection delay={0.1}>
            {/* Mobile: stacked layout */}
            <div className="lg:hidden space-y-8">
              <h2>Mentoring and Capability Building</h2>
              <div className="space-y-6 max-w-2xl">
                <p className="text-muted-foreground">
                  Mentoring and capability building form part of how I work with founders, senior operators, and leadership teams where long-term strength matters more than short-term fixes.
                </p>
                <p className="text-muted-foreground">
                  This work gives early visibility into common failure patterns, decision bottlenecks, and scaling issues that established organisations often encounter later.
                </p>
                <p className="text-muted-foreground">
                  It builds judgement, shared language, and confidence rather than dependency.
                </p>
                <p className="text-foreground font-medium">
                  These are not training programmes.
                </p>
              </div>
            </div>

            {/* Desktop: two-column layout */}
            <div className="hidden lg:grid lg:grid-cols-[30%_70%] lg:gap-12 lg:items-start">
              <div className="pt-1">
                <h2 className="text-[2rem] font-medium leading-snug">Mentoring and<br />Capability Building</h2>
              </div>
              <div className="space-y-4">
                <p className="text-base leading-[1.8] text-muted-foreground">
                  Mentoring and capability building form part of how I work with founders, senior operators, and leadership teams where long-term strength matters more than short-term fixes.
                </p>
                <p className="text-base leading-[1.8] text-muted-foreground">
                  This work gives early visibility into common failure patterns, decision bottlenecks, and scaling issues that established organisations often encounter later.
                </p>
                <p className="text-base leading-[1.8] text-muted-foreground">
                  It builds judgement, shared language, and confidence rather than dependency.
                </p>
                <p className="text-base leading-[1.8] text-foreground font-medium pt-2">
                  These are not training programmes.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Workshops and Bootcamps */}
      <section id="workshops" className="py-6 md:py-6 lg:py-7 scroll-mt-24">
        <div className="container-narrow">
          <AnimatedSection delay={0.15}>
            {/* Mobile: stacked layout */}
            <div className="lg:hidden space-y-8">
              <h2>Workshops and Bootcamps</h2>
              <div className="space-y-6 max-w-2xl">
                <p className="text-muted-foreground">
                  Workshops and bootcamps are used where alignment, shared understanding, and collective decision-making are required. They are designed to create clarity, surface assumptions, and agree decisive next steps, often during periods of change or transition.
                </p>
                <p className="text-muted-foreground">
                  Delivered through direct engagements and selected partners, including{" "}
                  <TrackedExternalLink 
                    href="https://blackstormco.asia/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    eventName="partner_blackstorm"
                    className="text-accent hover:underline"
                  >
                    Blackstorm
                  </TrackedExternalLink>,{" "}
                  <TrackedExternalLink 
                    href="https://e27.co/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    eventName="partner_e27"
                    className="text-accent hover:underline"
                  >
                    e27
                  </TrackedExternalLink>, and{" "}
                  <TrackedExternalLink 
                    href="https://beyond4.tech/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    eventName="partner_beyond4tech"
                    className="text-accent hover:underline"
                  >
                    Beyond4Tech
                  </TrackedExternalLink>.
                </p>
              </div>
            </div>

            {/* Desktop: two-column layout */}
            <div className="hidden lg:grid lg:grid-cols-[30%_70%] lg:gap-12 lg:items-start">
              <div className="pt-1">
                <h2 className="text-[2rem] font-medium leading-snug">Workshops and<br />Bootcamps</h2>
              </div>
              <div className="space-y-4">
                <p className="text-base leading-[1.8] text-muted-foreground">
                  Workshops and bootcamps are used where alignment, shared understanding, and collective decision-making are required. They are designed to create clarity, surface assumptions, and agree decisive next steps, often during periods of change or transition.
                </p>
                <p className="text-base leading-[1.8] text-muted-foreground">
                  Delivered through direct engagements and selected partners, including{" "}
                  <TrackedExternalLink 
                    href="https://blackstormco.asia/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    eventName="partner_blackstorm"
                    className="text-accent hover:underline"
                  >
                    Blackstorm
                  </TrackedExternalLink>,{" "}
                  <TrackedExternalLink 
                    href="https://e27.co/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    eventName="partner_e27"
                    className="text-accent hover:underline"
                  >
                    e27
                  </TrackedExternalLink>, and{" "}
                  <TrackedExternalLink 
                    href="https://beyond4.tech/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    eventName="partner_beyond4tech"
                    className="text-accent hover:underline"
                  >
                    Beyond4Tech
                  </TrackedExternalLink>.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA - With Container Band */}
      <section className="py-7 md:py-9 lg:py-11 lg:bg-[hsl(var(--section-light))]">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <div className="space-y-8 lg:py-8">
              <h2 className="lg:text-4xl">Interested in working together?</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                If this sounds relevant, the best next step is a short conversation to assess fit and scope.
              </p>
              <Button 
                variant="hero" 
                size="lg" 
                asChild
                onClick={() => trackEvent({ eventType: 'cta_click', eventName: 'book_clarity_call', eventData: { page: 'what-i-do' } })}
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