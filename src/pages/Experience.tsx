import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection, StaggeredChildren, StaggeredItem } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";

const experienceCategories = [
  {
    title: "Commercial and operational leadership",
    description: "Senior roles with direct accountability for commercial performance, operational execution, and team leadership across complex organisations.",
    items: [
      {
        role: "Led commercial strategy and execution for technology and media businesses across Asia Pacific, with responsibility for revenue, partnerships, and market expansion.",
      },
      {
        role: "Drove operational transformation programmes, including restructuring teams, redefining go-to-market approaches, and improving commercial outcomes.",
      },
      {
        role: "Managed P&L responsibility across multiple business units, balancing growth investment with operational discipline.",
      },
    ],
  },
  {
    title: "Advisory and fractional roles",
    description: "Strategic and operational guidance for leadership teams navigating complexity, change, and critical decisions.",
    items: [
      {
        role: "Advised CEOs and boards on strategic direction, organisational design, and commercial priorities across technology, media, and professional services.",
      },
      {
        role: "Served as fractional COO and commercial lead for growth-stage companies, bringing senior operational capability without full-time commitment.",
      },
      {
        role: "Provided guidance on AI strategy and implementation, helping organisations move beyond pilots to operational value.",
      },
    ],
  },
  {
    title: "Platforms and ecosystems",
    description: "Building and scaling platforms that connect people, ideas, and opportunities.",
    items: [
      {
        role: "Founded and continue to lead AIinASIA.com, a platform focused on practical insight and responsible use of emerging technology across the region.",
      },
      {
        role: "Building you.withthepowerof.ai, an ecosystem focused on democratising access to capability and tools often locked behind large organisations.",
      },
      {
        role: "Developed and scaled community and content platforms, building engaged audiences and sustainable business models.",
      },
    ],
  },
  {
    title: "Founders, startups, and scale-ups",
    description: "Working alongside founders at critical moments, from early-stage shaping to scale-up challenges.",
    items: [
      {
        role: "Mentored and advised founders across technology, media, and professional services, focusing on commercial strategy, operational discipline, and leadership development.",
      },
      {
        role: "Supported startups and scale-ups in navigating growth challenges, fundraising preparation, and market expansion.",
      },
      {
        role: "Engaged with accelerators and investor networks to support portfolio companies and contribute to the broader startup ecosystem.",
      },
    ],
  },
];

export default function Experience() {
  return (
    <Layout>
      <SEO 
        title="Experience"
        description="Commercial and operational leadership, advisory, platform building, and ecosystem development across Asia Pacific and beyond."
        canonical="/experience"
      />
      {/* Header */}
      <section className="section-spacing border-b border-border/50">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-6">
              <h1>Experience</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                My experience spans commercial and operational leadership, advisory, platform building, and ecosystem development. Here is how it groups by responsibility and scope.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Experience Categories */}
      {experienceCategories.map((category, index) => (
        <section 
          key={category.title}
          className={`section-spacing border-b border-border/50 ${index % 2 === 1 ? 'bg-[hsl(var(--section-light))] md:bg-transparent' : ''}`}
        >
          <div className="container-narrow">
            <AnimatedSection delay={index * 0.05}>
              <div className="space-y-8">
                <div className="space-y-3">
                  <h2>{category.title}</h2>
                  <p className="text-lg text-muted-foreground">
                    {category.description}
                  </p>
                </div>

                <StaggeredChildren className="space-y-6 pt-4">
                  {category.items.map((item, i) => (
                    <StaggeredItem key={i}>
                      <div className="pl-6 border-l border-border/50 hover:border-accent/50 transition-colors">
                        <p className="text-muted-foreground">
                          {item.role}
                        </p>
                      </div>
                    </StaggeredItem>
                  ))}
                </StaggeredChildren>
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
              <h2>Want the full picture?</h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                View my complete resume or get in touch to discuss how my experience might be relevant to your context.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/resume">
                    View resume
                    <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button variant="heroOutline" size="lg" asChild>
                  <Link to="/contact">
                    Get in touch
                  </Link>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
