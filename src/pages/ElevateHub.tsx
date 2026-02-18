import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { AnimatedSection, StaggeredChildren, StaggeredItem } from "@/components/AnimatedSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles, ExternalLink } from "lucide-react";

const principles = [
  { name: "Clarity", desc: "Remove ambiguity, make instructions explicit" },
  { name: "Specificity", desc: "Add constraints (length, format, tone, audience)" },
  { name: "Structure", desc: "Use numbered steps, sections, clear formatting" },
  { name: "Context", desc: "Include relevant background information" },
  { name: "Output Format", desc: "Specify exactly how responses should be structured" },
  { name: "Examples", desc: "Add few-shot examples when helpful" },
  { name: "Role/Persona", desc: "Define the AI's role when beneficial" },
  { name: "Constraints", desc: "Add guardrails (what NOT to do)" },
];

export default function ElevateHub() {
  return (
    <Layout>
      <SEOHead
        canonical="/tools/elevate"
        title="Elevate Tools | EDGE Framework"
        description="Optimise AI interactions, improve prompt quality, and get better results faster. Built on proven prompt engineering principles."
      />

      {/* Hero */}
      <section className="section-spacing">
        <div className="container-wide max-w-[900px] mx-auto">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link to="/tools" className="hover:text-foreground transition-colors">Tools</Link>
              <span>/</span>
              <span className="text-foreground">Elevate</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15]">
              Performance & Optimisation Tools
            </h1>
            <div className="space-y-4 max-w-[720px]">
              <p className="text-muted-foreground leading-relaxed">
                Elevate execution quality and translate capability into sustained advantage.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                These tools help you optimise AI interactions, improve prompt quality, and get better results faster. Built on proven prompt engineering principles.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Tool Card */}
      <section className="pb-10 md:pb-12 lg:pb-14">
        <div className="container-wide max-w-[900px] mx-auto">
          <StaggeredChildren className="grid gap-5 lg:gap-6">
            <StaggeredItem>
              <Link
                to="/tools/elevate/prompt-engineer"
                className="block p-6 md:p-8 bg-card border border-border/30 hover:border-accent/30 transition-colors group"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Sparkles className="h-5 w-5 text-accent" />
                      <h2 className="text-lg font-semibold group-hover:text-accent transition-colors">
                        Prompt Engineer
                      </h2>
                      <Badge variant="outline" className="text-[10px] tracking-wide uppercase font-normal text-muted-foreground border-border/40">
                        3 modes: Generate | Optimise | Adapt
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-[560px]">
                      Generate prompts from scratch, optimise existing ones, or adapt them for specific AI platforms. Three modes, one powerful tool.
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 pt-2">
                      {[
                        "AI-generated prompts from simple descriptions",
                        "Before/after optimisation with explanations",
                        "Platform-specific adaptations (ChatGPT, Claude, Gemini, MidJourney, Perplexity)",
                        "Educational insights on what makes prompts effective",
                      ].map((f) => (
                        <li key={f} className="text-xs text-muted-foreground/70 flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-accent/60 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-3">
                      <span className="inline-flex items-center gap-1.5 text-sm text-accent font-medium group-hover:underline underline-offset-4">
                        Open Prompt Engineer <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-accent transition-colors shrink-0 mt-1 hidden md:block" />
                </div>
              </Link>
            </StaggeredItem>
          </StaggeredChildren>
        </div>
      </section>

      {/* How It Works */}
      <section className="pb-6 md:pb-8">
        <div className="container-wide max-w-[900px] mx-auto">
          <AnimatedSection>
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full text-left py-3 border-t border-border/20 group">
                <span className="text-sm font-medium">How it works</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-4 py-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Prompt Engineer gives you three ways to improve your AI results:
                  </p>
                  <div className="space-y-3">
                    {[
                      { mode: "GENERATE", desc: "Describe what you want, get an optimised prompt ready to use" },
                      { mode: "OPTIMISE", desc: "Paste an existing prompt, see how to make it 3x more effective" },
                      { mode: "ADAPT", desc: "Rewrite any prompt for specific platforms (ChatGPT, Claude, Gemini, MidJourney, Perplexity)" },
                    ].map((item) => (
                      <div key={item.mode} className="flex items-start gap-3 pl-4">
                        <Badge variant="outline" className="text-[10px] tracking-wide font-normal text-accent border-accent/30 shrink-0 mt-0.5">
                          {item.mode}
                        </Badge>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground/70 pt-1">
                    All modes include educational explanations so you learn prompt engineering principles while using the tool.
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </AnimatedSection>
        </div>
      </section>

      {/* Prompt Engineering Principles */}
      <section className="pb-6 md:pb-8">
        <div className="container-wide max-w-[900px] mx-auto">
          <AnimatedSection>
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full text-left py-3 border-t border-border/20 group">
                <span className="text-sm font-medium">Prompt engineering principles</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-4 py-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The tool applies 8 core principles:
                  </p>
                  <ol className="space-y-2">
                    {principles.map((p, i) => (
                      <li key={p.name} className="text-sm text-muted-foreground flex items-start gap-3 pl-4">
                        <span className="text-accent/70 font-medium shrink-0 w-4 text-right">{i + 1}.</span>
                        <span><span className="text-foreground font-medium">{p.name}</span> — {p.desc}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="text-sm text-muted-foreground/70 pt-1">
                    These aren't abstract theory — you'll see them applied in real-time.
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </AnimatedSection>
        </div>
      </section>

      {/* Getting Started */}
      <section className="pb-6 md:pb-8">
        <div className="container-wide max-w-[900px] mx-auto">
          <AnimatedSection>
            <div className="p-6 md:p-8 border border-accent/20 bg-accent/5">
              <h3 className="text-base font-semibold mb-3">Getting Started</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                New to prompt engineering? Start with <strong className="text-foreground">GENERATE</strong> mode to create prompts from scratch. Once comfortable, use <strong className="text-foreground">OPTIMISE</strong> to improve existing prompts, and <strong className="text-foreground">ADAPT</strong> to customise for different platforms.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="pb-6 md:pb-8">
        <div className="container-wide max-w-[900px] mx-auto">
          <AnimatedSection>
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full text-left py-3 border-t border-border/20 group">
                <span className="text-sm font-medium">Quick tips</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="space-y-2 py-4">
                  {[
                    "Be specific about what you want",
                    "Include context about your audience and goals",
                    "Specify desired format and length",
                    "Try different platforms to see what works best",
                    "Save prompts that work well for future reference",
                  ].map((tip) => (
                    <li key={tip} className="text-sm text-muted-foreground flex items-start gap-3 pl-4">
                      <span className="w-1 h-1 rounded-full bg-accent/60 shrink-0 mt-2" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </AnimatedSection>
        </div>
      </section>

      {/* PromptAndGo Callout */}
      <section className="pb-10 md:pb-12 lg:pb-14">
        <div className="container-wide max-w-[900px] mx-auto">
          <AnimatedSection>
            <div className="p-6 md:p-8 bg-secondary/50 border border-border/20">
              <h3 className="text-base font-semibold mb-3">Want more?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                PromptAndGo.ai offers an extended prompt engineering platform:
              </p>
              <ul className="space-y-1.5 mb-5">
                {[
                  "3,000+ tested prompts in the library",
                  "Prompt Studio template builders (16 categories)",
                  "Power Packs for specific industries",
                  "Full 11-platform optimisation",
                ].map((item) => (
                  <li key={item} className="text-sm text-muted-foreground flex items-center gap-2 pl-4">
                    <span className="w-1 h-1 rounded-full bg-accent/60 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://promptandgo.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline underline-offset-4"
                >
                  Browse Prompt Library <ArrowRight className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://promptandgo.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline underline-offset-4"
                >
                  Try Prompt Studio <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 md:pb-20">
        <div className="container-wide max-w-[900px] mx-auto">
          <AnimatedSection>
            <div className="border-t border-border/20 pt-8 space-y-4">
              <p className="text-sm text-muted-foreground">
                This tool operationalises the{" "}
                <Link to="/edge" className="text-accent hover:underline underline-offset-4">
                  EDGE Elevate pillar
                </Link>
              </p>
              <p className="text-sm text-muted-foreground/70">
                Explore the full framework to understand how elevation connects to evaluation, definition, and governance.
              </p>
              <Button variant="heroOutline" size="sm" asChild>
                <Link to="/edge">
                  Explore the EDGE Framework <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
