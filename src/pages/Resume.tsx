import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection, StaggeredChildren, StaggeredItem } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";

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
    outcome: "Led commercial and operational alignment across multi-market AI business", 
    context: "Responsible for revenue strategy, partnerships, and market expansion across Asia Pacific." 
  },
  { 
    outcome: "Drove operational transformation resulting in measurable performance improvement", 
    context: "Led team restructuring, go-to-market redesign, and execution discipline initiatives." 
  },
  { 
    outcome: "Advised CEOs and boards on strategic direction and commercial priorities", 
    context: "Provided executive decision support across multiple sectors and geographies." 
  },
  { 
    outcome: "Founded and lead AIinASIA.com as a platform for practical AI insight", 
    context: "Building ecosystem focused on responsible use of emerging technology." 
  },
  { 
    outcome: "Created you.withthepowerof.ai to democratise access to capability", 
    context: "Unlocking tools and resources often locked behind large organisations." 
  },
  { 
    outcome: "Mentored senior leaders and founders through critical transitions", 
    context: "Supporting growth challenges and strategic decision-making." 
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
        title="Resume"
        description="Professional background, capabilities, and career highlights. Senior commercial and operational leadership across technology, media, and professional services."
        canonical="/resume"
      />
      {/* Header */}
      <section className="section-spacing border-b border-border/50">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-8">
              <h1>Resume</h1>
              
              {/* Executive Summary Block - Critical for instant classification */}
              <div className="space-y-4 py-6 border-y border-border/30">
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

              <p className="text-lg border-l-2 border-accent pl-6 py-2">
                My work is measured by improved focus, stronger execution, and better commercial outcomes.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Profile - Reformatted for mobile scanning */}
      <section className="py-16 md:py-20 border-b border-border/50">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-8">
              <h2 className="text-2xl">Profile</h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  <span className="text-foreground font-medium">Decision-making under pressure.</span>{" "}
                  I work with organisations and leadership teams to drive clarity and deliver commercial outcomes in complex environments.
                </p>
                <p>
                  <span className="text-foreground font-medium">Alignment between strategy and execution.</span>{" "}
                  My career spans commercial leadership, operational transformation, advisory, and ecosystem building.
                </p>
                <p>
                  <span className="text-foreground font-medium">Comfortable owning outcomes.</span>{" "}
                  I challenge assumptions and focus attention on what will actually move the business forward.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Core Capabilities - Grouped sections */}
      <section className="py-16 md:py-20 border-b border-border/50">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-10">
              <h2 className="text-2xl">Core capabilities</h2>
              <StaggeredChildren className="space-y-10">
                {capabilityGroups.map((group) => (
                  <StaggeredItem key={group.title}>
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium uppercase tracking-wide text-foreground/70">
                        {group.title}
                      </h4>
                      <ul className="space-y-2">
                        {group.items.map((item) => (
                          <li key={item} className="text-muted-foreground">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </StaggeredItem>
                ))}
              </StaggeredChildren>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Career Highlights - Outcome-first framing */}
      <section className="py-16 md:py-20 border-b border-border/50">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-10">
              <h2 className="text-2xl">Career highlights</h2>
              <StaggeredChildren className="space-y-8">
                {highlights.map((item, i) => (
                  <StaggeredItem key={i}>
                    <div className="space-y-1">
                      <p className="text-foreground font-medium leading-relaxed">
                        {item.outcome}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.context}
                      </p>
                    </div>
                  </StaggeredItem>
                ))}
              </StaggeredChildren>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Background - Reduced narrative density */}
      <section className="py-16 md:py-20 border-b border-border/50">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-8">
              <h2 className="text-2xl">Background</h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  Over two decades across multiple geographies, with particular depth in Asia Pacific markets.
                </p>
                <p>
                  Progression from commercial leadership to executive and board-level responsibility.
                </p>
                <p>
                  Strategic perspective combined with operational pragmatism—comfortable in both large organisations and high-growth environments.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Download CTA - Impossible to miss */}
      <section className="py-20 md:py-28">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <div className="space-y-8">
              <h2>Full CV</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Complete career history and credentials.
              </p>
              {cvUrl ? (
                <Button variant="hero" size="xl" asChild className="min-w-[280px]">
                  <a href={cvUrl} target="_blank" rel="noopener noreferrer" download>
                    <Download size={18} />
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
