import { AnimatedSection, StaggeredChildren, StaggeredItem } from "@/components/AnimatedSection";

const partners = [
  {
    name: "Beyond4",
    logo: "/beyond4tech-logo.png",
    subtitle: "Portfolio advisory & workshops",
    description: "Supporting early-stage companies with AI strategy and governance frameworks",
    needsInvert: false,
  },
  {
    name: "Blackstorm",
    logo: "/blackstorm-logo.webp",
    subtitle: "Portfolio advisory & facilitation",
    description: "Business model innovation and AI strategy for portfolio companies",
    needsInvert: false,
  },
  {
    name: "Project Asia Data",
    logo: "/project-asia-data-logo.png",
    subtitle: "Ecosystem engagement",
    description: "Applied intelligence workshops for data-driven startups",
    needsInvert: false,
  },
];

export function TrustedBySection() {
  return (
    <section className="py-16 md:py-16 lg:py-20 border-t border-border/50 bg-[hsl(222_47%_6%)]">
      <div className="container-wide max-w-[1100px] mx-auto">
        <AnimatedSection>
          <div className="space-y-10 lg:space-y-12">
            <div className="space-y-3 text-center">
              <h2 className="text-[hsl(0_0%_96%)]">Working Across Asia-Pacific Startup Ecosystems</h2>
              <p className="text-[hsl(213_27%_78%)] text-lg max-w-2xl mx-auto">
                Advisory and workshop engagements with portfolio companies and investment platforms across Southeast Asia
              </p>
            </div>

            <StaggeredChildren className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {partners.map((partner) => (
                <StaggeredItem key={partner.name}>
                  <div className="p-8 bg-[hsl(222_47%_8%)] border border-[hsl(222_20%_16%)] rounded-lg h-full flex flex-col items-center text-center space-y-4 hover:border-accent/30 transition-all duration-300">
                    <div className="h-20 flex items-center justify-center">
                      <img
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        className="max-w-[180px] max-h-[72px] w-auto h-auto object-contain brightness-110 hover:opacity-80 transition-opacity duration-300"
                      />
                    </div>
                    <p className="text-accent text-sm font-medium tracking-wide">
                      {partner.subtitle}
                    </p>
                    <p className="text-[hsl(215_20%_65%)] text-sm leading-relaxed">
                      {partner.description}
                    </p>
                  </div>
                </StaggeredItem>
              ))}
            </StaggeredChildren>

            <p className="text-sm text-[hsl(215_20%_65%)] text-center max-w-2xl mx-auto">
              Engagements span portfolio advisory, executive workshops, and ecosystem-building initiatives across Singapore, Southeast Asia, and beyond.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
