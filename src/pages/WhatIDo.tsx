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

      {/* Advisory Sprints */}
      <section id="advisory" className="py-16 md:py-24 scroll-mt-24">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-8">
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
          </AnimatedSection>
        </div>
      </section>

      {/* Fractional Leadership */}
      <section id="fractional" className="py-16 md:py-24 scroll-mt-24">
        <div className="container-narrow">
          <AnimatedSection delay={0.05}>
            <div className="space-y-8">
              <h2>Fractional Leadership</h2>
              
              <div className="space-y-6 max-w-2xl">
                <p className="text-muted-foreground">
                  In fractional roles, I work directly with the CEO or executive team. I operate as a senior peer, not a consultant, with responsibility for shaping direction, aligning teams, and supporting execution across strategy, operations, and governance.
                </p>
                <ul className="space-y-2 text-muted-foreground pl-4">
                  <li>Strategic and operational alignment at executive level</li>
                  <li>Commercial and operating model decisions</li>
                  <li>Governance and execution during periods of change</li>
                </ul>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Mentoring and Capability Building */}
      <section id="mentoring" className="py-16 md:py-24 scroll-mt-24">
        <div className="container-narrow">
          <AnimatedSection delay={0.1}>
            <div className="space-y-8">
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
          </AnimatedSection>
        </div>
      </section>

      {/* Workshops and Bootcamps */}
      <section id="workshops" className="py-16 md:py-24 scroll-mt-24">
        <div className="container-narrow">
          <AnimatedSection delay={0.15}>
            <div className="space-y-8">
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
