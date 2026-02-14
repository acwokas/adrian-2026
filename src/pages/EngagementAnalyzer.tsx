import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { PrivacyNotice } from "@/components/simulation/PrivacyNotice";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { BarChart3, ChevronDown, Copy, Download, RefreshCw, Loader2, Check, ShieldCheck, Sparkles, FileJson, MessageSquare, AlertTriangle, TrendingUp, ListChecks, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "define-engagement-analysis-latest";

type Phase = "input" | "loading" | "results";

const PROFILE_KEY = "define-brand-profile-latest";

const platformOptions = ["LinkedIn", "X", "Reddit", "Email/Newsletter", "Other"];

const loadingPhases = [
  "Analysing engagement patterns...",
  "Identifying interest signals...",
  "Categorising feedback...",
  "Generating recommendations...",
];

function copyToClipboard(text: string, label?: string) {
  navigator.clipboard.writeText(text).then(() => toast.success(label ? `${label} copied` : "Copied"));
}

// Parse analysis into sections
interface AnalysisSection {
  key: string;
  title: string;
  content: string;
}

function parseAnalysis(text: string): AnalysisSection[] {
  const sectionMap: Record<string, string> = {
    "INTEREST SIGNALS": "signals",
    "COMMON OBJECTIONS & CONCERNS": "objections",
    "COMMON OBJECTIONS": "objections",
    "TOP-PERFORMING CONTENT": "performing",
    "TOP PERFORMING CONTENT": "performing",
    "PRIORITISED RECOMMENDATIONS": "recommendations",
    "PRIORITIZED RECOMMENDATIONS": "recommendations",
  };

  const regex = /## (INTEREST SIGNALS|COMMON OBJECTIONS(?:\s*&\s*CONCERNS)?|TOP[- ]PERFORMING CONTENT|PRIORITI[SZ]ED RECOMMENDATIONS)\s*\n/gi;
  const matches = [...text.matchAll(regex)];
  const sections: AnalysisSection[] = [];

  matches.forEach((match, i) => {
    const rawTitle = match[1].toUpperCase();
    const startIdx = match.index! + match[0].length;
    const endIdx = i + 1 < matches.length ? matches[i + 1].index! : text.length;
    const content = text.slice(startIdx, endIdx).trim();
    const key = sectionMap[rawTitle] || rawTitle.toLowerCase().replace(/\s+/g, "-");
    sections.push({ key, title: rawTitle, content });
  });

  return sections;
}

function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: JSX.Element[] = [];

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) { elements.push(<br key={i} />); return; }
    if (trimmed.startsWith("### ")) {
      elements.push(<h3 key={i} className="text-foreground text-base font-semibold mt-4 mb-2">{trimmed.slice(4)}</h3>);
      return;
    }
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const text = trimmed.slice(2);
      const html = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>');
      elements.push(
        <div key={i} className="flex gap-2 items-start py-0.5">
          <span className="h-1 w-1 rounded-full bg-accent mt-2 shrink-0" />
          <span dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      );
      return;
    }
    if (/^\d+\.\s/.test(trimmed)) {
      const text = trimmed.replace(/^\d+\.\s*/, "");
      const html = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>');
      elements.push(<p key={i} dangerouslySetInnerHTML={{ __html: html }} className="py-0.5" />);
      return;
    }
    const html = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>');
    elements.push(<p key={i} dangerouslySetInnerHTML={{ __html: html }} />);
  });

  return <>{elements}</>;
}

const sectionConfig: Record<string, { icon: typeof BarChart3; accentClass: string; borderColor: string }> = {
  signals: { icon: TrendingUp, accentClass: "text-accent", borderColor: "border-accent/30 bg-accent/5" },
  objections: { icon: AlertTriangle, accentClass: "text-orange-400", borderColor: "border-orange-400/30 bg-orange-400/5" },
  performing: { icon: BarChart3, accentClass: "text-green-400", borderColor: "border-green-400/30 bg-green-400/5" },
  recommendations: { icon: ListChecks, accentClass: "text-blue-400", borderColor: "border-blue-400/30 bg-blue-400/5" },
};

