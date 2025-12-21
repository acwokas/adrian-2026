import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection, StaggeredChildren, StaggeredItem } from "@/components/AnimatedSection";

const capabilities = [
  {
    title: "Commercial leadership",
    description: "Leading revenue strategy, partnership development, and market expansion with direct accountability for commercial performance.",
  },
  {
    title: "Operational excellence",
    description: "Driving operational transformation, process improvement, and execution discipline across complex organisations.",
  },
  {
    title: "Strategic advisory",
    description: "Providing guidance to CEOs and boards on direction, priorities, and critical decisions.",
  },
  {
    title: "Leadership development",
    description: "Building capability in individuals and teams, with a focus on decision-making, accountability, and execution.",
  },
  {
    title: "Governance and accountability",
    description: "Designing decision structures and accountability frameworks that enable action rather than delay.",
  },
  {
    title: "Emerging technology",
    description: "Helping organisations navigate AI and emerging technology with commercial grounding and practical application.",
  },
];

const highlights = [
  { emphasis: "Leading commercial strategy", text: "for technology and media businesses across Asia Pacific, responsible for revenue growth, strategic partnerships, and market expansion." },
  { emphasis: "Driving operational transformation", text: "programmes including team restructuring, go-to-market redesign, and performance improvement initiatives." },
  { emphasis: "Advising CEOs and boards", text: "on strategic direction, organisational design, and commercial priorities across multiple sectors." },
  { emphasis: "Founding and leading AIinASIA.com", text: ", a platform focused on practical insight and responsible use of emerging technology." },
  { emphasis: "Building you.withthepowerof.ai", text: ", an ecosystem democratising access to capability and tools often locked behind large organisations." },
  { emphasis: "Mentoring senior leaders and founders", text: "through critical transitions and growth challenges." },
];

export default function Resume() {
  return (
    <Layout>
      {/* Header */}
      <section className="section-spacing border-b border-border/50">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-6">
              <h1>Resume</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                A summary of my professional background, capabilities, and the scope of work I have led.
              </p>
              <p className="text-lg border-l-2 border-accent pl-6 py-2">
                My work is measured by improved focus, stronger execution, and better commercial outcomes.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Profile */}
      <section className="py-12 md:py-16 border-b border-border/50">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-6">
              <h2 className="text-2xl">Profile</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Senior Commercial and Operational Leader with extensive experience across technology, media, and professional services. I work with organisations and leadership teams to drive clarity, improve execution, and deliver commercial outcomes in complex environments.
                </p>
                <p>
                  My career has spanned commercial leadership, operational transformation, advisory, and ecosystem building. I have led teams, managed P&L responsibility, and operated at board level across multiple sectors and geographies.
                </p>
                <p>
                  I am known for asking the right questions, challenging assumptions, and focusing attention on what will actually move the business forward. I remain close to execution and am comfortable owning outcomes, not just advising on them.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-12 md:py-16 border-b border-border/50">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-8">
              <h2 className="text-2xl">Core capabilities</h2>
              <StaggeredChildren className="grid md:grid-cols-2 gap-8">
                {capabilities.map((cap) => (
                  <StaggeredItem key={cap.title}>
                    <div className="space-y-3">
                      <h4 className="font-medium">{cap.title}</h4>
                      <p className="text-muted-foreground text-sm">
                        {cap.description}
                      </p>
                    </div>
                  </StaggeredItem>
                ))}
              </StaggeredChildren>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Career Highlights */}
      <section className="py-12 md:py-16 border-b border-border/50">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-8">
              <h2 className="text-2xl">Career highlights</h2>
              <StaggeredChildren className="space-y-6">
                {highlights.map((item, i) => (
                  <StaggeredItem key={i}>
                    <div className="space-y-3">
                      <p className="text-muted-foreground">
                        <span className="text-foreground font-medium">{item.emphasis}</span>{item.text}
                      </p>
                    </div>
                  </StaggeredItem>
                ))}
              </StaggeredChildren>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Education and Credentials */}
      <section className="py-12 md:py-16 border-b border-border/50">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-6">
              <h2 className="text-2xl">Background</h2>
              <p className="text-muted-foreground">
                My background spans over two decades across multiple geographies, with particular depth in Asia Pacific markets. I combine strategic perspective with operational pragmatism, having operated at senior levels in both large organisations and high-growth environments.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Download CTA */}
      <section className="section-spacing">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <div className="space-y-6">
              <h2>Full CV</h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                For a complete overview of my career history and credentials, download my full CV.
              </p>
              <Button variant="hero" size="lg" asChild>
                <a href="#" onClick={(e) => { e.preventDefault(); alert('CV download would be configured here'); }}>
                  <Download size={16} />
                  Download full CV (PDF)
                </a>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
