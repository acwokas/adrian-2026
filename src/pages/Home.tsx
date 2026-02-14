import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection, StaggeredChildren, StaggeredItem } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import { trackEvent, useAnalytics } from "@/hooks/useAnalytics";
import { BlurImage } from "@/components/BlurImage";
import adrianPortrait from "@/assets/adrian-portrait-optimized.webp";

const serviceCards = [
  {
    title: "EDGE Diagnostic",
    description: "Strategic assessment of intelligence readiness, fragmentation, and opportunity. Typically a 2-4 week engagement resulting in clear recommendations and roadmap.",
    link: "/edge-framework",
  },
  {
    title: "Fractional Leadership",
    description: "Senior operational leadership without the commitment of a full-time hire. I work directly with CEOs and executive teams as a senior peer.",
    link: "/experience",
  },
  {
    title: "Advisory & Board Support",
    description: "Strategic guidance on critical decisions, direction, and priorities. Board-level engagement focused on commercial outcomes and governance.",
    link: "/experience",
  },
  {
    title: "Workshops & Capability Building",
    description: "Intensive sessions designed to shift thinking and unlock action. Delivered to leadership teams, boards, and portfolio companies.",
    link: "/speaking",
  },
];

const broughtInFor = [
  { bold: "AI initiatives stalled", rest: "after pilots" },
  { bold: "Leadership pressure", rest: "without clarity" },
  { bold: "Misalignment between", rest: "strategy and execution" },
  { bold: "Products or platforms", rest: "lacking commercial positioning" },
  { bold: "Teams drifting", rest: "without direction" },
];

