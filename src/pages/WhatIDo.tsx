import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";

const services = [
  {
    id: "advisory",
    title: "Advisory Sprints",
    description: "Intensive engagements focused on specific decisions, challenges, or opportunities.",
    whoFor: "CEOs, founders, and senior leadership teams facing complex strategic or operational decisions.",
    whereOperate: "I work directly with decision-makers, typically at board or executive level, to cut through complexity and identify what needs to happen next.",
    outcomes: "Clear direction, validated priorities, and actionable next steps that the team can execute with confidence.",
  },
  {
    id: "fractional",
    title: "Fractional Leadership",
    description: "Senior operational leadership without the commitment of a full-time hire.",
    whoFor: "Organisations that need experienced commercial or operational leadership but are not ready for, or do not need, a permanent senior hire.",
    whereOperate: "I operate as part of the leadership team, owning outcomes and driving execution across strategy, operations, and commercial performance.",
    outcomes: "Improved focus, stronger execution, and measurable progress on critical initiatives.",
  },
  {
    id: "mentoring",
    title: "Mentoring and Capability Building",
    description: "Developing leaders and teams to think and execute with greater clarity.",
    whoFor: "Senior leaders stepping into larger roles, emerging executives, and teams that need to raise their game.",
    whereOperate: "I work one-on-one or with small groups, focusing on the thinking, habits, and decision-making that underpin effective leadership.",
    outcomes: "Leaders who can navigate complexity, make better decisions, and drive results with less dependence on external support.",
  },
  {
    id: "workshops",
    title: "Workshops and Bootcamps",
    description: "Intensive sessions designed to shift thinking and unlock action.",
    whoFor: "Leadership teams, product teams, or organisations that need to align around a challenge and move forward quickly.",
    whereOperate: "I design and facilitate sessions tailored to the specific context, drawing on frameworks and approaches refined over years of operating experience.",
    outcomes: "Shared understanding, clear priorities, and a roadmap for action that the team owns.",
  },
];

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
                My work focuses on helping organisations and leaders achieve clarity, execution, and accountability. I engage through several models, each designed to meet different needs.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Services */}
      {services.map((service, index) => (
        <section 
          key={service.id}
          id={service.id}
          className="section-spacing border-b border-border/50 scroll-mt-24"
        >
          <div className="container-narrow">
            <AnimatedSection delay={index * 0.05}>
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2>{service.title}</h2>
                  <p className="text-lg text-muted-foreground">
                    {service.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 pt-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-accent uppercase tracking-wider">
                      Who it is for
                    </h4>
                    <p className="text-muted-foreground">
                      {service.whoFor}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-accent uppercase tracking-wider">
                      Where I operate
                    </h4>
                    <p className="text-muted-foreground">
                      {service.whereOperate}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-accent uppercase tracking-wider">
                      Decisions and outcomes
                    </h4>
                    <p className="text-muted-foreground">
                      {service.outcomes}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="section-spacing">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <div className="space-y-6">
              <h2>Interested in working together?</h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                The right engagement model depends on your context. Let us discuss what would be most useful.
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">
                  Start a conversation
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
