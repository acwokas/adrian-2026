import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

export default function Resume() {
  return (
    <Layout>
      {/* Header */}
      <section className="section-spacing border-b border-border/50">
        <div className="container-narrow">
          <div className="space-y-6 animate-fade-in-up">
            <h1>Resume</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              A summary of my professional background, capabilities, and the scope of work I have led.
            </p>
            <p className="text-lg border-l-2 border-accent pl-6 py-2">
              My work is measured by improved focus, stronger execution, and better commercial outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* Profile */}
      <section className="py-12 md:py-16 border-b border-border/50">
        <div className="container-narrow">
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
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-12 md:py-16 border-b border-border/50">
        <div className="container-narrow">
          <div className="space-y-8">
            <h2 className="text-2xl">Core capabilities</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="font-medium">Commercial leadership</h4>
                <p className="text-muted-foreground text-sm">
                  Leading revenue strategy, partnership development, and market expansion with direct accountability for commercial performance.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Operational excellence</h4>
                <p className="text-muted-foreground text-sm">
                  Driving operational transformation, process improvement, and execution discipline across complex organisations.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Strategic advisory</h4>
                <p className="text-muted-foreground text-sm">
                  Providing guidance to CEOs and boards on direction, priorities, and critical decisions.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Leadership development</h4>
                <p className="text-muted-foreground text-sm">
                  Building capability in individuals and teams, with a focus on decision-making, accountability, and execution.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Governance and accountability</h4>
                <p className="text-muted-foreground text-sm">
                  Designing decision structures and accountability frameworks that enable action rather than delay.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Emerging technology</h4>
                <p className="text-muted-foreground text-sm">
                  Helping organisations navigate AI and emerging technology with commercial grounding and practical application.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Highlights */}
      <section className="py-12 md:py-16 border-b border-border/50">
        <div className="container-narrow">
          <div className="space-y-8">
            <h2 className="text-2xl">Career highlights</h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">Leading commercial strategy</span> for technology and media businesses across Asia Pacific, responsible for revenue growth, strategic partnerships, and market expansion.
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">Driving operational transformation</span> programmes including team restructuring, go-to-market redesign, and performance improvement initiatives.
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">Advising CEOs and boards</span> on strategic direction, organisational design, and commercial priorities across multiple sectors.
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">Founding and leading AIinASIA.com</span>, a platform focused on practical insight and responsible use of emerging technology.
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">Building you.withthepowerof.ai</span>, an ecosystem democratising access to capability and tools often locked behind large organisations.
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">Mentoring senior leaders and founders</span> through critical transitions and growth challenges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education and Credentials */}
      <section className="py-12 md:py-16 border-b border-border/50">
        <div className="container-narrow">
          <div className="space-y-6">
            <h2 className="text-2xl">Background</h2>
            <p className="text-muted-foreground">
              My background spans over two decades across multiple geographies, with particular depth in Asia Pacific markets. I combine strategic perspective with operational pragmatism, having operated at senior levels in both large organisations and high-growth environments.
            </p>
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section className="section-spacing">
        <div className="container-narrow text-center">
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
        </div>
      </section>
    </Layout>
  );
}
