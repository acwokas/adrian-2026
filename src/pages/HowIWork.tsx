import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";

const sections = [
  {
    title: "How I approach problems",
    content: [
      "I start by understanding what decisions actually need to be made. Most organisations are not short of ideas or information. They are short of clarity about what matters and what to do next.",
      "My approach is direct. I ask uncomfortable questions, challenge assumptions, and focus attention on the things that will move the business forward. I do not spend time on work that will not lead to action.",
    ],
  },
  {
    title: "Working with leadership teams",
    content: [
      "I work best with leadership teams that are ready to be honest about where they are and what is not working. My role is to help create the conditions for better decisions, not to tell people what to do.",
      "I bring an outside perspective, but I earn my place by understanding the context deeply and quickly. I do not parachute in with generic frameworks.",
    ],
  },
  {
    title: "Governance and responsibility",
    content: [
      "Good governance is about creating the conditions for good decisions. It is not about process for the sake of process.",
      "I help organisations think clearly about accountability, decision rights, and how to structure conversations that lead to action rather than delay.",
    ],
  },
  {
    title: "Building capability, not dependency",
    content: [
      "My goal is always to leave organisations and individuals more capable than when I arrived. I am not interested in creating long-term dependency.",
      "Whether through mentoring, training, or hands-on work, I aim to transfer thinking and capability so that the people I work with can operate with greater confidence and clarity when I am not in the room.",
    ],
  },
  {
    title: "Staying close to the ecosystem",
    content: [
      "Through AIinASIA and my broader network, I stay connected to founders, operators, and practitioners across the region. This is not academic. It keeps my thinking grounded in what is actually happening, not what consultants say is happening.",
      "This perspective directly informs my advisory work and ensures I am bringing real-world insight, not just theory.",
    ],
  },
];

export default function HowIWork() {
  return (
    <Layout>
      <SEO 
        title="How I Work"
        description="Clarity, directness, and a focus on outcomes. How I approach problems, work with leadership teams, and build capability without dependency."
        canonical="/how-i-work"
      />
      {/* Header */}
      <section className="section-spacing border-b border-border/50">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-6">
              <h1>How I work</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Clarity, directness, and a focus on outcomes over activities.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Sections */}
      {sections.map((section, index) => (
        <section 
          key={section.title}
          className={`py-12 md:py-16 border-b border-border/50 ${index % 2 === 1 ? 'bg-[hsl(var(--section-light))] md:bg-transparent' : ''}`}
        >
          <div className="container-narrow">
            <AnimatedSection delay={index * 0.03}>
              <div className="space-y-6">
                <h2 className="text-2xl">{section.title}</h2>
                <div className="space-y-4">
                  {section.content.map((paragraph, i) => (
                    <p key={i} className="text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      ))}

      {/* Different from Consulting */}
      <section className="section-spacing bg-card border-y border-border/50">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-6">
              <h2>How my work differs from traditional consulting</h2>
              <p className="text-lg text-muted-foreground">
                I do not run large consulting programmes or deliver long decks that sit on shelves. My work focuses on helping leaders make decisions, act on them, and move forward with clarity and accountability.
              </p>
              <p className="text-lg border-l-2 border-accent pl-6 py-2">
                I remain close to execution and am comfortable owning outcomes, not just advising on them.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <div className="space-y-6">
              <h2>Want to understand more?</h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                The best way to understand how I work is to have a conversation.
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">
                  Get in touch
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
