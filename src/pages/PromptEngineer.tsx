import { useState, useCallback, useRef, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles, Target, Layers, ArrowRight, Copy, Check, ChevronDown,
  RotateCcw, Download, ShieldCheck, ExternalLink, Lightbulb, Send,
  MessageSquare, Brain, Gem, Palette, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// ── Types ──
type Mode = "generate" | "optimize" | "adapt";

const platformOptions = ["Any platform", "ChatGPT", "Claude", "Gemini", "MidJourney", "Perplexity"] as const;
type AdaptPlatform = "ChatGPT" | "Claude" | "Gemini" | "MidJourney" | "Perplexity";

const sendToAiLinks: Record<string, string> = {
  ChatGPT: "https://chatgpt.com/",
  Claude: "https://claude.ai/",
  Gemini: "https://gemini.google.com/",
  Perplexity: "https://www.perplexity.ai/",
  MidJourney: "https://discord.com/channels/@me",
};

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

const focusAreaOptions = [
  { id: "clarity", label: "Clarity", desc: "Make instructions clearer" },
  { id: "specificity", label: "Specificity", desc: "Add helpful constraints" },
  { id: "structure", label: "Structure", desc: "Improve organisation" },
  { id: "context", label: "Context", desc: "Add relevant background" },
  { id: "output-format", label: "Output format", desc: "Specify desired format" },
];

const placeholders: Record<Mode, string> = {
  generate: "e.g., Write a marketing email for my SaaS product targeting startup founders",
  optimize: "Paste your existing prompt here",
  adapt: "Paste any prompt here",
};

const loadingPhasesMap: Record<Mode, string[]> = {
  generate: ["Analysing your request...", "Applying prompt engineering principles...", "Generating optimised prompt..."],
  optimize: ["Analysing your prompt...", "Identifying improvements...", "Generating optimised version..."],
  adapt: [],
};

// ── Platform card data ──
interface PlatformCardData {
  id: AdaptPlatform;
  icon: React.ReactNode;
  description: string;
  badge: string;
  tip: string;
}

const platformCards: PlatformCardData[] = [
  {
    id: "ChatGPT",
    icon: <MessageSquare className="h-5 w-5" />,
    description: "Structured, conversational format",
    badge: "Most popular",
    tip: "Works best with structured objectives and clear output requirements",
  },
  {
    id: "Claude",
    icon: <Brain className="h-5 w-5" />,
    description: "Narrative elegance, detailed context",
    badge: "Best for complex tasks",
    tip: "Benefits from context and requests for detailed thinking",
  },
  {
    id: "Gemini",
    icon: <Gem className="h-5 w-5" />,
    description: "Analytical, bullet-point format",
    badge: "Data-focused",
    tip: "Excels with analytical tasks and bullet-point organisation",
  },
  {
    id: "MidJourney",
    icon: <Palette className="h-5 w-5" />,
    description: "Visual generation, photography terms",
    badge: "Image creation",
    tip: "Add aspect ratio (--ar 16:9) and version (--v 6) parameters",
  },
  {
    id: "Perplexity",
    icon: <Search className="h-5 w-5" />,
    description: "Research format with citations",
    badge: "Research & analysis",
    tip: "Include 'cite sources' for research-heavy queries",
  },
];

// ── Client-side adapters ──
function adaptForChatGPT(prompt: string): string {
  const sentences = prompt.split(/(?<=[.!?])\s+/).filter(Boolean);
  const objective = sentences[0] || prompt;
  const rest = sentences.slice(1).join(" ").trim();

  return `Objective: ${objective}${rest ? `\n\nApproach:\n${rest}` : ""}

Expected Output:
- Provide clear, structured response
- Use examples when helpful
- Format for readability`;
}

function adaptForClaude(prompt: string): string {
  return `I need your help with the following task, and I'd like you to approach it with narrative elegance and thorough consideration:

${prompt}

Please structure your response with:
- Clear introduction to your approach
- Detailed analysis or explanation
- Concrete examples
- Summary of key takeaways

Take your time to think through this comprehensively.`;
}

function adaptForGemini(prompt: string): string {
  return `Task: ${prompt}

Please provide:
- Key concepts and definitions
- Structured analysis
- Data points or examples
- Summary in bullet format

Format your response for clarity and analytical depth.`;
}

function adaptForMidJourney(prompt: string): string {
  const cleaned = prompt.replace(/\b(create|generate|make|design|produce|write|explain|describe how)\b/gi, "").replace(/\s{2,}/g, " ").trim();
  return `${cleaned}, professional photography, highly detailed, cinematic lighting, vibrant colors, ultra-realistic, 8k resolution, masterpiece quality --ar 16:9 --v 6`;
}

function adaptForPerplexity(prompt: string): string {
  return `Research query: ${prompt}

Please provide a comprehensive analysis including:
- Overview with key definitions
- Current state of knowledge (cite sources)
- Multiple perspectives where relevant
- Data and statistics where available
- Conclusion with synthesis

Use British English. Cite authoritative sources throughout.`;
}

const adapters: Record<AdaptPlatform, (prompt: string) => string> = {
  ChatGPT: adaptForChatGPT,
  Claude: adaptForClaude,
  Gemini: adaptForGemini,
  MidJourney: adaptForMidJourney,
  Perplexity: adaptForPerplexity,
};

// ── Streaming helper ──
const PROMPT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/prompt-engineer`;

async function streamPrompt(
  payload: Record<string, unknown>,
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

// ── Loading with rotating phases ──
function LoadingPhases({ phases }: { phases: string[] }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p < phases.length - 1 ? p + 1 : p));
    }, 4000);
    return () => clearInterval(interval);
  }, [phases.length]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {phases.map((msg, i) => (
          <p
            key={msg}
            className={cn(
              "text-sm transition-all duration-500",
              i <= phase ? "text-muted-foreground" : "text-muted-foreground/30",
              i === phase && "text-foreground font-medium"
            )}
          >
            {i < phase ? "✓" : i === phase ? "●" : "○"} {msg}
          </p>
        ))}
      </div>
      <p className="text-xs text-muted-foreground/50">Estimated time: 15-30 seconds</p>
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-border/30 bg-card rounded-sm p-4 space-y-3">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      ))}
    </div>
  );
}

// ── Send to AI dropdown ──
function SendToAiMenu({ promptText, defaultPlatform }: { promptText: string; defaultPlatform?: string }) {
  const [open, setOpen] = useState(false);

  const handleSend = async (name: string, url: string) => {
    await navigator.clipboard.writeText(promptText);
    window.open(url, "_blank", "noopener,noreferrer");
    toast({ title: "Prompt copied!", description: `Opening ${name}...` });
    setOpen(false);
  };

  // If a default platform is set, show a direct button
  if (defaultPlatform && sendToAiLinks[defaultPlatform]) {
    return (
      <Button variant="outline" size="sm" onClick={() => handleSend(defaultPlatform, sendToAiLinks[defaultPlatform])}>
        <Send className="h-3.5 w-3.5 mr-1.5" />
        Send to {defaultPlatform}
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={() => setOpen(!open)}>
        <Send className="h-3.5 w-3.5 mr-1.5" />
        Send to AI
        <ChevronDown className="h-3 w-3 ml-1" />
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 z-50 bg-card border border-border/30 rounded-sm shadow-lg min-w-[180px]">
            {Object.entries(sendToAiLinks).map(([name, url]) => (
              <button
                key={name}
                onClick={() => handleSend(name, url)}
                className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors first:rounded-t-sm last:rounded-b-sm"
              >
                {name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Side-by-side comparison ──
function SideBySideComparison({ original, adapted, label, badgeText }: { original: string; adapted: string; label?: string; badgeText?: string }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Original */}
      <div className="border border-border/20 bg-secondary/20 rounded-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/20">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Original</span>
          <CopyBtn text={original} label="Original prompt copied" />
        </div>
        <div className="p-4 whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed max-h-[300px] overflow-y-auto">
          {original}
        </div>
      </div>
      {/* Adapted/Optimised */}
      <div className="border border-accent/30 bg-card rounded-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-accent/20 bg-accent/5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-accent uppercase tracking-wide">{label || "Optimised"}</span>
            {badgeText && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                {badgeText}
              </span>
            )}
          </div>
          <CopyBtn text={adapted} label={`${label || "Optimised"} prompt copied`} />
        </div>
        <div className="p-4 whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed max-h-[300px] overflow-y-auto">
          {adapted}
        </div>
      </div>
    </div>
  );
}

// ── Compare all platforms view ──
function CompareAllPlatforms({ original }: { original: string }) {
  const [activeTab, setActiveTab] = useState<AdaptPlatform>("ChatGPT");
  const adapted = adapters[activeTab](original);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {platformCards.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveTab(p.id)}
            className={cn(
              "px-3 py-1.5 text-xs rounded-sm border transition-colors",
              activeTab === p.id
                ? "bg-accent/10 border-accent/40 text-accent font-medium"
                : "border-border/30 text-muted-foreground hover:text-foreground hover:border-border/60"
            )}
          >
            {p.id}
          </button>
        ))}
      </div>
      <SideBySideComparison
        original={original}
        adapted={adapted}
        label="Adapted"
        badgeText={`Optimised for ${activeTab}`}
      />
      <div className="flex items-start gap-2 p-3 bg-secondary/30 border border-border/20 rounded-sm">
        <Lightbulb className="h-3.5 w-3.5 shrink-0 mt-0.5 text-accent/70" />
        <p className="text-xs text-muted-foreground">
          {platformCards.find((p) => p.id === activeTab)?.tip}
        </p>
      </div>
    </div>
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
  // Generate state
  const [generateContext, setGenerateContext] = useState("");
  const [generatePlatform, setGeneratePlatform] = useState("Any platform");
  // Optimize state
  const [optimizeAiTool, setOptimizeAiTool] = useState("");
  const [optimizeGoal, setOptimizeGoal] = useState("");
  const [optimizeFocusAreas, setOptimizeFocusAreas] = useState<string[]>([]);
  const [originalPrompt, setOriginalPrompt] = useState("");
  // Adapt state
  const [adaptPlatform, setAdaptPlatform] = useState<AdaptPlatform>("ChatGPT");
  const [adaptedResult, setAdaptedResult] = useState("");
  const [adaptOriginal, setAdaptOriginal] = useState("");
  const [showCompareAll, setShowCompareAll] = useState(false);
  // Shared
  const [rawText, setRawText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sections = parseIntoSections(rawText);
  const activePrinciples = principlesByMode[mode];

  // Extract prompt section
  const promptSection = sections.find(
    (s) => s.id.includes("generated-prompt") || s.id.includes("optimised-prompt") || s.id.includes("adapted-prompt")
  );
  // Non-prompt sections for display
  const otherSections = sections.filter((s) => s !== promptSection);

  // Sync hash
  useEffect(() => {
    window.history.replaceState(null, "", `#${mode}`);
  }, [mode]);

  // Keyboard shortcut
  const canSubmit = mode === "optimize"
    ? input.trim().length >= 30
    : input.trim().length >= 20 && (mode !== "adapt" || !!adaptPlatform);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canSubmit && !isStreaming && !rawText && !adaptedResult) {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const resetModeState = () => {
    setGenerateContext("");
    setGeneratePlatform("Any platform");
    setOptimizeAiTool("");
    setOptimizeGoal("");
    setOptimizeFocusAreas([]);
    setOriginalPrompt("");
    setAdaptedResult("");
    setAdaptOriginal("");
    setShowCompareAll(false);
  };

  const switchMode = (newMode: Mode, prefillInput?: string) => {
    if (isStreaming) return;
    setMode(newMode);
    setRawText("");
    setInput(prefillInput || "");
    resetModeState();
  };

  const toggleFocusArea = (id: string) => {
    setOptimizeFocusAreas((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = useCallback(() => {
    if (mode === "adapt") {
      // Client-side adaptation — instant
      const result = adapters[adaptPlatform](input);
      setAdaptOriginal(input);
      setAdaptedResult(result);
      return;
    }

    if (mode === "optimize") setOriginalPrompt(input);
    setRawText("");
    setIsStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    const payload: Record<string, unknown> = { mode, input };
    if (mode === "generate") {
      if (generateContext.trim()) payload.context = generateContext.trim();
      if (generatePlatform !== "Any platform") payload.targetPlatform = generatePlatform;
    }
    if (mode === "optimize") {
      if (optimizeAiTool.trim()) payload.aiTool = optimizeAiTool.trim();
      if (optimizeGoal.trim()) payload.goal = optimizeGoal.trim();
      if (optimizeFocusAreas.length > 0) payload.focusAreas = optimizeFocusAreas;
    }

    streamPrompt(
      payload,
      (delta) => setRawText((prev) => prev + delta),
      () => setIsStreaming(false),
      (err) => {
        setIsStreaming(false);
        toast({ title: "Processing failed", description: err, variant: "destructive" });
      },
      ctrl.signal,
    );
  }, [mode, input, generateContext, generatePlatform, optimizeAiTool, optimizeGoal, optimizeFocusAreas, adaptPlatform]);

  const handleLoadGenerateExample = () => {
    setInput("Create a blog post outline about AI adoption challenges for enterprise CTOs");
    setGenerateContext("Professional tone, focus on practical solutions, include real-world examples");
    setGeneratePlatform("Any platform");
    toast({ title: "Example loaded", description: "See how to describe what you want effectively." });
  };

  const handleLoadOptimizeExample = () => {
    setInput("Write me a marketing email");
    setOptimizeAiTool("ChatGPT");
    setOptimizeGoal("Generate marketing copy for a SaaS product launch");
    setOptimizeFocusAreas(["clarity", "specificity"]);
    toast({ title: "Example loaded", description: "A typical vague prompt ready for optimisation." });
  };

  const handleLoadAdaptExample = () => {
    setInput("Explain blockchain to a non-technical person");
    setAdaptPlatform("ChatGPT");
    toast({ title: "Example loaded", description: "Try adapting this for different platforms." });
  };

  const extractPromptText = (): string => {
    if (mode === "adapt" && adaptedResult) return adaptedResult;
    if (!promptSection) return rawText;
    return promptSection.content.replace(/^```[\w]*\n?/gm, "").replace(/\n?```$/gm, "").trim();
  };

  const handleOptimiseFurther = () => {
    const promptText = extractPromptText();
    switchMode("optimize", promptText);
  };

  const handleAdaptFor = () => {
    const promptText = extractPromptText();
    switchMode("adapt", promptText);
  };

  const handleDownload = () => {
    const content = `# Prompt Engineer — ${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode\n\nGenerated: ${new Date().toISOString()}\n\n${mode === "adapt" ? adaptedResult : rawText}`;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prompt-${mode}-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyAll = async () => {
    const text = mode === "adapt" ? adaptedResult : rawText;
    await navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Full result copied to clipboard." });
  };

  const handleStartOver = () => {
    abortRef.current?.abort();
    setRawText("");
    setInput("");
    setOriginalPrompt("");
    setAdaptedResult("");
    setAdaptOriginal("");
    setShowCompareAll(false);
    resetModeState();
  };

  const handleTryDifferentPlatform = () => {
    // Keep the original prompt, clear result
    setInput(adaptOriginal);
    setAdaptedResult("");
    setAdaptOriginal("");
    setShowCompareAll(false);
  };

  const buttonLabels: Record<Mode, string> = {
    generate: "Generate prompt",
    optimize: "Optimise prompt",
    adapt: "Adapt prompt",
  };

  const minChars = mode === "optimize" ? 30 : 20;

  const hasAdaptResult = mode === "adapt" && !!adaptedResult;
  const hasStreamResult = !isStreaming && sections.length > 0;
  const hasResult = hasAdaptResult || hasStreamResult;
  const showInputForm = mode === "adapt" ? !adaptedResult : !rawText && !isStreaming;

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

              <p className="text-xs text-muted-foreground">
                {modes.find((m) => m.id === mode)?.desc}
              </p>

              {/* ═══ INPUT FORM ═══ */}
              {showInputForm && (
                <div className="space-y-4">
                  {/* Main textarea */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {mode === "generate" && "What do you want the AI to do?"}
                      {mode === "optimize" && "Your prompt"}
                      {mode === "adapt" && "Your prompt"}
                    </label>
                    <Textarea
                      value={input}
                      onChange={(e) => {
                        if (mode === "optimize" && e.target.value.length > 10000) return;
                        setInput(e.target.value);
                      }}
                      placeholder={placeholders[mode]}
                      className="min-h-[140px] bg-secondary/30 border-border/40 focus-visible:ring-accent"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground/50">
                      <span>
                        {input.length}{mode === "optimize" ? " / 10,000" : ""} characters
                      </span>
                      <span>
                        Minimum {minChars} characters
                        {!isStreaming && <span className="hidden sm:inline"> · ⌘/Ctrl+Enter to submit</span>}
                      </span>
                    </div>
                  </div>

                  {/* ── Generate mode extras ── */}
                  {mode === "generate" && (
                    <>
                      <button
                        onClick={handleLoadGenerateExample}
                        className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline underline-offset-4"
                      >
                        <Lightbulb className="h-3.5 w-3.5" />
                        See example
                      </button>

                      <Collapsible>
                        <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                          <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]:rotate-180" />
                          Add more context
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="space-y-4 pt-4">
                            <div className="space-y-1.5">
                              <label className="text-sm font-medium">Additional details</label>
                              <Textarea
                                value={generateContext}
                                onChange={(e) => setGenerateContext(e.target.value)}
                                placeholder="e.g., Professional tone, focus on ROI, include social proof"
                                className="min-h-[80px] bg-secondary/30 border-border/40 focus-visible:ring-accent"
                              />
                              <p className="text-xs text-muted-foreground/50">The more context you provide, the better the prompt</p>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-sm font-medium">Target AI platform</label>
                              <div className="flex flex-wrap gap-2">
                                {platformOptions.map((p) => (
                                  <button
                                    key={p}
                                    onClick={() => setGeneratePlatform(p)}
                                    className={cn(
                                      "px-3 py-1.5 text-xs rounded-sm border transition-colors",
                                      generatePlatform === p
                                        ? "bg-accent/10 border-accent/40 text-accent font-medium"
                                        : "border-border/30 text-muted-foreground hover:text-foreground hover:border-border/60"
                                    )}
                                  >
                                    {p}
                                  </button>
                                ))}
                              </div>
                              <p className="text-xs text-muted-foreground/50">Optimises for platform-specific best practices</p>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </>
                  )}

                  {/* ── Optimize mode extras ── */}
                  {mode === "optimize" && (
                    <>
                      <button
                        onClick={handleLoadOptimizeExample}
                        className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline underline-offset-4"
                      >
                        <Lightbulb className="h-3.5 w-3.5" />
                        See example
                      </button>

                      <Collapsible>
                        <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                          <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]:rotate-180" />
                          Add context
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="space-y-4 pt-4">
                            <div className="space-y-1.5">
                              <label className="text-sm font-medium">What AI tool will you use this with?</label>
                              <Input
                                value={optimizeAiTool}
                                onChange={(e) => setOptimizeAiTool(e.target.value)}
                                placeholder="e.g., ChatGPT, Claude, Gemini"
                                className="bg-secondary/30 border-border/40 focus-visible:ring-accent"
                              />
                              <p className="text-xs text-muted-foreground/50">Helps tailor optimisation to platform best practices</p>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-sm font-medium">What's your goal?</label>
                              <Textarea
                                value={optimizeGoal}
                                onChange={(e) => setOptimizeGoal(e.target.value)}
                                placeholder="e.g., Generate marketing copy, analyse data, create strategy"
                                className="min-h-[70px] bg-secondary/30 border-border/40 focus-visible:ring-accent"
                              />
                              <p className="text-xs text-muted-foreground/50">Knowing your objective helps optimise for results</p>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium">Focus areas</label>
                              <div className="space-y-2">
                                {focusAreaOptions.map((area) => (
                                  <label
                                    key={area.id}
                                    className="flex items-start gap-2.5 cursor-pointer group"
                                  >
                                    <div
                                      className={cn(
                                        "mt-0.5 w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 transition-colors",
                                        optimizeFocusAreas.includes(area.id)
                                          ? "bg-accent border-accent text-accent-foreground"
                                          : "border-border/60 group-hover:border-muted-foreground"
                                      )}
                                      onClick={() => toggleFocusArea(area.id)}
                                    >
                                      {optimizeFocusAreas.includes(area.id) && <Check className="h-3 w-3" />}
                                    </div>
                                    <div onClick={() => toggleFocusArea(area.id)}>
                                      <span className="text-sm text-foreground">{area.label}</span>
                                      <span className="text-xs text-muted-foreground/60 ml-1.5">— {area.desc}</span>
                                    </div>
                                  </label>
                                ))}
                              </div>
                              <p className="text-xs text-muted-foreground/50">Leave blank to optimise all aspects</p>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </>
                  )}

                  {/* ── Adapt mode: platform cards + example ── */}
                  {mode === "adapt" && (
                    <>
                      <button
                        onClick={handleLoadAdaptExample}
                        className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline underline-offset-4"
                      >
                        <Lightbulb className="h-3.5 w-3.5" />
                        See example
                      </button>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Target platform</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {platformCards.map((p) => (
                            <button
                              key={p.id}
                              onClick={() => setAdaptPlatform(p.id)}
                              className={cn(
                                "relative flex flex-col items-start gap-2 p-4 rounded-sm border transition-all text-left",
                                adaptPlatform === p.id
                                  ? "border-accent/50 bg-accent/5 ring-1 ring-accent/20"
                                  : "border-border/30 hover:border-border/60 hover:bg-secondary/20"
                              )}
                            >
                              <div className="flex items-center gap-2 w-full">
                                <div className={cn(
                                  "transition-colors",
                                  adaptPlatform === p.id ? "text-accent" : "text-muted-foreground"
                                )}>
                                  {p.icon}
                                </div>
                                <span className={cn(
                                  "text-sm font-medium",
                                  adaptPlatform === p.id ? "text-foreground" : "text-muted-foreground"
                                )}>
                                  {p.id}
                                </span>
                                <span className={cn(
                                  "ml-auto text-[10px] px-1.5 py-0.5 rounded-full border",
                                  adaptPlatform === p.id
                                    ? "bg-accent/10 text-accent border-accent/20"
                                    : "bg-secondary/50 text-muted-foreground/60 border-border/20"
                                )}>
                                  {p.badge}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground/70">{p.description}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Submit */}
                  <Button onClick={handleSubmit} disabled={!canSubmit} variant="hero" size="default">
                    {buttonLabels[mode]}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}

              {/* ═══ LOADING ═══ */}
              {isStreaming && rawText.length === 0 && <LoadingPhases phases={loadingPhasesMap[mode]} />}

              {/* Streaming pre-sections */}
              {isStreaming && rawText.length > 0 && sections.length === 0 && (
                <div className="border border-border/30 bg-card rounded-sm p-4">
                  <div className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed">
                    {rawText}
                    <span className="inline-block w-0.5 h-4 bg-accent animate-pulse ml-0.5 align-text-bottom" />
                  </div>
                </div>
              )}

              {/* ═══ RESULTS ═══ */}

              {/* Adapt mode: side-by-side comparison */}
              {hasAdaptResult && !showCompareAll && (
                <>
                  <SideBySideComparison
                    original={adaptOriginal}
                    adapted={adaptedResult}
                    label="Adapted"
                    badgeText={`Optimised for ${adaptPlatform}`}
                  />

                  {/* Platform-specific tip */}
                  <div className="flex items-start gap-2 p-3 bg-secondary/30 border border-border/20 rounded-sm">
                    <Lightbulb className="h-3.5 w-3.5 shrink-0 mt-0.5 text-accent/70" />
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground/80">{adaptPlatform} tip:</span>{" "}
                      {platformCards.find((p) => p.id === adaptPlatform)?.tip}
                    </p>
                  </div>
                </>
              )}

              {/* Adapt mode: compare all platforms */}
              {hasAdaptResult && showCompareAll && (
                <CompareAllPlatforms original={adaptOriginal} />
              )}

              {/* Side-by-side for optimize mode */}
              {mode === "optimize" && promptSection && originalPrompt && !isStreaming && (
                <SideBySideComparison
                  original={originalPrompt}
                  adapted={extractPromptText()}
                />
              )}

              {/* Prompt section for generate mode */}
              {mode === "generate" && promptSection && (
                <SectionCard section={promptSection} defaultOpen />
              )}

              {/* Other sections (generate/optimize) */}
              {mode !== "adapt" && otherSections.map((s, i) => (
                <SectionCard
                  key={s.id}
                  section={s}
                  defaultOpen={
                    mode === "optimize" ? s.id.includes("key-improvement") : i === 0 && !promptSection
                  }
                />
              ))}

              {/* Streaming indicator */}
              {isStreaming && sections.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  Processing...
                </div>
              )}

              {/* ═══ RESULT ACTIONS ═══ */}
              {hasResult && (
                <div className="space-y-5 pt-4 border-t border-border/20">
                  {/* Primary actions */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="hero"
                      size="sm"
                      onClick={async () => {
                        await navigator.clipboard.writeText(extractPromptText());
                        toast({ title: "Prompt copied!", description: "Ready to paste into your AI tool." });
                      }}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1.5" />
                      Copy {mode === "adapt" ? "adapted" : mode === "optimize" ? "optimised" : ""} prompt
                    </Button>
                    <SendToAiMenu
                      promptText={extractPromptText()}
                      defaultPlatform={mode === "adapt" ? adaptPlatform : undefined}
                    />
                  </div>

                  {/* Secondary actions */}
                  <div className="flex flex-wrap gap-3">
                    {mode !== "adapt" && (
                      <>
                        <Button variant="outline" size="sm" onClick={handleCopyAll}>
                          <Copy className="h-3.5 w-3.5 mr-1.5" />
                          Copy all
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDownload}>
                          <Download className="h-3.5 w-3.5 mr-1.5" />
                          Download .md
                        </Button>
                      </>
                    )}

                    {mode === "adapt" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCompareAll(!showCompareAll)}
                      >
                        <Layers className="h-3.5 w-3.5 mr-1.5" />
                        {showCompareAll ? "Single platform" : "Compare all platforms"}
                      </Button>
                    )}

                    <Button variant="ghost" size="sm" onClick={mode === "adapt" ? handleTryDifferentPlatform : handleStartOver}>
                      <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                      {mode === "adapt" ? "Try different platform" : mode === "optimize" ? "Optimise different prompt" : "Start over"}
                    </Button>

                    {mode === "adapt" && (
                      <Button variant="ghost" size="sm" onClick={handleStartOver}>
                        <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                        Adapt different prompt
                      </Button>
                    )}
                  </div>

                  {/* Cross-mode actions */}
                  <div className="flex flex-wrap gap-3 pt-1">
                    {mode === "optimize" && (
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => {
                          setOriginalPrompt(extractPromptText());
                          setInput(extractPromptText());
                          setRawText("");
                        }}
                        className="text-muted-foreground"
                      >
                        <Target className="h-3.5 w-3.5 mr-1.5" />
                        Optimise further
                      </Button>
                    )}
                    {mode !== "optimize" && (
                      <Button variant="ghost" size="sm" onClick={handleOptimiseFurther} className="text-muted-foreground">
                        <Target className="h-3.5 w-3.5 mr-1.5" />
                        Optimise further
                      </Button>
                    )}
                    {mode !== "adapt" && (
                      <Button variant="ghost" size="sm" onClick={handleAdaptFor} className="text-muted-foreground">
                        <Layers className="h-3.5 w-3.5 mr-1.5" />
                        Adapt for platform
                      </Button>
                    )}
                  </div>

                  {/* PromptAndGo upsell for adapt */}
                  {mode === "adapt" && (
                    <div className="flex items-start gap-2 p-3 bg-secondary/20 border border-border/10 rounded-sm">
                      <Sparkles className="h-3.5 w-3.5 shrink-0 mt-0.5 text-accent/50" />
                      <p className="text-xs text-muted-foreground/70">
                        Want all 11 platforms? PromptAndGo.ai includes: DeepSeek, Ideogram, GroqChat, Mistral, Llama-3, Nano Banana.{" "}
                        <a
                          href="https://promptandgo.ai"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline underline-offset-2 inline-flex items-center gap-1"
                        >
                          Explore PromptAndGo <ExternalLink className="h-3 w-3" />
                        </a>
                      </p>
                    </div>
                  )}
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
