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
      <section className="section-spacing">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-6">
              <h1>What I do</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                My work focuses on helping leaders make decisions, align teams, and move forward with clarity and accountability. I am typically brought in when complexity, change, or pressure makes progress difficult.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Advisory Sprints - Visually Primary */}
      <section id="advisory" className="py-16 md:py-24 lg:py-28 scroll-mt-24">
        <div className="container-narrow">
          <AnimatedSection>
            {/* Mobile: stacked layout */}
            <div className="lg:hidden space-y-8">
              <h2>Advisory Sprints</h2>
              <div className="space-y-6 max-w-2xl">
                <p className="text-muted-foreground">
                  Short, focused engagements designed to unblock decisions and restore momentum when progress has stalled.
                </p>
                <p className="text-muted-foreground">
                  I am typically brought in when initiatives stall after pilots, when leadership teams are under pressure to act, or when high-stakes decisions need to be made with incomplete information.
                </p>
                <div className="space-y-3">
                  <p className="text-foreground/90 font-medium">Leaders walk away with:</p>
                  <ul className="space-y-2 text-muted-foreground pl-4">
                    <li>Clear priorities and decision paths</li>
                    <li>What to stop, not just what to do next</li>
                    <li>Alignment on next steps and ownership</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Desktop: two-column layout */}
            <div className="hidden lg:grid lg:grid-cols-[30%_70%] lg:gap-12">
              <div className="space-y-2">
                <h2 className="text-4xl">Advisory Sprints</h2>
                <p className="text-sm uppercase tracking-wider text-muted-foreground">Decision acceleration</p>
              </div>
              <div className="space-y-6">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Short, focused engagements designed to unblock decisions and restore momentum when progress has stalled.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  I am typically brought in when initiatives stall after pilots, when leadership teams are under pressure to act, or when high-stakes decisions need to be made with incomplete information.
                </p>
                <div className="space-y-4 pt-2">
                  <p className="text-lg text-foreground font-medium">Leaders walk away with:</p>
                  <ul className="space-y-3 text-lg leading-relaxed text-muted-foreground pl-5">
                    <li>Clear priorities and decision paths</li>
                    <li>What to stop, not just what to do next</li>
                    <li>Alignment on next steps and ownership</li>
                  </ul>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Fractional Leadership - Increased Visual Weight */}
      <section id="fractional" className="py-16 md:py-24 lg:py-32 scroll-mt-24">
        <div className="container-narrow">
          <AnimatedSection delay={0.05}>
            {/* Mobile: stacked layout */}
            <div className="lg:hidden space-y-8">
              <h2>Fractional Leadership</h2>
              <div className="space-y-6 max-w-2xl">
                <p className="text-muted-foreground">
                  In fractional roles, I work directly with the CEO or executive team. I operate as a senior peer, not a consultant, with responsibility for shaping direction, aligning teams, and supporting execution across strategy, operations, and governance.
                </p>
                <ul className="space-y-2 text-muted-foreground pl-4">
                  <li><span className="font-semibold text-foreground">Strategic and operational alignment</span> at executive level</li>
                  <li><span className="font-semibold text-foreground">Commercial and operating model</span> decisions</li>
                  <li><span className="font-semibold text-foreground">Governance and execution</span> during periods of change</li>
                </ul>
              </div>
            </div>

            {/* Desktop: two-column layout with larger header */}
            <div className="hidden lg:grid lg:grid-cols-[30%_70%] lg:gap-12">
              <div>
                <h2 className="text-[2.75rem] leading-tight">Fractional Leadership</h2>
              </div>
              <div className="space-y-6">
                <p className="text-base leading-relaxed text-muted-foreground">
                  In fractional roles, I work directly with the CEO or executive team. I operate as a senior peer, not a consultant, with responsibility for shaping direction, aligning teams, and supporting execution across strategy, operations, and governance.
                </p>
                <ul className="space-y-3 text-base leading-relaxed text-muted-foreground pl-5">
                  <li><span className="font-semibold text-foreground">Strategic and operational alignment</span> at executive level</li>
                  <li><span className="font-semibold text-foreground">Commercial and operating model</span> decisions</li>
                  <li><span className="font-semibold text-foreground">Governance and execution</span> during periods of change</li>
                </ul>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Mentoring and Capability Building - De-emphasised */}
      <section id="mentoring" className="py-16 md:py-24 lg:py-24 scroll-mt-24">
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
                  This work provides early visibility into common failure patterns, decision bottlenecks, and scaling issues that established organisations often encounter later.
                </p>
                <p className="text-muted-foreground">
                  It is designed to build judgement, shared language, and confidence, rather than dependency.
                </p>
              </div>
            </div>

            {/* Desktop: two-column layout with smaller header */}
            <div className="hidden lg:grid lg:grid-cols-[30%_70%] lg:gap-12">
              <div>
                <h3 className="text-2xl font-medium">Mentoring and Capability Building</h3>
              </div>
              <div className="space-y-5">
                <p className="text-base leading-relaxed text-muted-foreground">
                  Mentoring and capability building form part of how I work with founders, senior operators, and leadership teams where long-term strength matters more than short-term fixes.
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  This work provides early visibility into common failure patterns, decision bottlenecks, and scaling issues that established organisations often encounter later.
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  It is designed to build judgement, shared language, and confidence, rather than dependency.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Workshops and Bootcamps - Compressed and Anchored */}
      <section id="workshops" className="py-16 md:py-24 lg:py-20 scroll-mt-24 lg:border-t lg:border-border/30">
        <div className="container-narrow">
          <AnimatedSection delay={0.15}>
            {/* Mobile: stacked layout */}
            <div className="lg:hidden space-y-8">
              <h2>Workshops and Bootcamps</h2>
              <div className="space-y-6 max-w-2xl">
                <p className="text-muted-foreground">
                  Workshops and bootcamps are used where alignment, shared understanding, and collective decision-making are required.
                </p>
                <p className="text-muted-foreground">
                  These are not training programmes. They are designed to create clarity, surface assumptions, and agree decisive next steps, often during periods of change or transition.
                </p>
                <p className="text-muted-foreground">
                  Delivered through direct engagements and selected partners, including Blackstorm Asia.
                </p>
              </div>
            </div>

            {/* Desktop: two-column layout, compressed */}
            <div className="hidden lg:grid lg:grid-cols-[30%_70%] lg:gap-12">
              <div>
                <h3 className="text-2xl font-medium">Workshops and Bootcamps</h3>
              </div>
              <div className="space-y-4">
                <p className="text-base leading-relaxed text-muted-foreground">
                  Workshops and bootcamps are used where alignment, shared understanding, and collective decision-making are required. These are not training programmes—they are designed to create clarity, surface assumptions, and agree decisive next steps.
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Delivered through direct engagements and selected partners, including Blackstorm Asia.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA - With Container Band */}
      <section className="py-24 md:py-32 lg:bg-[hsl(var(--section-light))]">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <div className="space-y-8 lg:py-8">
              <h2 className="lg:text-4xl">Interested in working together?</h2>
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
