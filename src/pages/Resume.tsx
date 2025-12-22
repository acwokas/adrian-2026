import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/hooks/useAnalytics";

const capabilityGroups = [
  {
    title: "Leadership & Execution",
    items: [
      "Executive decision support",
      "Operational leadership",
      "Cross-functional alignment",
    ],
  },
  {
    title: "Commercial & Strategy",
    items: [
      "Commercial model design",
      "Go-to-market strategy",
      "Productisation",
    ],
  },
  {
    title: "Governance & Risk",
    items: [
      "Board-level governance",
      "Responsible AI and data use",
      "Regulated environments",
    ],
  },
];

const highlights = [
  { 
    outcome: "Led commercial and operational alignment across a multi-market AI business", 
    context: "Responsible for commercial strategy, operational execution, and governance across regions." 
  },
  { 
    outcome: "Drove operational transformation delivering measurable performance improvement", 
    context: "Responsible for team restructuring, go-to-market redesign, and execution discipline." 
  },
  { 
    outcome: "Shaped strategic direction and commercial priorities at CEO and board level", 
    context: "Provided executive decision support across multiple sectors and geographies." 
  },
  { 
    outcome: "Played a key role in acquisition/raise plans, and post-transaction integrations", 
    context: "Focused on commercial alignment, organisational structure, and execution continuity." 
  },
  { 
    outcome: "Founded AIinASIA.com as a leading platform for practical AI insight", 
    context: "Responsible for content, ecosystem development, and responsible technology advocacy." 
  },
  { 
    outcome: "Created you.withthepowerof.ai to democratise access to capability", 
    context: "Responsible for unlocking tools and resources often locked behind large organisations." 
  },
  { 
    outcome: "Guided senior leaders and founders through critical transitions", 
    context: "Responsible for supporting growth challenges and strategic decision-making." 
  },
];

