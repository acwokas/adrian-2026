import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection, StaggeredChildren, StaggeredItem } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import adrianPortrait from "@/assets/adrian-portrait.jpg";

const serviceCards = [
  {
    title: "Advisory",
    description: "Strategic guidance on critical decisions, direction, and priorities.",
    anchor: "advisory",
  },
  {
    title: "Fractional Leadership",
    description: "Senior operational leadership without the commitment of a full-time hire.",
    anchor: "fractional",
  },
  {
    title: "Mentoring and Capability Building",
    description: "Developing leaders and teams to think and execute with greater clarity.",
    anchor: "mentoring",
  },
  {
    title: "Workshops and Bootcamps",
    description: "Intensive sessions designed to shift thinking and unlock action.",
    anchor: "workshops",
  },
];

const broughtInFor = [
  { bold: "AI initiatives stalled", rest: "after pilots" },
  { bold: "Leadership pressure", rest: "without clarity" },
  { bold: "Misalignment between", rest: "strategy and execution" },
  { bold: "Products or platforms", rest: "lacking commercial grounding" },
  { bold: "Teams drifting", rest: "without direction" },
];

export default function Home() {
  return (
    <Layout>
      <SEO canonical="/" />
      {/* Hero Section */}
      <section className="pt-24 md:pt-28 pb-20 md:pb-28">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div 
              className="space-y-6 md:space-y-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <h1>
                I help organisations and leaders make better decisions in complex environments.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl pb-2">
                Senior commercial and operational leadership across advisory, fractional roles, mentoring, and capability building.
              </p>
              <div className="flex flex-col items-start gap-4 pt-2">
                <Button variant="hero" size="lg" className="w-full sm:w-auto" asChild>
                  <Link to="/contact">
                    Book a 30-minute clarity call
                  </Link>
                </Button>
                <Link 
                  to="/how-i-work"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  View how I work
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>

            <motion.div 
              className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={adrianPortrait}
                  alt="Adrian Watkins"
                  className="w-full h-full object-cover grayscale"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* When I'm Brought In */}
      <section className="section-spacing border-t border-border/50 bg-[hsl(var(--section-light))] md:bg-transparent">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-10">
              <h2>When I am usually brought in</h2>
              
              <StaggeredChildren>
                <ul className="space-y-5 md:space-y-6">
                  {broughtInFor.map((item) => (
                    <StaggeredItem key={item.bold}>
                      <li className="text-lg text-muted-foreground pl-6 relative before:absolute before:left-0 before:top-[0.6em] before:w-2 before:h-px before:bg-accent">
                        <span className="font-medium text-foreground">{item.bold}</span> {item.rest}
                      </li>
                    </StaggeredItem>
                  ))}
                </ul>
              </StaggeredChildren>

              <div className="pt-6 mt-8 border-t border-accent/40">
                <p className="text-xl md:text-2xl leading-relaxed text-foreground">
                  I am often brought in to challenge assumptions, stop unproductive work, and refocus teams on what will actually move the business forward.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* How I Help */}
      <section className="section-spacing border-t border-border/50 bg-[hsl(var(--section-light))] md:bg-transparent">
        <div className="container-wide">
          <AnimatedSection>
            <div className="space-y-12">
              <h2>How I help</h2>
              
              <StaggeredChildren className="grid md:grid-cols-2 gap-6">
                {serviceCards.map((card) => (
                  <StaggeredItem key={card.title}>
                    <Link
                      to={`/what-i-do#${card.anchor}`}
                      className="group block p-8 bg-card border border-border/50 hover:border-accent/50 transition-all duration-300 h-full"
                    >
                      <h3 className="mb-3 group-hover:text-accent transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {card.description}
                      </p>
                    </Link>
                  </StaggeredItem>
                ))}
              </StaggeredChildren>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Shaping the Conversation */}
      <section className="section-spacing border-t border-border/50 bg-[hsl(var(--section-light))] md:bg-transparent">
        <div className="container-narrow">
          <div className="space-y-12">
            <AnimatedSection>
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
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
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
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing border-t border-border/50">
        <div className="container-narrow text-center">
          <AnimatedSection>
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
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