export default function Home() {
  const { trackBookingClick } = useAnalytics();
  
  const handleCTAClick = (location: string) => {
    trackBookingClick(location);
  };

  const handleServiceCardClick = (service: string) => {
    trackEvent({ 
      eventType: 'click', 
      eventName: 'Service Card Click', 
      eventData: { service } 
    });
  };

  const handleExternalLinkClick = (name: string, url: string) => {
    trackEvent({ 
      eventType: 'external_link', 
      eventName: name, 
      eventData: { url } 
    });
  };

  return (
    <Layout>
      <SEO 
        canonical="/" 
        description="Adrian Watkins works with CEOs, founders, and boards on decision-making, alignment, and execution in complex environments. Executive advisory, fractional leadership, and capability building across Asia Pacific."
        keywords="executive advisor Singapore, fractional COO, fractional CCO, board advisor, executive decision support, operational leadership, AI advisory, Asia Pacific executive coach"
      />
      
      {/* Hero Section - Desktop: Three column layout */}
      <section className="pt-10 md:pt-11 lg:pt-5 pb-16 md:pb-20 lg:pb-10 lg:min-h-[70vh] lg:max-h-[70vh] lg:flex lg:items-center">
        <div className="container-wide max-w-[1200px] mx-auto w-full">
          
          {/* Mobile/Tablet: Original stacked layout */}
          <div className="lg:hidden">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl">
                  Adrian Watkins
                </h1>
                <p className="text-base md:text-lg text-muted-foreground">
                  Creator, EDGE Framework for Applied Intelligence
                </p>
                <p className="text-base md:text-lg text-muted-foreground">
                  SVP Commercial Operations &amp; Governance, SQREEM Technologies
                </p>
              </div>
              <p className="text-base md:text-lg text-muted-foreground">
                I work with CEOs, founders, and leadership teams to transform AI adoption from scattered experiments into structured capability.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full sm:w-auto" 
                  asChild
                >
                  <Link to="/edge-framework">
                    Explore EDGE Framework
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto" 
                  asChild
                  onClick={() => handleCTAClick('hero-mobile')}
                >
                  <a href="https://calendly.com/adrian-watkins1/new-meeting" target="_blank" rel="noopener noreferrer">
                    Book a 30-minute call
                  </a>
                </Button>
              </div>
            </motion.div>

            <motion.div 
              className="mt-10 mx-auto w-full max-w-sm sm:max-w-md"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-border/30 shadow-lg shadow-black/10">
                <BlurImage
                  src={adrianPortrait}
                  alt="Adrian Watkins"
                  priority
                  className="object-cover object-[center_15%] grayscale"
                />
              </div>
            </motion.div>
          </div>

          {/* Desktop: Three column grid */}
          <div className="hidden lg:grid lg:grid-cols-[40%_32%_28%] lg:gap-8 lg:items-center">
            
            {/* Column 1: Headline, sub-line, CTA */}
            <motion.div 
              className="space-y-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <div className="space-y-3">
                <h1 className="text-[2.25rem] leading-[1.15]">
                  Adrian Watkins
                </h1>
                <p className="text-base text-muted-foreground">
                  Creator, EDGE Framework for Applied Intelligence
                </p>
                <p className="text-base text-muted-foreground">
                  SVP Commercial Operations &amp; Governance, SQREEM Technologies
                </p>
              </div>
              <p className="text-base text-muted-foreground">
                I work with CEOs, founders, and leadership teams to transform AI adoption from scattered experiments into structured capability.
              </p>
              <div className="flex flex-col gap-3 pt-3">
                <Button 
                  variant="hero" 
                  size="lg" 
                  asChild
                >
                  <Link to="/edge-framework">
                    Explore EDGE Framework
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  asChild
                  onClick={() => handleCTAClick('hero-desktop')}
                >
                  <a href="https://calendly.com/adrian-watkins1/new-meeting" target="_blank" rel="noopener noreferrer">
                    Book a 30-minute call
                  </a>
                </Button>
              </div>
            </motion.div>

            {/* Column 2: When I am usually brought in */}
            <motion.div 
              className="border-l border-border/30 pl-10 pr-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <p className="text-[0.8125rem] uppercase tracking-wider text-foreground/90 font-medium mb-5">
                When I am usually brought in
              </p>
              <ul className="space-y-3 mb-6">
                {broughtInFor.map((item) => (
                  <li 
                    key={item.bold}
                    className="text-[1.0625rem] leading-relaxed text-muted-foreground pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-accent"
                  >
                    <span className="font-semibold text-foreground">{item.bold}</span> {item.rest}
                  </li>
                ))}
              </ul>
              <p className="text-[1.0625rem] text-foreground font-medium leading-relaxed">
                I challenge assumptions and refocus teams on what matters.
              </p>
            </motion.div>

            {/* Column 3: Portrait */}
            <motion.div 
              className="flex items-center justify-center h-full pl-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <div className="w-full max-w-[260px] aspect-[3/4] overflow-hidden rounded-xl border border-border/20 shadow-md shadow-black/5">
                <BlurImage
                  src={adrianPortrait}
                  alt="Adrian Watkins"
                  priority
                  className="object-cover object-[center_15%] grayscale contrast-[0.95]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* When I'm Brought In - Mobile only */}
      <section className="lg:hidden py-6 md:py-5 border-t border-border/50 bg-[hsl(var(--section-light))] md:bg-transparent">
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
                  I challenge assumptions and refocus teams on what matters.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* How I Help - 2x2 grid on desktop */}
      <section className="py-6 md:py-5 lg:py-7 border-t border-border/50 bg-[hsl(var(--section-light))] md:bg-transparent">
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
                      to={card.link}
                      onClick={() => handleServiceCardClick(card.title)}
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

      {/* System-level exposure - Combined ecosystem section */}
      <section className="py-6 md:py-5 lg:py-7 border-t border-border/50 bg-[hsl(var(--section-light))] md:bg-transparent">
        <div className="container-wide max-w-[1000px] mx-auto">
          <AnimatedSection>
            <div className="space-y-10 lg:space-y-12">
              <div className="space-y-4">
                <h2>System-level exposure</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These initiatives exist because perspective and decision quality are built over time, across multiple contexts, not inside a single organisation.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {/* AIinASIA.com Block */}
                <div className="space-y-4">
                  <a
                    href="https://aiinasia.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleExternalLinkClick('AIinASIA.com', 'https://aiinasia.com')}
                    className="block"
                  >
                    <h3 className="text-xl font-semibold hover:text-accent transition-colors">AIinASIA.com</h3>
                  </a>
                  <div className="space-y-3">
                    <p className="text-muted-foreground leading-relaxed">
                      A platform focused on practical insight into emerging technology across Asia, grounded in real-world application rather than theory.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      It provides a continuous feedback loop from founders, operators, and policymakers, informing my perspective on how organisations actually adopt and govern new capability.
                    </p>
                  </div>
                  <a
                    href="https://aiinasia.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleExternalLinkClick('AIinASIA.com', 'https://aiinasia.com')}
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Visit AIinASIA.com
                    <ArrowUpRight size={14} />
                  </a>
                </div>

                <div className="space-y-4">
                  <a
                    href="https://you.withthepowerof.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleExternalLinkClick('you.withthepowerof.ai', 'https://you.withthepowerof.ai')}
                    className="block"
                  >
                    <h3 className="text-xl font-semibold hover:text-accent transition-colors">you.withthepowerof.ai</h3>
                  </a>
                  <div className="space-y-3">
                    <p className="text-muted-foreground leading-relaxed">
                      An ecosystem designed to democratise access to capability often locked behind large organisations or underutilised due to a lack of knowledge.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      It reflects a long-term interest in how tools, knowledge, and systems shape decision quality, organisational behaviour, and execution at scale, especially by embracing AI.
                    </p>
                  </div>
                  <a
                    href="https://you.withthepowerof.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleExternalLinkClick('you.withthepowerof.ai', 'https://you.withthepowerof.ai')}
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Explore the ecosystem
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed pt-4">
                These initiatives inform my thinking. They are not consulting offerings or commercial services.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Final CTA Section - Clear closer with increased separation */}
      <section className="py-6 md:py-8 lg:py-10 border-t border-border/50">
        <div className="container-wide max-w-[800px] mx-auto text-center">
          <AnimatedSection>
            <div className="space-y-6 lg:space-y-8">
              <h2 className="text-2xl md:text-3xl lg:text-4xl">Ready to have a conversation?</h2>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto">
                I am selective about what I take on, but always happy to have a first conversation.
              </p>
              <div className="pt-2 lg:pt-4">
                <Button 
                  variant="hero" 
                  size="lg" 
                  asChild
                  onClick={() => handleCTAClick('footer-cta')}
                >
                  <a href="https://calendly.com/adrian-watkins1/new-meeting" target="_blank" rel="noopener noreferrer">
                    Book a 30-minute clarity call
                  </a>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