export default function Resume() {
  const [cvUrl, setCvUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCvPath = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("cv_path")
        .eq("id", "main")
        .single();

      if (data?.cv_path) {
        const { data: urlData } = supabase.storage.from("documents").getPublicUrl(data.cv_path);
        setCvUrl(urlData.publicUrl);
      }
    };
    fetchCvPath();
  }, []);

  return (
    <Layout>
      <SEO 
        title="Resume - Senior Commercial & Operational Leader"
        description="Professional CV of Adrian Watkins. Senior executive with board-level advisory experience, commercial strategy, operational transformation, and executive decision support across Asia Pacific."
        canonical="/resume"
        keywords="executive resume, senior leader CV, board advisor, commercial director resume, COO resume, fractional executive, executive decision support, Asia Pacific executive"
        breadcrumb={[{ name: "Resume", path: "/resume" }]}
      />
      {/* Header with Executive Summary */}
      <section className="section-spacing lg:pb-20">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-8">
              <h1>Resume</h1>
              
              {/* Mobile: Executive Summary Block */}
              <div className="lg:hidden space-y-4 py-6 border-y border-border/30">
                <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed">
                  Senior Commercial and Operational Leader
                </p>
                <ul className="space-y-2 text-base md:text-lg text-muted-foreground leading-relaxed">
                  <li>Operates at CEO and executive team level</li>
                  <li>Advisory, fractional, and permanent leadership roles</li>
                  <li>Strategy, operations, governance, and execution</li>
                  <li>Experience across AI, data, media, platforms, and regulated environments</li>
                </ul>
              </div>

              {/* Desktop: Enhanced Executive Summary Block */}
              <div className="hidden lg:block space-y-6 py-8 border-y border-border/30">
                <p className="text-2xl font-medium text-foreground leading-relaxed">
                  Senior Commercial and Operational Leader
                </p>
                <ul className="space-y-3 text-lg text-muted-foreground leading-relaxed">
                  <li>Operates at CEO and executive team level</li>
                  <li>Advisory, fractional, and permanent leadership roles</li>
                  <li>Strategy, operations, governance, and execution</li>
                  <li>Experience across AI, data, media, platforms, and regulated environments</li>
                </ul>
              </div>

              <p className="text-lg lg:text-xl border-l-2 border-accent pl-6 py-2 text-foreground">
                Measured by improved focus, stronger execution, and better commercial outcomes.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Profile */}
      <section className="py-16 md:py-20 lg:py-28">
        <div className="container-narrow">
          <AnimatedSection>
            {/* Mobile: stacked layout */}
            <div className="lg:hidden space-y-6">
              <h2>Profile</h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  <span className="text-foreground font-medium">Decision-making under pressure.</span>{" "}
                  I work with organisations and leadership teams to drive clarity and deliver commercial outcomes in complex environments.
                </p>
                <ul className="space-y-2 py-4 text-foreground/90 font-medium">
                  <li>Comfortable owning decisions with commercial and reputational impact</li>
                  <li>Operates effectively in ambiguity and under pressure</li>
                  <li>Trusted advisor to CEOs and executive teams</li>
                </ul>
                <p>
                  <span className="text-foreground font-medium">Alignment between strategy and execution.</span>{" "}
                  My career spans commercial leadership, operational transformation, advisory, and ecosystem building.
                </p>
                <p>
                  <span className="text-foreground font-medium">Comfortable owning outcomes.</span>{" "}
                  I challenge assumptions and focus attention on what will actually move the business forward.
                </p>
                <p>
                  Experience includes board-level advisory roles and executive decision support across multiple sectors.
                </p>
              </div>
            </div>

            {/* Desktop: two-column layout */}
            <div className="hidden lg:grid lg:grid-cols-[30%_70%] lg:gap-12 lg:items-start">
              <div className="pt-1">
                <h2 className="text-[2rem] font-medium leading-snug">Profile</h2>
              </div>
              <div className="space-y-5">
                <p className="text-[0.9375rem] leading-[1.85] text-muted-foreground">
                  <span className="text-foreground font-medium">Decision-making under pressure.</span>{" "}
                  I work with organisations and leadership teams to drive clarity and deliver commercial outcomes in complex environments.
                </p>
                <ul className="space-y-2 py-3 text-[0.9375rem] leading-[1.85] text-foreground font-medium">
                  <li>Comfortable owning decisions with commercial and reputational impact</li>
                  <li>Operates effectively in ambiguity and under pressure</li>
                  <li>Trusted advisor to CEOs and executive teams</li>
                </ul>
                <p className="text-[0.9375rem] leading-[1.85] text-muted-foreground">
                  <span className="text-foreground font-medium">Alignment between strategy and execution.</span>{" "}
                  My career spans commercial leadership, operational transformation, advisory, and ecosystem building.
                </p>
                <p className="text-[0.9375rem] leading-[1.85] text-muted-foreground">
                  <span className="text-foreground font-medium">Comfortable owning outcomes.</span>{" "}
                  I challenge assumptions and focus attention on what will actually move the business forward.
                </p>
                <p className="text-[0.9375rem] leading-[1.85] text-muted-foreground">
                  Experience includes board-level advisory roles and executive decision support across multiple sectors.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-16 md:py-20 lg:py-28">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-10 lg:space-y-12">
              <h2>Core Capabilities</h2>
              
              {/* 3-column card grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {capabilityGroups.map((group) => (
                  <div 
                    key={group.title} 
                    className="group p-6 lg:p-8 border border-border/40 rounded-lg bg-card/30 hover:border-accent/50 hover:bg-card/50 transition-all duration-300"
                  >
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-5 pb-4 border-b border-border/30">
                      {group.title}
                    </h4>
                    <ul className="space-y-3 text-muted-foreground">
                      {group.items.map((item) => (
                        <li key={item} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Career Highlights */}
      <section className="py-16 md:py-20 lg:py-32">
        <div className="container-narrow">
          <AnimatedSection>
            {/* Mobile: stacked layout */}
            <div className="lg:hidden space-y-10">
              <h2>Career Highlights</h2>
              <div className="space-y-8">
                {highlights.map((item, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-foreground font-semibold leading-relaxed">
                      {item.outcome}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.context}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: two-column layout */}
            <div className="hidden lg:grid lg:grid-cols-[30%_70%] lg:gap-12 lg:items-start">
              <div className="pt-1">
                <h2 className="text-[2rem] font-medium leading-snug">Career Highlights</h2>
              </div>
              <div className="space-y-8">
                {highlights.map((item, i) => (
                  <div key={i} className="space-y-1.5">
                    <p className="text-base text-foreground font-semibold leading-relaxed">
                      {item.outcome}
                    </p>
                    <p className="text-[0.8125rem] text-muted-foreground/80 leading-relaxed">
                      {item.context}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Background - De-emphasised */}
      <section className="py-16 md:py-20 lg:py-24 bg-[hsl(var(--section-light))] md:bg-transparent">
        <div className="container-narrow">
          <AnimatedSection>
            {/* Mobile: stacked layout */}
            <div className="lg:hidden space-y-6">
              <h2>Background</h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  Over two decades across multiple geographies, with particular depth in Asia Pacific markets. Progression from commercial leadership to executive and board-level responsibility.
                </p>
                <p>
                  Strategic perspective combined with operational pragmatism, comfortable in both large organisations and high-growth environments.
                </p>
              </div>
            </div>

            {/* Desktop: two-column layout, de-emphasised */}
            <div className="hidden lg:grid lg:grid-cols-[30%_70%] lg:gap-12 lg:items-start">
              <div className="pt-1">
                <h3 className="text-xl font-medium leading-snug text-foreground/80">Background</h3>
              </div>
              <div className="space-y-4">
                <p className="text-[0.875rem] leading-[1.85] text-muted-foreground">
                  Over two decades across multiple geographies, with particular depth in Asia Pacific markets. Progression from commercial leadership to executive and board-level responsibility.
                </p>
                <p className="text-[0.875rem] leading-[1.85] text-muted-foreground">
                  Strategic perspective combined with operational pragmatism, comfortable in both large organisations and high-growth environments.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Download CTA - Clear closer with increased separation */}
      <section className="py-28 md:py-36 lg:py-44">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <div className="space-y-10">
              <h2>Full CV</h2>
              {cvUrl ? (
                <Button 
                  variant="hero" 
                  size="xl" 
                  asChild 
                  className="min-w-[300px]"
                  onClick={() => trackEvent({ eventType: 'cta_click', eventName: 'download_cv' })}
                >
                  <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                    <Download size={20} />
                    Download full CV (PDF)
                  </a>
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">CV download coming soon</p>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
