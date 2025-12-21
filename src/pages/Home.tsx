import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import adrianPortrait from "@/assets/adrian-portrait.jpg";

const serviceCards = [
  {
    title: "Advisory",
    description: "Strategic guidance on critical decisions, direction, and priorities.",
  },
  {
    title: "Fractional Leadership",
    description: "Senior operational leadership without the commitment of a full-time hire.",
  },
  {
    title: "Mentoring and Capability Building",
    description: "Developing leaders and teams to think and execute with greater clarity.",
  },
  {
    title: "Workshops and Bootcamps",
    description: "Intensive sessions designed to shift thinking and unlock action.",
  },
];

const broughtInFor = [
  "AI initiatives stalled after pilots",
  "Leadership pressure without clarity",
  "Misalignment between strategy and execution",
  "Products or platforms lacking commercial grounding",
  "Teams drifting without direction",
];

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-spacing">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <h1 className="text-balance">
                I help organisations and leaders make better decisions in complex environments.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Senior commercial and operational leadership across advisory, fractional roles, mentoring, and capability building.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/contact">
                    Book a 30-minute clarity call
                  </Link>
                </Button>
                <Button variant="heroOutline" size="lg" asChild>
                  <Link to="/how-i-work">
                    View how I work
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative animate-fade-in animate-delay-200">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={adrianPortrait}
                  alt="Adrian Watkins"
                  className="w-full h-full object-cover grayscale"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* When I'm Brought In */}
      <section className="section-spacing border-t border-border/50">
        <div className="container-narrow">
          <div className="space-y-10">
            <h2>When I am usually brought in</h2>
            
            <ul className="space-y-4">
              {broughtInFor.map((item) => (
                <li 
                  key={item} 
                  className="text-lg text-muted-foreground pl-6 relative before:absolute before:left-0 before:top-[0.6em] before:w-2 before:h-px before:bg-accent"
                >
                  {item}
                </li>
              ))}
            </ul>

            <p className="text-lg border-l-2 border-accent pl-6 py-2">
              I am often brought in to challenge assumptions, stop unproductive work, and refocus teams on what will actually move the business forward.
            </p>
          </div>
        </div>
      </section>

      {/* How I Help */}
      <section className="section-spacing border-t border-border/50">
        <div className="container-wide">
          <div className="space-y-12">
            <h2>How I help</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {serviceCards.map((card) => (
                <Link
                  key={card.title}
                  to="/what-i-do"
                  className="group p-8 bg-card border border-border/50 hover:border-accent/50 transition-all duration-300"
                >
                  <h3 className="mb-3 group-hover:text-accent transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {card.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Shaping the Conversation */}
      <section className="section-spacing border-t border-border/50">
        <div className="container-narrow">
          <div className="space-y-12">
            <div className="space-y-6">
              <h2>Shaping the conversation</h2>
              <p className="text-lg text-muted-foreground">
                Alongside my advisory and leadership work, I am the founder of AIinASIA.com, a platform focused on practical insight and responsible use of emerging technology. It also provides a constant feedback loop from founders, operators, and practitioners across the region, which directly informs my advisory work.
              </p>
              <a
                href="https://aiinasia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent hover:underline underline-offset-4"
              >
                Visit AIinASIA
                <ArrowUpRight size={16} />
              </a>
            </div>

            <div className="space-y-6 pt-8 border-t border-border/30">
              <h2>A broader mission</h2>
              <p className="text-lg text-muted-foreground">
                I am building you.withthepowerof.ai, an ecosystem focused on democratising access to capability, tools, and thinking that are often locked behind large organisations.
              </p>
              <a
                href="https://you.withthepowerof.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent hover:underline underline-offset-4"
              >
                Explore the ecosystem
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing border-t border-border/50">
        <div className="container-narrow text-center">
          <div className="space-y-6">
            <h2>Ready to have a conversation?</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              I am selective about what I take on, but always happy to have a first conversation.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">
                Get in touch
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
