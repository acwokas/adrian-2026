import { useState, useCallback, useRef, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles, Target, Layers, ArrowRight, Copy, Check, ChevronDown,
  RotateCcw, Download, ShieldCheck, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// ── Types ──
type Mode = "generate" | "optimize" | "adapt";

const platforms = ["ChatGPT", "Claude", "Gemini", "MidJourney", "Perplexity"] as const;

const modes: { id: Mode; label: string; desc: string; icon: React.ReactNode }[] = [
  { id: "generate", label: "Generate", desc: "Create from description", icon: <Sparkles className="h-4 w-4" /> },
  { id: "optimize", label: "Optimise", desc: "Improve existing prompt", icon: <Target className="h-4 w-4" /> },
  { id: "adapt", label: "Adapt", desc: "Rewrite for platform", icon: <Layers className="h-4 w-4" /> },
];

const principlesByMode: Record<Mode, string[]> = {
  generate: ["Clarity", "Specificity", "Structure", "Context", "Output Format", "Role/Persona", "Constraints"],
  optimize: ["Clarity", "Specificity", "Structure", "Context", "Output Format", "Examples", "Constraints"],
  adapt: ["Specificity", "Structure", "Output Format", "Role/Persona", "Constraints"],
};

const allPrinciples: { name: string; desc: string }[] = [
  { name: "Clarity", desc: "Remove ambiguity, make instructions explicit" },
  { name: "Specificity", desc: "Add constraints (length, format, tone, audience)" },
  { name: "Structure", desc: "Use numbered steps, sections, clear formatting" },
  { name: "Context", desc: "Include relevant background information" },
  { name: "Output Format", desc: "Specify exactly how responses should be structured" },
  { name: "Examples", desc: "Add few-shot examples when helpful" },
  { name: "Role/Persona", desc: "Define the AI's role when beneficial" },
  { name: "Constraints", desc: "Add guardrails (what NOT to do)" },
];

const placeholders: Record<Mode, string> = {
  generate: "Describe what you want the AI to do.\n\ne.g., \"I need a prompt that helps me write LinkedIn posts about AI governance. The tone should be authoritative but accessible. Posts should be 150-200 words.\"",
  optimize: "Paste your existing prompt here.\n\ne.g., \"Write me a blog post about AI\" — and see how to make it 3x more effective.",
  adapt: "Paste the prompt you want to adapt for a specific platform.\n\ne.g., A detailed ChatGPT prompt that you want to convert for use with MidJourney or Claude.",
};

// ── Streaming helper ──
const PROMPT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/prompt-engineer`;

async function streamPrompt(
  payload: { mode: Mode; input: string; platform?: string },
  onDelta: (text: string) => void,
  onDone: () => void,
  onError: (msg: string) => void,
  signal?: AbortSignal,
) {
  const resp = await fetch(PROMPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: "Request failed" }));
    onError(err.error || "Request failed");
    return;
  }

  if (!resp.body) { onError("No response stream"); return; }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });

    let nl: number;
    while ((nl = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, nl);
      buf = buf.slice(nl + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { onDone(); return; }
      try {
        const parsed = JSON.parse(json);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch {
        buf = line + "\n" + buf;
        break;
      }
    }
  }
  onDone();
}

// ── Parse sections ──
interface Section { id: string; title: string; content: string }

function parseIntoSections(text: string): Section[] {
  const sections: Section[] = [];
  const parts = text.split(/^## /m).filter(Boolean);
  for (const part of parts) {
    const nlIdx = part.indexOf("\n");
    const title = (nlIdx > -1 ? part.slice(0, nlIdx) : part).trim();
    const content = nlIdx > -1 ? part.slice(nlIdx + 1).trim() : "";
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
    sections.push({ id, title, content });
  }
  return sections;
}

// ── Copy button ──
function CopyBtn({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copied", description: label || "Copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="text-muted-foreground hover:text-foreground transition-colors p-1" aria-label="Copy">
      {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

// ── Section card ──
function SectionCard({ section, defaultOpen }: { section: Section; defaultOpen?: boolean }) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <div className="border border-border/30 bg-card rounded-sm overflow-hidden">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left hover:bg-secondary/30 transition-colors group">
          <h3 className="text-sm font-medium">{section.title}</h3>
          <div className="flex items-center gap-2">
            <CopyBtn text={section.content} label={`${section.title} copied`} />
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 border-t border-border/20 pt-3 whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed">
            {section.content}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

// ── Main page ──
export default function PromptEngineer() {
  const location = useLocation();

  const getInitialMode = (): Mode => {
    const hash = location.hash.replace("#", "") as Mode;
    if (["generate", "optimize", "adapt"].includes(hash)) return hash;
    return "generate";
  };

  const [mode, setMode] = useState<Mode>(getInitialMode);
  const [input, setInput] = useState("");
  const [platform, setPlatform] = useState<string>("ChatGPT");
  const [rawText, setRawText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sections = parseIntoSections(rawText);
  const activePrinciples = principlesByMode[mode];

  // Sync hash
  useEffect(() => {
    window.history.replaceState(null, "", `#${mode}`);
  }, [mode]);

  const switchMode = (newMode: Mode) => {
    if (isStreaming) return;
    setMode(newMode);
    setRawText("");
    setInput("");
  };

  const canSubmit = input.trim().length >= 20 && (mode !== "adapt" || !!platform);

  const handleSubmit = useCallback(() => {
    setRawText("");
    setIsStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    streamPrompt(
      { mode, input, ...(mode === "adapt" ? { platform } : {}) },
      (delta) => setRawText((prev) => prev + delta),
      () => setIsStreaming(false),
      (err) => {
        setIsStreaming(false);
        toast({ title: "Processing failed", description: err, variant: "destructive" });
      },
      ctrl.signal,
    );
  }, [mode, input, platform]);

  const handleDownload = () => {
    const content = `# Prompt Engineer — ${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode\n\nGenerated: ${new Date().toISOString()}\n\n${rawText}`;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prompt-${mode}-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(rawText);
    toast({ title: "Copied", description: "Full result copied to clipboard." });
  };

  const handleStartOver = () => {
    abortRef.current?.abort();
    setRawText("");
    setInput("");
  };

  const buttonLabels: Record<Mode, string> = {
    generate: "Generate prompt",
    optimize: "Optimise prompt",
    adapt: "Adapt prompt",
  };

  return (
    <Layout>
      <SEO
        canonical="/tools/elevate/prompt-engineer"
        title="Prompt Engineer | EDGE Elevate"
        description="Generate, optimise, and adapt AI prompts. Three modes for better results: create from scratch, improve existing, or rewrite for specific platforms."
        keywords="prompt engineering, AI prompts, prompt optimization, ChatGPT prompts, Claude prompts"
      />

      {/* Header */}
      <section className="section-spacing">
        <div className="container-wide max-w-[900px] mx-auto">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <Link to="/tools" className="hover:text-foreground transition-colors">Tools</Link>
              <span>/</span>
              <Link to="/tools/elevate" className="hover:text-foreground transition-colors">Elevate</Link>
              <span>/</span>
              <span className="text-foreground">Prompt Engineer</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15]">
              Prompt Engineer
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-[720px]">
              Generate, optimise, and adapt prompts for better AI results.
            </p>
            <div className="flex items-start gap-2 text-sm text-muted-foreground/70">
              <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-accent/60" />
              <span>All processing happens in real-time. Prompts are never stored.</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mode tabs + Content */}
      <section className="pb-16 md:pb-20">
        <div className="container-wide max-w-[900px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main column */}
            <div className="flex-1 min-w-0 space-y-6">
              {/* Tab switcher */}
              <div className="flex gap-1 p-1 bg-secondary/50 border border-border/20 rounded-sm">
                {modes.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => switchMode(m.id)}
                    disabled={isStreaming}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-sm rounded-sm transition-all",
                      mode === m.id
                        ? "bg-card text-foreground font-medium shadow-sm border border-border/30"
                        : "text-muted-foreground hover:text-foreground disabled:opacity-50"
                    )}
                  >
                    {m.icon}
                    <span className="hidden sm:inline">{m.label}</span>
                    <span className="sm:hidden text-xs">{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab description */}
              <p className="text-xs text-muted-foreground">
                {modes.find((m) => m.id === mode)?.desc}
              </p>

              {/* Input form — only show when no results */}
              {!rawText && !isStreaming && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {mode === "generate" && "Describe what you want the AI to do"}
                      {mode === "optimize" && "Paste your existing prompt"}
                      {mode === "adapt" && "Paste the prompt to adapt"}
                    </label>
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={placeholders[mode]}
                      className="min-h-[160px] bg-secondary/30 border-border/40 focus-visible:ring-accent"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground/50">
                      <span>{input.length} characters</span>
                      <span>Minimum 20 characters</span>
                    </div>
                  </div>

                  {/* Platform selector for Adapt mode */}
                  {mode === "adapt" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Target platform</label>
                      <div className="flex flex-wrap gap-2">
                        {platforms.map((p) => (
                          <button
                            key={p}
                            onClick={() => setPlatform(p)}
                            className={cn(
                              "px-3 py-1.5 text-sm rounded-sm border transition-colors",
                              platform === p
                                ? "bg-accent/10 border-accent/40 text-accent font-medium"
                                : "border-border/30 text-muted-foreground hover:text-foreground hover:border-border/60"
                            )}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button onClick={handleSubmit} disabled={!canSubmit} variant="hero" size="default">
                    {buttonLabels[mode]}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}

              {/* Loading */}
              {isStreaming && rawText.length === 0 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {mode === "generate" && "Generating your prompt..."}
                    {mode === "optimize" && "Analysing and optimising..."}
                    {mode === "adapt" && `Adapting for ${platform}...`}
                  </p>
                  <p className="text-xs text-muted-foreground/50">This takes 15-30 seconds</p>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border border-border/30 bg-card rounded-sm p-4 space-y-3">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-4/5" />
                    </div>
                  ))}
                </div>
              )}

              {/* Streaming pre-sections */}
              {isStreaming && rawText.length > 0 && sections.length === 0 && (
                <div className="border border-border/30 bg-card rounded-sm p-4">
                  <div className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed">
                    {rawText}
                    <span className="inline-block w-0.5 h-4 bg-accent animate-pulse ml-0.5 align-text-bottom" />
                  </div>
                </div>
              )}

              {/* Result sections */}
              {sections.map((s, i) => (
                <SectionCard key={s.id} section={s} defaultOpen={i === 0} />
              ))}

              {/* Streaming indicator */}
              {isStreaming && sections.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  Processing...
                </div>
              )}

              {/* Actions */}
              {!isStreaming && sections.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-border/20">
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" onClick={handleCopyAll}>
                      <Copy className="h-3.5 w-3.5 mr-1.5" />
                      Copy all
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Download .md
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleStartOver}>
                      <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                      Start over
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    {modes.filter((m) => m.id !== mode).map((m) => (
                      <Button key={m.id} variant="ghost" size="sm" onClick={() => switchMode(m.id)} className="text-muted-foreground">
                        {m.icon}
                        <span className="ml-1.5">Try {m.label} mode</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Educational sidebar */}
            <div className="lg:w-[260px] shrink-0">
              <AnimatedSection>
                <Collapsible defaultOpen>
                  <div className="border border-border/30 bg-card rounded-sm overflow-hidden sticky top-24">
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left group">
                      <span className="text-sm font-medium">Principles Applied</span>
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-4 pb-4 border-t border-border/20 pt-3 space-y-2.5">
                        {allPrinciples.map((p) => {
                          const active = activePrinciples.includes(p.name);
                          return (
                            <div key={p.name} className={cn("text-xs", active ? "text-foreground" : "text-muted-foreground/40")}>
                              <span className={cn("font-medium", active && "text-accent")}>{p.name}</span>
                              {active && <span className="text-muted-foreground"> — {p.desc}</span>}
                            </div>
                          );
                        })}
                        <p className="text-[10px] text-muted-foreground/50 pt-2 border-t border-border/10">
                          Active principles for {mode} mode are highlighted.
                        </p>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="pb-16 md:pb-20">
        <div className="container-wide max-w-[900px] mx-auto">
          <AnimatedSection>
            <div className="border-t border-border/20 pt-8 space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button variant="heroOutline" size="sm" asChild>
                  <Link to="/edge">
                    Explore the EDGE Framework <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href="https://promptandgo.ai" target="_blank" rel="noopener noreferrer">
                    Explore PromptAndGo.ai <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
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
