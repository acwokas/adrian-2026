import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
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
      
      {/* Hero Section - Desktop: Three column layout */}
      <section className="pt-24 md:pt-28 lg:pt-12 pb-16 md:pb-20 lg:pb-10 lg:min-h-[70vh] lg:max-h-[70vh] lg:flex lg:items-center">
        <div className="container-wide max-w-[1200px] mx-auto w-full">
          
          {/* Mobile/Tablet: Original stacked layout */}
          <div className="lg:hidden">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl">
                  I help organisations and leaders make better decisions in complex environments.
                </h1>
                <p className="text-base md:text-lg text-muted-foreground">
                  Advisory, fractional leadership, mentoring, and capability building.
                </p>
              </div>
              
              <div className="pt-2">
                <Button variant="hero" size="lg" className="w-full sm:w-auto" asChild>
                  <Link to="/contact">
                    Book a 30-minute clarity call
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div 
              className="mt-10 mx-auto w-full max-w-sm sm:max-w-md"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <div className="aspect-[4/5] overflow-hidden rounded-2xl">
                <img
                  src={adrianPortrait}
                  alt="Adrian Watkins"
                  className="w-full h-full object-cover object-[center_15%] grayscale"
                />
              </div>
            </motion.div>
          </div>

          {/* Desktop: Three column grid */}
          <div className="hidden lg:grid lg:grid-cols-[42%_28%_30%] lg:gap-6 lg:items-center">
            
            {/* Column 1: Headline, sub-line, CTA */}
            <motion.div 
              className="space-y-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <h1 className="text-[2.25rem] leading-[1.15]">
                I help organisations and leaders make better decisions in complex environments.
              </h1>
              <p className="text-base text-muted-foreground">
                Advisory, fractional leadership, mentoring, and capability building.
              </p>
              <div className="pt-3">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/contact">
                    Book a 30-minute clarity call
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Column 2: When I am usually brought in */}
            <motion.div 
              className="border-l border-border/30 pl-8 pr-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <p className="text-sm uppercase tracking-wider text-foreground/80 font-medium mb-4">
                When I am usually brought in
              </p>
              <ul className="space-y-2.5 mb-5">
                {broughtInFor.map((item) => (
                  <li 
                    key={item.bold}
                    className="text-[0.9375rem] leading-snug text-muted-foreground pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent"
                  >
                    <span className="font-semibold text-foreground">{item.bold}</span> {item.rest}
                  </li>
                ))}
              </ul>
              <p className="text-[0.9375rem] text-foreground font-medium leading-snug">
                I challenge assumptions and refocus teams on what matters.
              </p>
            </motion.div>

            {/* Column 3: Portrait */}
            <motion.div 
              className="flex items-center justify-center h-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <div className="w-full max-w-[260px] aspect-[3/4] overflow-hidden rounded-2xl">
                <img
                  src={adrianPortrait}
                  alt="Adrian Watkins"
                  className="w-full h-full object-cover object-[center_15%] grayscale"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* When I'm Brought In - Mobile only */}
      <section className="lg:hidden py-16 md:py-20 border-t border-border/50 bg-[hsl(var(--section-light))] md:bg-transparent">
        <div className="container-wide px-6 md:px-8">
          <AnimatedSection>
            <div className="space-y-8">
              <h2 className="text-foreground">When I am usually brought in</h2>
              
              <StaggeredChildren>
                <ul className="space-y-5 md:space-y-6">
                  {broughtInFor.map((item) => (
                    <StaggeredItem key={item.bold}>
                      <li className="text-lg text-muted-foreground pl-6 relative before:absolute before:left-0 before:top-[0.6em] before:w-2 before:h-px before:bg-accent">
                        <span className="font-semibold text-foreground">{item.bold}</span> {item.rest}
                      </li>
                    </StaggeredItem>
                  ))}
                </ul>
              </StaggeredChildren>

              <div className="pt-10 mt-8 border-t border-accent/20">
                <p className="text-xl md:text-2xl leading-snug text-foreground font-semibold max-w-3xl">
                  I am often brought in to challenge assumptions, stop unproductive work, and refocus teams on what will actually move the business forward.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* How I Help - 2x2 grid on desktop */}
      <section className="py-16 md:py-20 lg:py-24 border-t border-border/50 bg-[hsl(var(--section-light))] md:bg-transparent">
        <div className="container-wide max-w-[1100px] mx-auto">
          <AnimatedSection>
            <div className="space-y-8 lg:space-y-10">
              <div className="space-y-3 mb-6 lg:mb-10">
                <h2>How I help</h2>
                <p className="text-lg md:text-xl lg:text-2xl text-foreground font-semibold max-w-2xl">
                  Engagement models I am typically brought in under.
                </p>
              </div>
              <StaggeredChildren className="grid md:grid-cols-2 gap-5 lg:gap-8">
                {serviceCards.map((card) => (
                  <StaggeredItem key={card.title}>
                    <Link
                      to={`/what-i-do#${card.anchor}`}
                      className="group block p-6 md:p-8 lg:p-10 bg-card border border-border/30 hover:border-accent/40 transition-all duration-300 h-full"
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

      {/* Signals of Depth - Combined ecosystem section */}
      <section className="py-16 md:py-20 lg:py-24 border-t border-border/50 bg-[hsl(var(--section-light))] md:bg-transparent">
        <div className="container-wide max-w-[1000px] mx-auto">
          <AnimatedSection>
            <div className="space-y-10 lg:space-y-12">
              <h2>Signals of depth</h2>
              
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {/* AIinASIA Block */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">AIinASIA</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    A platform for practical insight on emerging technology across Asia.
                  </p>
                  <a
                    href="https://aiinasia.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Visit AIinASIA
                    <ArrowUpRight size={14} />
                  </a>
                </div>

                {/* you.withthepowerof.ai Block */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">you.withthepowerof.ai</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    An ecosystem democratising access to capability often locked behind large organisations.
                  </p>
                  <a
                    href="https://you.withthepowerof.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Explore the ecosystem
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Final CTA Section - Enhanced presence */}
      <section className="py-20 md:py-24 lg:py-28 border-t border-border/50">
        <div className="container-wide max-w-[800px] mx-auto text-center">
          <AnimatedSection>
            <div className="space-y-6 lg:space-y-8">
              <h2 className="text-2xl md:text-3xl lg:text-4xl">Ready to have a conversation?</h2>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto">
                I am selective about what I take on, but always happy to have a first conversation.
              </p>
              <div className="pt-2 lg:pt-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/contact">
                    Book a 30-minute clarity call
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