function SectionCard({ section, onGenerateResponses, isGeneratingResponses }: {
  section: AnalysisSection;
  onGenerateResponses?: () => void;
  isGeneratingResponses?: boolean;
}) {
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const config = sectionConfig[section.key] || sectionConfig.signals;
  const Icon = config.icon;

  const handleCopy = () => {
    copyToClipboard(section.content, section.title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("border rounded-sm overflow-hidden", config.borderColor)}>
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="p-5 flex items-center justify-between">
          <CollapsibleTrigger className="flex items-center gap-2 text-left flex-1 group">
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform shrink-0", open && "rotate-180")} />
            <Icon className={cn("h-4 w-4 shrink-0", config.accentClass)} />
            <h3 className="text-base font-semibold">{section.title}</h3>
          </CollapsibleTrigger>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy} title="Copy">
              {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
            {section.key === "objections" && onGenerateResponses && (
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onGenerateResponses} disabled={isGeneratingResponses}>
                {isGeneratingResponses ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <MessageSquare className="h-3 w-3 mr-1" />}
                Response templates
              </Button>
            )}
          </div>
        </div>
        <CollapsibleContent>
          <div className="px-5 pb-5 prose prose-sm prose-invert max-w-none text-muted-foreground leading-relaxed">
            <MarkdownContent content={section.content} />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
}

// SSE stream reader helper
async function readStream(
  resp: Response,
  onDelta: (text: string) => void,
): Promise<string> {
  if (!resp.body) throw new Error("No response stream");
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let accumulated = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") break;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) { accumulated += content; onDelta(accumulated); }
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  // Flush remaining
  if (textBuffer.trim()) {
    for (let raw of textBuffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (raw.startsWith(":") || raw.trim() === "") continue;
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) accumulated += content;
      } catch {}
    }
  }

  return accumulated;
}

