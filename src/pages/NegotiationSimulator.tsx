import { useState, useCallback, useRef, useEffect } from "react";
import { SimulationProvider, SimulationLayout, useSimulation } from "@/components/simulation";
import { FormField } from "@/components/simulation/FormField";
import { ExampleScenario } from "@/components/simulation/ExampleScenario";
import { PrivacyNotice } from "@/components/simulation/PrivacyNotice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { SEO } from "@/components/SEO";
import { ArrowRight, ArrowLeft, Copy, Check, ChevronDown, RotateCcw, Download, Send, User, SlidersHorizontal, Handshake, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import type { ResultSection } from "@/components/simulation";

// ── Examples ──
const examples = [
  {
    id: "salary",
    title: "Salary Negotiation",
    description: "Negotiating compensation in a job offer.",
    values: {
      context: "Job offer for a Senior Product Manager role. Base salary offered: £95,000. I want £115,000 base + equity. The role is at a Series B startup with 150 employees.",
      yourRole: "Candidate (Senior Product Manager)",
      theirRole: "VP of Product (Hiring Manager)",
      stakes: "Career trajectory and compensation for next 3-5 years. This is my top-choice company but I have another offer at £108,000 base from a larger company.",
      yourObjectives: "Get base salary to £110-115k range, negotiate equity grant of 0.1-0.15%, and ensure annual review after 6 months. Walk-away point is £105k base if equity is strong.",
      theirObjectives: "Stay within budget (likely £95-110k range), close the hire quickly as the team needs this role filled, maintain internal equity with existing team members at similar level.",
      style: "strategic",
    },
  },
  {
    id: "contract",
    title: "Contract Renewal",
    description: "Client pushing back on price increase.",
    values: {
      context: "Annual contract renewal for a SaaS platform. Current price: £48k/year. Proposing 25% increase to £60k/year due to expanded features, increased usage, and 3 years of no price change. Client's company has grown 3x during our partnership.",
      yourRole: "Account Director",
      theirRole: "Head of Procurement",
      stakes: "£60k annual contract, 3-year client relationship, reference value. Client represents 15% of our enterprise ARR. Losing them would hurt but isn't existential.",
      yourObjectives: "Secure renewal at minimum £55k, ideally £60k. Lock in 2-year term. Get case study permission as part of the deal. Walk-away: £52k with 2-year commitment.",
      theirObjectives: "Keep costs flat or minimal increase. They're under budget pressure from CFO. May threaten to evaluate competitors but switching costs are high.",
      style: "competitive",
    },
  },
  {
    id: "partnership",
    title: "Partnership Terms",
    description: "Negotiating a strategic partnership agreement.",
    values: {
      context: "Strategic partnership between our AI analytics startup (50 people) and a large consulting firm (5,000 people). They want to white-label our product for their clients. Discussing revenue share, exclusivity, and IP terms.",
      yourRole: "CEO / Co-founder (startup)",
      theirRole: "Head of Strategic Partnerships (consulting firm)",
      stakes: "Potential £2M+ annual revenue channel. But exclusivity could lock us out of direct enterprise sales. IP terms could limit our product roadmap. This partnership could define our go-to-market for the next 3 years.",
      yourObjectives: "Non-exclusive deal with 70/30 revenue split in our favour. Retain all IP rights. Minimum revenue commitment of £500k in year 1. 1-year initial term with option to extend.",
      theirObjectives: "Exclusive or semi-exclusive rights for their sector. 50/50 or better revenue split. Influence over product roadmap for their clients. Multi-year lock-in.",
      style: "collaborative",
    },
  },
];

const fields = {
  step1: [
    {
      id: "context",
      label: "What's being negotiated?",
      type: "textarea" as const,
      placeholder: "e.g., Salary and equity in job offer, Contract terms with client, Partnership agreement terms",
      maxLength: 600,
      required: true,
    },
    {
      id: "yourRole",
      label: "Your role",
      type: "textarea" as const,
      placeholder: "e.g., Candidate, Vendor, Founder",
      maxLength: 200,
      required: true,
    },
    {
      id: "theirRole",
      label: "Their role",
      type: "textarea" as const,
      placeholder: "e.g., Hiring Manager, Procurement, Potential Partner",
      maxLength: 200,
      required: true,
    },
  ],
  step2: [
    {
      id: "stakes",
      label: "What's at stake?",
      type: "textarea" as const,
      placeholder: "e.g., Career opportunity, business relationship, financial terms, long-term partnership",
      tooltip: "Why does this negotiation matter?",
      maxLength: 500,
      required: true,
    },
    {
      id: "yourObjectives",
      label: "Your objectives",
      type: "textarea" as const,
      placeholder: "What do you want to achieve? What's your BATNA (best alternative)?",
      tooltip: "Be specific about targets and walk-away points",
      maxLength: 500,
      required: true,
    },
    {
      id: "theirObjectives",
      label: "Their likely objectives",
      type: "textarea" as const,
      placeholder: "What do they want? What constraints might they have?",
      tooltip: "Understanding their position makes the simulation more realistic",
      maxLength: 500,
    },
    {
      id: "style",
      label: "Negotiation style",
      type: "select" as const,
      placeholder: "Select style...",
      tooltip: "How they'll approach this negotiation",
      required: true,
      options: [
        { value: "collaborative", label: "Collaborative (win-win seeking)" },
        { value: "competitive", label: "Competitive (firm on positions)" },
        { value: "strategic", label: "Strategic (calculated, patient)" },
        { value: "time-pressured", label: "Time-pressured (urgency)" },
        { value: "defensive", label: "Defensive (protecting current position)" },
      ],
    },
  ],
};

const howItWorks = [
  "You set up a negotiation scenario — context, parties, stakes, and objectives.",
  "The AI plays the other party with realistic behaviour including counter-asks, pressure tactics, and strategic delays.",
  "Both parties have competing interests — concessions must be earned through good arguments, data, or trade-offs.",
  "When you're done, get coaching on tactics, leverage use, and alternative approaches.",
];

// ── Types ──
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface SetupData {
  context: string;
  yourRole: string;
  theirRole: string;
  stakes: string;
  yourObjectives: string;
  theirObjectives: string;
  style: string;
}

// ── SSE helper ──
const API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/negotiation-analysis`;

async function streamChat(
  body: Record<string, unknown>,
  onDelta: (text: string) => void,
  onDone: () => void,
  onError: (msg: string) => void,
  signal?: AbortSignal,
) {
  const resp = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify(body),
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
function parseSections(text: string): ResultSection[] {
  const sections: ResultSection[] = [];
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

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button onClick={copy} className="text-muted-foreground hover:text-foreground transition-colors p-1" aria-label="Copy">
      {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function SectionCard({ section, defaultOpen }: { section: ResultSection; defaultOpen?: boolean }) {
  const borderColor = section.id.includes("worked") ? "border-l-emerald-500/60"
    : section.id.includes("didn") ? "border-l-orange-500/60"
    : section.id.includes("tactical") ? "border-l-blue-500/60"
    : section.id.includes("alternative") ? "border-l-amber-500/60"
    : section.id.includes("leverage") ? "border-l-accent/60"
    : "";
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <div className={cn("border border-border/30 bg-card rounded-sm overflow-hidden", borderColor && `border-l-2 ${borderColor}`)}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left hover:bg-secondary/30 transition-colors group">
          <h3 className="text-sm font-medium">{section.title}</h3>
          <div className="flex items-center gap-2">
            <CopyBtn text={section.content} />
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

// ── Main Content ──
function NegotiationContent() {
  const { phase, formData, setFormValue, setPhase, currentStep, nextStep, prevStep, reset } = useSimulation();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [setup, setSetup] = useState<SetupData | null>(null);
  const [showContext, setShowContext] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [reflectionRaw, setReflectionRaw] = useState("");
  const [isReflecting, setIsReflecting] = useState(false);
  const [personalNotes, setPersonalNotes] = useState(() => {
    try { return localStorage.getItem("simulate-negotiation-notes") || ""; } catch { return ""; }
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const turnCount = messages.filter(m => m.role === "user").length;
  const reflectionSections = parseSections(reflectionRaw);

  const canProceedStep1 = (formData.context?.trim()?.length ?? 0) >= 20
    && (formData.yourRole?.trim()?.length ?? 0) > 0
    && (formData.theirRole?.trim()?.length ?? 0) > 0;
  const canSubmit = canProceedStep1 && !!formData.stakes?.trim() && !!formData.yourObjectives?.trim() && !!formData.style;

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isStreaming]);
  useEffect(() => { if (phase === "active" && !isPaused) inputRef.current?.focus(); }, [phase, isPaused]);

  const handleStart = useCallback(() => {
    const s: SetupData = {
      context: formData.context || "",
      yourRole: formData.yourRole || "",
      theirRole: formData.theirRole || "",
      stakes: formData.stakes || "",
      yourObjectives: formData.yourObjectives || "",
      theirObjectives: formData.theirObjectives || "",
      style: formData.style || "collaborative",
    };
    setSetup(s);
    setMessages([]);
    setReflectionRaw("");
    setPhase("active");
  }, [formData, setPhase]);

  const sendMessage = useCallback(async () => {
    if (!inputValue.trim() || isStreaming || !setup) return;
    const userMsg: ChatMessage = { role: "user", content: inputValue.trim(), timestamp: new Date() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInputValue("");
    setIsStreaming(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setMessages(prev => [...prev, { role: "assistant", content: "", timestamp: new Date() }]);
    let assistantContent = "";

    await streamChat(
      { mode: "chat", setup, messages: updated.map(m => ({ role: m.role, content: m.content })) },
      (delta) => {
        assistantContent += delta;
        setMessages(prev => {
          const copy = [...prev];
          copy[copy.length - 1] = { ...copy[copy.length - 1], content: assistantContent };
          return copy;
        });
      },
      () => { setIsStreaming(false); inputRef.current?.focus(); },
      (err) => {
        setIsStreaming(false);
        setMessages(prev => prev.filter((_, i) => i < prev.length - 1));
        toast({ title: "Response failed", description: err, variant: "destructive" });
      },
      ctrl.signal,
    );
  }, [inputValue, isStreaming, setup, messages]);

  const handleEndReflect = useCallback(() => {
    if (!setup || messages.length === 0) return;
    setPhase("reflection");
    setIsReflecting(true);
    setReflectionRaw("");
    const transcript = messages.map(m => `${m.role === "user" ? setup.yourRole : setup.theirRole}: ${m.content}`).join("\n\n");
    streamChat(
      { mode: "reflection", setup, negotiationTranscript: transcript },
      (delta) => setReflectionRaw(prev => prev + delta),
      () => setIsReflecting(false),
      (err) => { setIsReflecting(false); toast({ title: "Reflection failed", description: err, variant: "destructive" }); },
    );
  }, [setup, messages, setPhase]);

  const handleNotesChange = (v: string) => {
    setPersonalNotes(v);
    try { localStorage.setItem("simulate-negotiation-notes", v); } catch { }
  };

  const handleDownload = () => {
    if (!setup) return;
    const transcript = messages.map(m => `[${m.role === "user" ? setup.yourRole : setup.theirRole}]: ${m.content}`).join("\n\n");
    let content = `# Negotiation Simulator\n\nGenerated: ${new Date().toISOString()}\n\n## SCENARIO\n\nContext: ${setup.context}\nYour role: ${setup.yourRole}\nTheir role: ${setup.theirRole}\nStakes: ${setup.stakes}\nYour objectives: ${setup.yourObjectives}\nTheir objectives: ${setup.theirObjectives}\nStyle: ${setup.style}\n\n## TRANSCRIPT\n\n${transcript}`;
    if (reflectionRaw) content += `\n\n---\n\n${reflectionRaw}`;
    if (personalNotes) content += `\n\n---\n\n## PERSONAL NOTES\n\n${personalNotes}`;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `negotiation-sim-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleStartOver = () => {
    abortRef.current?.abort();
    setMessages([]);
    setSetup(null);
    setReflectionRaw("");
    setPersonalNotes("");
    setIsPaused(false);
    try { localStorage.removeItem("simulate-negotiation-notes"); } catch { }
    reset();
  };

  const handleRestart = () => {
    abortRef.current?.abort();
    setMessages([]);
    setReflectionRaw("");
    setIsStreaming(false);
    setIsPaused(false);
    setPhase("active");
    inputRef.current?.focus();
  };

  // ── SETUP ──
  if (phase === "setup") {
    return (
      <div className="space-y-6">
        <ExampleScenario examples={examples} />
        {currentStep === 0 && (
          <>
            <p className="text-xs text-muted-foreground">Step 1 of 2 — Negotiation Context</p>
            {fields.step1.map(f => (
              <FormField key={f.id} config={f} value={formData[f.id] || ""} onChange={v => setFormValue(f.id, v)} />
            ))}
            <div className="pt-4">
              <Button onClick={nextStep} disabled={!canProceedStep1} variant="hero">
                Continue <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </>
        )}
        {currentStep === 1 && (
          <>
            <p className="text-xs text-muted-foreground">Step 2 of 2 — Stakes & Objectives</p>
            {fields.step2.map(f => (
              <FormField key={f.id} config={f} value={formData[f.id] || ""} onChange={v => setFormValue(f.id, v)} />
            ))}
            <PrivacyNotice className="mt-4" />
            <div className="flex gap-3 pt-4">
              <Button onClick={prevStep} variant="outline"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
              <Button onClick={handleStart} disabled={!canSubmit} variant="hero">
                Start negotiation <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }

  // ── ACTIVE (Chat) ──
  if (phase === "active" && setup) {
    return (
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Handshake className="h-3 w-3" /> Round {turnCount}
            </span>
            <button onClick={() => setShowContext(!showContext)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <SlidersHorizontal className="h-3 w-3" /> {showContext ? "Hide context" : "Context"}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsPaused(!isPaused)} className="text-xs text-muted-foreground h-7">
              {isPaused ? <Play className="h-3 w-3 mr-1" /> : <Pause className="h-3 w-3 mr-1" />}
              {isPaused ? "Resume" : "Pause & strategise"}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleRestart} className="text-xs text-muted-foreground h-7">
              <RotateCcw className="h-3 w-3 mr-1" /> Restart
            </Button>
            <Button variant="outline" size="sm" onClick={handleEndReflect} disabled={messages.length === 0} className="text-xs h-7">
              End negotiation
            </Button>
          </div>
        </div>

        {/* Context */}
        {showContext && (
          <div className="border border-border/30 bg-secondary/20 rounded-sm p-4 text-xs text-muted-foreground space-y-1.5">
            <p><span className="text-foreground font-medium">Context:</span> {setup.context}</p>
            <p><span className="text-foreground font-medium">You:</span> {setup.yourRole}</p>
            <p><span className="text-foreground font-medium">Them:</span> {setup.theirRole}</p>
            <p><span className="text-foreground font-medium">Your objectives:</span> {setup.yourObjectives}</p>
          </div>
        )}

        {/* Pause overlay */}
        {isPaused && (
          <div className="border border-accent/30 bg-accent/5 rounded-sm p-4 space-y-2">
            <p className="text-sm font-medium text-accent">⏸ Paused — Strategise</p>
            <p className="text-xs text-muted-foreground">Take a moment to think about your next move. Review the context, consider your leverage, and plan your approach.</p>
            <p className="text-xs text-muted-foreground">Your objectives: <span className="text-foreground">{setup.yourObjectives}</span></p>
          </div>
        )}

        {/* Chat */}
        <ScrollArea className="h-[400px] border border-border/30 bg-card rounded-sm">
          <div className="p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-12">
                <Handshake className="h-8 w-8 mx-auto mb-3 text-muted-foreground/30" />
                <p>Open the negotiation. You speak first.</p>
                <p className="text-xs mt-1">They have their own objectives — concessions must be earned.</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                )}
                <div className={cn(
                  "max-w-[75%] rounded-lg px-4 py-2.5 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-accent/20 text-foreground border border-accent/30"
                    : "bg-secondary/50 text-foreground border border-border/30"
                )}>
                  {msg.content}
                  {msg.role === "assistant" && msg.content === "" && isStreaming && (
                    <span className="inline-flex gap-1 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-pulse" />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-pulse [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-pulse [animation-delay:300ms]" />
                    </span>
                  )}
                  {msg.role === "assistant" && msg.content && isStreaming && i === messages.length - 1 && (
                    <span className="inline-block w-0.5 h-4 bg-accent animate-pulse ml-0.5 align-text-bottom" />
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="h-3.5 w-3.5 text-accent" />
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={isPaused ? "Negotiation paused — click Resume to continue" : "Make your offer or respond..."}
            disabled={isStreaming || isPaused}
            className="flex-1 bg-secondary/30 border-border/40 focus-visible:ring-accent"
          />
          <Button onClick={sendMessage} disabled={!inputValue.trim() || isStreaming || isPaused} variant="hero" size="icon" className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground/50 text-center">
          Press Enter to send · Use "Pause & strategise" to think · Click "End negotiation" for coaching
        </p>
      </div>
    );
  }

  // ── REFLECTION ──
  return (
    <div className="space-y-6">
      {isReflecting && reflectionSections.length === 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Analysing negotiation...</p>
          <p className="text-xs text-muted-foreground/50">Reviewing {turnCount} rounds</p>
          {[1, 2, 3].map(i => (
            <div key={i} className="border border-border/30 bg-card rounded-sm p-4 space-y-3">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          ))}
        </div>
      )}

      {isReflecting && reflectionRaw.length > 0 && reflectionSections.length === 0 && (
        <div className="border border-border/30 bg-card rounded-sm p-4">
          <div className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed">
            {reflectionRaw}
            <span className="inline-block w-0.5 h-4 bg-accent animate-pulse ml-0.5 align-text-bottom" />
          </div>
        </div>
      )}

      {reflectionSections.map((s, i) => (
        <SectionCard key={s.id} section={s} defaultOpen={i < 2} />
      ))}

      {isReflecting && reflectionSections.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Analysing...
        </div>
      )}

      {!isReflecting && reflectionSections.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-border/20">
          <div>
            <h3 className="text-base font-medium mb-1">Your reflection</h3>
            <p className="text-xs text-muted-foreground">Private — saved in your browser only.</p>
          </div>
          <Textarea
            value={personalNotes}
            onChange={e => handleNotesChange(e.target.value)}
            placeholder="What did you learn about your negotiation approach? What would you do differently?"
            className="min-h-[100px] bg-secondary/30 border-border/40 focus-visible:ring-accent"
          />
        </div>
      )}

      {!isReflecting && reflectionSections.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-border/20">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleRestart}>
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Try different strategy
            </Button>
            <Button variant="outline" size="sm" onClick={handleStartOver}>
              <Handshake className="h-3.5 w-3.5 mr-1.5" /> New negotiation
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-3.5 w-3.5 mr-1.5" /> Download transcript
            </Button>
          </div>
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(reflectionRaw);
              toast({ title: "Copied", description: "Full analysis copied." });
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <Copy className="h-3 w-3" /> Copy all
          </button>
        </div>
      )}
    </div>
  );
}

// ── Page wrapper ──
export default function NegotiationSimulator() {
  return (
    <>
      <SEO
        canonical="/tools/evaluate/negotiation"
        title="Negotiation Simulator | EDGE Evaluate"
        description="Practice negotiation dynamics with realistic AI behavior. AI uses counter-asks, delays, and pressure tactics."
        keywords="negotiation simulator, negotiation practice, AI negotiation, salary negotiation, contract negotiation"
      />
      <SimulationProvider roomId="negotiation" totalSteps={2}>
        <SimulationLayout
          pillar="Evaluate"
          pillarPath="/tools/evaluate"
          roomTitle="Negotiation Simulator"
          roomDescription="Rehearse negotiation dynamics before real stakes. The AI plays a realistic counterparty with their own objectives, constraints, and tactics."
          howItWorks={howItWorks}
        >
          <NegotiationContent />
        </SimulationLayout>
      </SimulationProvider>
    </>
  );
}