export default function EngagementAnalyzer() {
  const [phase, setPhase] = useState<Phase>("input");

  // Input state
  const [engagementData, setEngagementData] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [timePeriod, setTimePeriod] = useState("");
  const [postTopics, setPostTopics] = useState("");
  const [specificQuestions, setSpecificQuestions] = useState("");
  const [showContext, setShowContext] = useState(false);
  const [useProfile, setUseProfile] = useState(false);

  // Profile state
  const [profileData, setProfileData] = useState<{ formData: Record<string, string>; profile: string } | null>(null);

  // Results state
  const [analysisText, setAnalysisText] = useState("");
  const [generatedAt, setGeneratedAt] = useState("");
  const [loadingPhaseIdx, setLoadingPhaseIdx] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [responseTemplates, setResponseTemplates] = useState("");
  const [isGeneratingResponses, setIsGeneratingResponses] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Load existing analysis + check profile
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.analysisText && parsed.generatedAt) {
          setAnalysisText(parsed.analysisText);
          setGeneratedAt(parsed.generatedAt);
          setPhase("results");
        }
      }
    } catch {}
    try {
      const profile = localStorage.getItem(PROFILE_KEY);
      if (profile) {
        const parsed = JSON.parse(profile);
        if (parsed?.formData?.productName) {
          setProfileData(parsed);
        }
      }
    } catch {}
  }, []);

  const togglePlatform = (p: string) => {
    setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const isInputValid = engagementData.length >= 100;

  const streamAnalyse = async () => {
    setPhase("loading");
    setLoadingPhaseIdx(0);
    setLoadingProgress(0);
    setAnalysisText("");
    setResponseTemplates("");

    const controller = new AbortController();
    abortRef.current = controller;

    const phaseInterval = setInterval(() => {
      setLoadingPhaseIdx(prev => Math.min(prev + 1, loadingPhases.length - 1));
    }, 8000);
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => Math.min(prev + 1, 95));
    }, 400);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/engagement-analysis`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          engagementData,
          context: {
            platforms: selectedPlatforms.length > 0 ? selectedPlatforms : undefined,
            timePeriod: timePeriod || undefined,
            postTopics: postTopics || undefined,
            specificQuestions: specificQuestions || undefined,
            ...(useProfile && profileData ? {
              brandProfile: {
                product: profileData.formData.productName,
                description: profileData.formData.productDescription,
                audience: profileData.formData.audienceRole,
                pillars: profileData.profile.match(/## CONTENT PILLARS[\s\S]*$/i)?.[0]?.slice(0, 500) || "",
                tone: profileData.formData.tones,
              }
            } : {}),
          },
        }),
        signal: controller.signal,
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({ error: "Analysis failed" }));
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      const accumulated = await readStream(resp, (text) => setAnalysisText(text));

      const now = new Date().toISOString();
      setAnalysisText(accumulated);
      setGeneratedAt(now);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ analysisText: accumulated, generatedAt: now }));
      setPhase("results");
    } catch (err: any) {
      if (err.name === "AbortError") return;
      console.error("Analysis error:", err);
      toast.error(err?.message || "Analysis failed");
      setPhase("input");
    } finally {
      clearInterval(phaseInterval);
      clearInterval(progressInterval);
      setLoadingProgress(100);
    }
  };

  const handleGenerateResponses = async () => {
    const sections = parseAnalysis(analysisText);
    const objectionSection = sections.find(s => s.key === "objections");
    if (!objectionSection) { toast.error("No objections found"); return; }

    setIsGeneratingResponses(true);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/engagement-analysis`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          generateResponses: true,
          objectionText: objectionSection.content,
          context: { platforms: selectedPlatforms.length > 0 ? selectedPlatforms : undefined },
        }),
      });

      if (!resp.ok) throw new Error("Failed to generate responses");
      const accumulated = await readStream(resp, (text) => setResponseTemplates(text));
      setResponseTemplates(accumulated);
      toast.success("Response templates generated");
    } catch (err: any) {
      toast.error(err?.message || "Failed to generate responses");
    } finally {
      setIsGeneratingResponses(false);
    }
  };

  const handleStartFresh = () => {
    if (window.confirm("This will clear your analysis. Are you sure?")) {
      setAnalysisText("");
      setGeneratedAt("");
      setResponseTemplates("");
      localStorage.removeItem(STORAGE_KEY);
      setPhase("input");
    }
  };

  const handleDownloadPdf = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html><html><head>
        <title>Engagement Analysis</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #1a1a1a; line-height: 1.6; }
          h1 { font-size: 24px; border-bottom: 2px solid #2dd4bf; padding-bottom: 8px; }
          h2 { font-size: 18px; color: #0d9488; margin-top: 32px; }
          h3 { font-size: 15px; margin-top: 16px; }
          .meta { color: #666; font-size: 12px; margin-bottom: 24px; }
        </style>
      </head><body>
        <h1>Engagement Analysis</h1>
        <p class="meta">Generated ${generatedAt ? new Date(generatedAt).toLocaleDateString() : ""} via EDGE Define</p>
        ${analysisText.replace(/## /g, "<h2>").replace(/### /g, "<h3>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n- /g, "\n<br>• ").replace(/\n/g, "<br>")}
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleSaveJson = () => {
    const blob = new Blob([JSON.stringify({ analysisText, generatedAt }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "engagement-analysis.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const sections = phase === "results" ? parseAnalysis(analysisText) : [];

  return (
    <Layout>
      <SEO
        canonical="/tools/define/engagement"
        title="Engagement Analyzer | EDGE Define"
        description="Paste comments, feedback, or conversations from your posts. Get structured analysis of what's resonating and what to do next."
        keywords="engagement analysis, content performance, audience feedback, social media analytics, EDGE framework"
        breadcrumb={[
          { name: "Tools", path: "/tools" },
          { name: "Define", path: "/tools/define" },
          { name: "Engagement Analyzer", path: "/tools/define/engagement" },
        ]}
      />

      <section className="section-spacing">
        <div className="container-wide max-w-[900px] mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink asChild><Link to="/tools">Tools</Link></BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink asChild><Link to="/tools/define">Define</Link></BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>Engagement Analyzer</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </nav>

          {/* Header */}
          <motion.div
            className="space-y-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <span className="text-xs uppercase tracking-widest text-accent font-medium">Define</span>
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-accent" />
              <h1 className="text-3xl md:text-4xl leading-[1.15]">Engagement Analyzer</h1>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-[720px]">
              Understand what's working by analysing real engagement.
            </p>
          </motion.div>

          {/* How it works */}
          <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                How it works
              </CollapsibleTrigger>
              <CollapsibleContent>
                <p className="text-sm text-muted-foreground/80 mt-3 pl-6 leading-relaxed max-w-[640px]">
                  Paste comments, replies, DM conversations, or feedback from your posts. The AI identifies interest signals, common objections, top-performing content themes, and gives prioritised recommendations for what to do next.
                </p>
              </CollapsibleContent>
            </Collapsible>
          </motion.div>

          <PrivacyNotice />

          <AnimatePresence mode="wait">
            {/* Input Phase */}
            {phase === "input" && (
              <motion.div key="input" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-8 space-y-6">
                {/* Main textarea */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Paste engagement data</label>
                  <Textarea
                    value={engagementData}
                    onChange={e => setEngagementData(e.target.value)}
                    placeholder="Paste comments, replies, messages, or feedback here. Include as much context as you want - platform, post topic, dates, etc."
                    className="min-h-[200px]"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground/60">
                      The more context you provide, the better the analysis. Paste comment threads, DM conversations, email replies, survey responses, or customer feedback.
                    </p>
                    <span className={cn("text-xs tabular-nums", engagementData.length < 100 ? "text-muted-foreground/40" : "text-accent")}>
                      {engagementData.length} chars
                    </span>
                  </div>
                </div>

                {/* Privacy */}
                <div className="flex items-start gap-2 text-xs text-muted-foreground/60 bg-card border border-border/20 rounded-sm p-3">
                  <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-accent/60" />
                  <span>Analysis happens in real-time and nothing is stored.</span>
                </div>

                {/* Optional context */}
                <Collapsible open={showContext} onOpenChange={setShowContext}>
                  <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                    <ChevronDown className={cn("h-4 w-4 transition-transform", showContext && "rotate-180")} />
                    Add more context
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-4 space-y-4 pl-6">
                      {/* Platforms */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Platform(s)</label>
                        <div className="flex flex-wrap gap-3">
                          {platformOptions.map(p => (
                            <label key={p} className="flex items-center gap-2 cursor-pointer text-sm">
                              <Checkbox checked={selectedPlatforms.includes(p)} onCheckedChange={() => togglePlatform(p)} />
                              {p}
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Time period */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Time period</label>
                        <Input
                          value={timePeriod}
                          onChange={e => setTimePeriod(e.target.value)}
                          placeholder="e.g., Last 2 weeks, January 2026"
                        />
                      </div>

                      {/* Post topics */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">What were you posting about?</label>
                        <Textarea
                          value={postTopics}
                          onChange={e => setPostTopics(e.target.value)}
                          placeholder="e.g., Product launch, thought leadership on AI governance, case studies"
                          className="min-h-[60px]"
                        />
                        <p className="text-xs text-muted-foreground/60">Helps contextualise the feedback</p>
                      </div>

                      {/* Specific questions */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Specific questions?</label>
                        <Textarea
                          value={specificQuestions}
                          onChange={e => setSpecificQuestions(e.target.value)}
                          placeholder="e.g., Are people confused about pricing? Do they understand the value prop?"
                          className="min-h-[60px]"
                        />
                        <p className="text-xs text-muted-foreground/60">Focus the analysis on specific concerns</p>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Brand profile context */}
                {profileData && (
                  <div className="border border-border/20 rounded-sm p-3">
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                      <Checkbox checked={useProfile} onCheckedChange={(v) => setUseProfile(!!v)} />
                      Analyse with brand profile context
                    </label>
                    {useProfile && (
                      <p className="text-xs text-accent mt-1.5 pl-6">Using profile for: {profileData.formData.productName}</p>
                    )}
                    <p className="text-xs text-muted-foreground/60 mt-1 pl-6">Compares engagement against your positioning goals</p>
                  </div>
                )}

                {/* Analyse button */}
                <Button onClick={streamAnalyse} disabled={!isInputValid} size="lg" className="w-full sm:w-auto">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyse engagement
                </Button>
                {!isInputValid && engagementData.length > 0 && (
                  <p className="text-xs text-muted-foreground/40">Minimum 100 characters required ({100 - engagementData.length} more needed)</p>
                )}
              </motion.div>
            )}

            {/* Loading */}
            {phase === "loading" && (
              <motion.div key="loading" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-8 space-y-6">
                <div className="border border-border/30 rounded-sm p-8 space-y-6 text-center">
                  <Loader2 className="h-8 w-8 text-accent animate-spin mx-auto" />
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={loadingPhaseIdx}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-sm text-muted-foreground"
                    >
                      {loadingPhases[loadingPhaseIdx]}
                    </motion.p>
                  </AnimatePresence>
                  <Progress value={loadingProgress} className="max-w-xs mx-auto" />
                  <p className="text-xs text-muted-foreground/40">Estimated: 30-60 seconds</p>
                </div>

                {analysisText && (
                  <div className="border border-border/20 rounded-sm p-4 max-h-60 overflow-y-auto">
                    <p className="text-xs text-muted-foreground/40 mb-2">Live preview:</p>
                    <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                      {analysisText.slice(-500)}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Results */}
            {phase === "results" && (
              <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-8 space-y-6">
                {/* Header */}
                <div>
                  <h2 className="text-xl font-semibold">Engagement Analysis</h2>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">
                    Generated {generatedAt ? new Date(generatedAt).toLocaleString() : ""}
                  </p>
                </div>

                {/* Sections */}
                <div className="space-y-4">
                  {sections.map(section => (
                    <SectionCard
                      key={section.key}
                      section={section}
                      onGenerateResponses={section.key === "objections" ? handleGenerateResponses : undefined}
                      isGeneratingResponses={isGeneratingResponses}
                    />
                  ))}
                </div>

                {/* Response Templates */}
                {responseTemplates && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border border-purple-400/30 bg-purple-400/5 rounded-sm overflow-hidden">
                    <Collapsible defaultOpen>
                      <div className="p-5 flex items-center justify-between">
                        <CollapsibleTrigger className="flex items-center gap-2 text-left flex-1 group">
                          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180 shrink-0" />
                          <MessageSquare className="h-4 w-4 text-purple-400 shrink-0" />
                          <h3 className="text-base font-semibold">Response Templates</h3>
                        </CollapsibleTrigger>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(responseTemplates, "Response templates")}>
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <CollapsibleContent>
                        <div className="px-5 pb-5 prose prose-sm prose-invert max-w-none text-muted-foreground leading-relaxed">
                          <MarkdownContent content={responseTemplates} />
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </motion.div>
                )}

                {/* Next Steps */}
                <div className="border border-accent/20 bg-accent/5 rounded-sm p-5 space-y-3">
                  <p className="text-sm font-medium text-foreground">What's next?</p>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" asChild>
                      <Link to="/tools/define/content-sprint">
                        Create sprint from insights <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
                    {profileData && (
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/tools/define/brand-profile">
                          Update brand profile <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/tools/elevate/prompt-engineer#optimize">
                        <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Create response prompts
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-border/20 pt-6 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
                      <Download className="h-3.5 w-3.5 mr-1.5" /> Download as PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(analysisText, "Full analysis")}>
                      <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy summary
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleSaveJson}>
                      <FileJson className="h-3.5 w-3.5 mr-1.5" /> Save as JSON
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={handleStartFresh} className="text-muted-foreground">
                      <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Analyse different engagement
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
}
