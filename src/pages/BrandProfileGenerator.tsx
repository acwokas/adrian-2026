import { useState, useCallback, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { PrivacyNotice } from "@/components/simulation/PrivacyNotice";
import { StepWizard } from "@/components/wizard/StepWizard";
import { FormStep, FormFieldGroup } from "@/components/wizard/FormStep";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BrandProfileResults } from "@/components/brand/BrandProfileResults";
import { ChevronDown, UserCircle, Sparkles, Pencil, Loader2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const STORAGE_KEY = "define-brand-profile-data";
const PROFILE_STORAGE_KEY = "define-brand-profile-latest";
const TOTAL_STEPS = 8;

const stepLabels = [
  "Your Product", "Your Audience", "Your Markets", "The Problem",
  "Differentiators", "Competitors", "Your Tone", "Platforms",
];

const companySizeOptions = [
  { value: "startup", label: "Startups (1\u201320 people)" },
  { value: "small", label: "Small teams (21\u2013100 people)" },
  { value: "mid", label: "Mid-market (101\u20131000 people)" },
  { value: "enterprise", label: "Enterprise (1000+ people)" },
  { value: "not-specific", label: "Not company-specific" },
];

const toneOptions = [
  "Professional", "Approachable", "Direct", "Technical",
  "Conversational", "Authoritative", "Witty/Humorous", "Educational",
];

const platformOptions = [
  "LinkedIn", "X (Twitter)", "Reddit", "Product Hunt",
  "Company blog", "Newsletter", "Other",
];

const exampleData: Record<string, string> = {
  productName: "Acme Analytics",
  productDescription: "Real-time customer behaviour analytics for B2B SaaS companies. Combines product usage data with revenue signals to help teams identify expansion opportunities and reduce churn.",
  audienceRole: "VP Marketing, Head of Product",
  companySize: "mid",
  audienceCares: "Revenue growth, reducing churn, proving ROI to leadership, understanding which features drive retention",
  primaryMarkets: "North America, UK, Western Europe",
  marketNotes: "GDPR compliance required for EU markets. English-language focus initially.",
  coreProblem: "Marketing teams waste 15+ hours per week manually tracking campaign performance across 6 different tools, leading to delayed decisions and missed optimisation windows that cost 20-30% of ad spend.",
  differentiators: "Only platform that combines behavioural analytics with AI-powered recommendations. Real-time processing vs batch. Built specifically for B2B SaaS, not retrofitted from consumer analytics.",
  directCompetitors: "Mixpanel, Amplitude, Google Analytics",
  indirectAlternatives: "Manual spreadsheet tracking, hiring a data analyst, Looker dashboards built in-house",
  tones: "Professional,Direct,Authoritative",
  toneNotes: "Professional but not corporate. Confident without being arrogant. Data-informed language.",
  platforms: "LinkedIn,Company blog,Newsletter",
};

const loadingPhases = [
  "Analysing your inputs...",
  "Generating positioning summary...",
  "Creating audience personas...",
  "Defining brand voice...",
  "Identifying content pillars...",
];

function loadData(): Record<string, string> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
}

function saveData(data: Record<string, string>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

type Phase = "wizard" | "review" | "loading" | "results";

export default function BrandProfileGenerator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>(loadData);
  const [isRefining, setIsRefining] = useState(false);
  const [phase, setPhase] = useState<Phase>("wizard");
  const [profileText, setProfileText] = useState("");
  const [generatedAt, setGeneratedAt] = useState("");
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Check for existing profile on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile && parsed.generatedAt) {
          setProfileText(parsed.profile);
          setGeneratedAt(parsed.generatedAt);
          if (parsed.formData) setFormData(parsed.formData);
          setPhase("results");
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (Object.keys(formData).length > 0) saveData(formData);
  }, [formData]);

  const setValue = useCallback((key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const getVal = (key: string) => formData[key] || "";
  const getList = (key: string) => getVal(key) ? getVal(key).split(",").filter(Boolean) : [];
  const toggleItem = (key: string, val: string) => {
    const list = getList(key);
    const updated = list.includes(val) ? list.filter(v => v !== val) : [...list, val];
    setValue(key, updated.join(","));
  };

  const handleNext = () => {
    if (currentStep === TOTAL_STEPS - 1) {
      setPhase("review");
    } else {
      setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS - 1));
    }
  };
  const handleBack = () => {
    if (phase === "review") { setPhase("wizard"); }
    else { setCurrentStep(prev => Math.max(prev - 1, 0)); }
  };
  const handleGoToStep = (step: number) => {
    if (step <= currentStep) {
      setPhase("wizard");
      setCurrentStep(step);
    }
  };

  const handleSave = () => {
    const blob = new Blob([JSON.stringify(formData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "brand-profile-draft.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoad = (data: Record<string, string>) => {
    setFormData(data);
    setCurrentStep(0);
    setPhase("wizard");
  };

  const fillExample = () => {
    setFormData(prev => ({ ...prev, ...exampleData }));
    toast.success("Example data loaded");
  };

  // AI refinement
  const handleRefine = async (type: "problem" | "differentiators", fieldKey: string) => {
    const text = getVal(fieldKey);
    if (!text || text.length < 10) { toast.error("Add more text before refining"); return; }
    setIsRefining(true);
    try {
      const { data, error } = await supabase.functions.invoke("brand-profile-refine", { body: { type, text } });
      if (error) throw error;
      if (data?.refined) {
        const original = text;
        setValue(fieldKey, data.refined);
        toast.success("Refined. You can revert if needed.", {
          action: { label: "Revert", onClick: () => setValue(fieldKey, original) },
        });
      }
    } catch (err: any) {
      toast.error(err?.message || "Refinement failed");
    } finally { setIsRefining(false); }
  };

  // Stream generation
  const streamGenerate = async (regenerateSection?: string) => {
    const isRegen = !!regenerateSection;
    if (isRegen) setIsRegenerating(true);
    else {
      setPhase("loading");
      setLoadingPhase(0);
      setLoadingProgress(0);
    }

    const controller = new AbortController();
    abortRef.current = controller;

    // Loading phase animation
    let phaseInterval: ReturnType<typeof setInterval> | null = null;
    let progressInterval: ReturnType<typeof setInterval> | null = null;
    if (!isRegen) {
      phaseInterval = setInterval(() => {
        setLoadingPhase(prev => Math.min(prev + 1, loadingPhases.length - 1));
      }, 8000);
      progressInterval = setInterval(() => {
        setLoadingProgress(prev => Math.min(prev + 1, 95));
      }, 600);
    }

    let accumulated = "";

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/brand-profile-generate`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ formData, regenerateSection }),
        signal: controller.signal,
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({ error: "Generation failed" }));
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      if (!resp.body) throw new Error("No response stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

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
            if (content) {
              accumulated += content;
              if (!isRegen) setProfileText(accumulated);
            }
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

      const now = new Date().toISOString();

      if (isRegen && regenerateSection) {
        // Replace just that section in the existing profile
        const sectionHeader = `## ${regenerateSection}`;
        const existingText = profileText;
        const sectionStart = existingText.indexOf(sectionHeader);
        if (sectionStart !== -1) {
          const nextSection = existingText.indexOf("\n## ", sectionStart + sectionHeader.length);
          const before = existingText.slice(0, sectionStart);
          const after = nextSection !== -1 ? existingText.slice(nextSection) : "";
          const newText = before + accumulated.trim() + "\n\n" + after;
          setProfileText(newText.trim());
          // Save updated
          localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({ formData, profile: newText.trim(), generatedAt: now }));
        } else {
          setProfileText(accumulated);
          localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({ formData, profile: accumulated, generatedAt: now }));
        }
      } else {
        setProfileText(accumulated);
        setGeneratedAt(now);
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({ formData, profile: accumulated, generatedAt: now }));
      }

      setPhase("results");
    } catch (err: any) {
      if (err.name === "AbortError") return;
      console.error("Generate error:", err);
      toast.error(err?.message || "Generation failed");
      if (!isRegen) setPhase("review");
    } finally {
      if (phaseInterval) clearInterval(phaseInterval);
      if (progressInterval) clearInterval(progressInterval);
      setIsRegenerating(false);
      setLoadingProgress(100);
    }
  };

  const handleGenerate = () => streamGenerate();
  const handleRegenerate = (section?: string) => streamGenerate(section);

  const handleStartOver = () => {
    setPhase("wizard");
    setCurrentStep(0);
    setFormData({});
    setProfileText("");
    setGeneratedAt("");
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  };

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 0: return getVal("productName").length >= 2 && getVal("productDescription").length >= 30;
      case 1: return getVal("audienceRole").length >= 2 && !!getVal("companySize") && getVal("audienceCares").length >= 10;
      case 2: return getVal("primaryMarkets").length >= 3;
      case 3: return getVal("coreProblem").length >= 40;
      case 4: return getVal("differentiators").length >= 10;
      case 5: return true;
      case 6: return getList("tones").length >= 2;
      case 7: return getList("platforms").length >= 1;
      default: return false;
    }
  };

  const reviewSections = [
    { step: 0, label: "Your Product", items: [
      { key: "productName", label: "Product" },
      { key: "productDescription", label: "Description" },
    ]},
    { step: 1, label: "Your Audience", items: [
      { key: "audienceRole", label: "Role/Title" },
      { key: "companySize", label: "Company Size", transform: (v: string) => companySizeOptions.find(o => o.value === v)?.label || v },
      { key: "audienceCares", label: "Priorities" },
    ]},
    { step: 2, label: "Your Markets", items: [
      { key: "primaryMarkets", label: "Markets" },
      { key: "marketNotes", label: "Considerations" },
    ]},
    { step: 3, label: "The Problem", items: [{ key: "coreProblem", label: "Core Problem" }] },
    { step: 4, label: "Differentiators", items: [{ key: "differentiators", label: "Key Differentiators" }] },
    { step: 5, label: "Competitors", items: [
      { key: "directCompetitors", label: "Direct" },
      { key: "indirectAlternatives", label: "Indirect" },
    ]},
    { step: 6, label: "Your Tone", items: [
      { key: "tones", label: "Tone", transform: (v: string) => v.split(",").join(", ") },
      { key: "toneNotes", label: "Notes" },
    ]},
    { step: 7, label: "Platforms", items: [
      { key: "platforms", label: "Platforms", transform: (v: string) => v.split(",").join(", ") },
    ]},
  ];

  return (
    <Layout>
      <SEOHead
        canonical="/tools/define/brand-profile"
        title="Brand Profile Generator | EDGE Define"
        description="Create your positioning foundation. 8-step guided process to define how your brand should be understood."
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
                <BreadcrumbItem><BreadcrumbPage>Brand Profile Generator</BreadcrumbPage></BreadcrumbItem>
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
              <UserCircle className="h-6 w-6 text-accent" />
              <h1 className="text-3xl md:text-4xl leading-[1.15]">Brand Profile Generator</h1>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-[720px]">
              Create your positioning foundation. An 8-step process that generates positioning summary, audience personas, brand voice guide, and content pillars.
            </p>
          </motion.div>

          {phase === "wizard" && (
            <>
              {/* How it works */}
              <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                    <span>How it works</span>
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ol className="mt-4 space-y-2 text-sm text-muted-foreground list-none">
                      {[
                        "Complete each step with as much detail as you can.",
                        "Your progress saves automatically to your browser.",
                        "Use Save/Load to export and resume across sessions.",
                        "AI refinement is available on Steps 4 and 5 to sharpen your language.",
                        "On the final review, check your inputs and generate your profile.",
                      ].map((s, i) => (
                        <li key={i} className="flex gap-3 before:hidden pl-0">
                          <span className="text-accent font-medium shrink-0">{i + 1}.</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ol>
                  </CollapsibleContent>
                </Collapsible>
              </motion.div>
              <PrivacyNotice className="mb-8" />
            </>
          )}

          <AnimatePresence mode="wait">
            {/* LOADING */}
            {phase === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="py-16 space-y-8 text-center"
              >
                <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">{loadingPhases[loadingPhase]}</p>
                  <p className="text-xs text-muted-foreground">This typically takes 45-60 seconds</p>
                </div>
                <div className="max-w-xs mx-auto space-y-1.5">
                  <Progress value={loadingProgress} className="h-1.5" />
                  <p className="text-xs text-muted-foreground/50">{loadingProgress}%</p>
                </div>
                {profileText && (
                  <div className="text-left max-w-[700px] mx-auto mt-8 p-5 bg-card border border-border/30 rounded-sm">
                    <p className="text-xs text-accent font-medium mb-2">Preview</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-6">{profileText}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* RESULTS */}
            {phase === "results" && (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <BrandProfileResults
                  profileText={profileText}
                  formData={formData}
                  onRegenerate={handleRegenerate}
                  onStartOver={handleStartOver}
                  isRegenerating={isRegenerating}
                  generatedAt={generatedAt}
                />
              </motion.div>
            )}

            {/* REVIEW */}
            {phase === "review" && (
              <motion.div key="review" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Review your inputs</h2>
                  <p className="text-sm text-muted-foreground">Check everything looks right before generating.</p>
                </div>
                <div className="space-y-4">
                  {reviewSections.map(section => {
                    const hasContent = section.items.some(item => getVal(item.key));
                    if (!hasContent) return null;
                    return (
                      <div key={section.label} className="p-5 bg-card border border-border/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs uppercase tracking-wider text-accent font-medium">{section.label}</p>
                          <button onClick={() => handleGoToStep(section.step)} className="text-xs text-muted-foreground hover:text-accent transition-colors flex items-center gap-1">
                            <Pencil className="h-3 w-3" /> Edit
                          </button>
                        </div>
                        {section.items.map(item => {
                          const val = getVal(item.key);
                          if (!val) return null;
                          const display = item.transform ? item.transform(val) : val;
                          return (
                            <div key={item.key}>
                              <p className="text-xs text-muted-foreground/60">{item.label}</p>
                              <p className="text-sm text-foreground/90 whitespace-pre-line">{display}</p>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2 p-3 border border-accent/20 bg-accent/5 rounded-sm text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent shrink-0" />
                  Your inputs will be sent to AI for analysis but not stored. The generated profile stays in your browser.
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border/20">
                  <Button variant="ghost" size="sm" onClick={handleBack} className="text-muted-foreground">Back</Button>
                  <Button variant="hero" onClick={handleGenerate}>
                    <Sparkles className="h-4 w-4 mr-1.5" /> Generate brand profile
                  </Button>
                </div>
              </motion.div>
            )}

            {/* WIZARD */}
            {phase === "wizard" && (
              <motion.div key="wizard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <StepWizard
                  currentStep={currentStep}
                  totalSteps={TOTAL_STEPS}
                  stepLabels={stepLabels}
                  onNext={handleNext}
                  onBack={handleBack}
                  onGoToStep={handleGoToStep}
                  onGenerate={() => setPhase("review")}
                  onSave={handleSave}
                  onLoad={handleLoad}
                  isNextDisabled={!isStepValid()}
                  storageKey={STORAGE_KEY}
                >
                  {currentStep === 0 && (
                    <FormStep stepNumber={1} title="Tell us about your product" description="What are you building? Keep it simple and focused.">
                      <FormFieldGroup label="Product name" charCount={{ current: getVal("productName").length, max: 50 }}>
                        <Input placeholder="e.g., Acme Analytics" value={getVal("productName")} onChange={e => setValue("productName", e.target.value)} maxLength={50} />
                      </FormFieldGroup>
                      <FormFieldGroup label="What does it do?" helpText="One clear sentence. What problem does it solve?" charCount={{ current: getVal("productDescription").length, min: 30, max: 500 }}>
                        <Textarea placeholder="e.g., Real-time customer behaviour analytics for B2B SaaS companies" value={getVal("productDescription")} onChange={e => setValue("productDescription", e.target.value)} maxLength={500} rows={4} />
                      </FormFieldGroup>
                      <Button variant="ghost" size="sm" onClick={fillExample} className="text-xs text-muted-foreground">
                        <Sparkles className="h-3 w-3 mr-1" /> Load B2B SaaS example
                      </Button>
                    </FormStep>
                  )}
                  {currentStep === 1 && (
                    <FormStep stepNumber={2} title="Who are you trying to reach?" description="Who makes the decision to buy or use what you're building?">
                      <FormFieldGroup label="Primary role/title">
                        <Input placeholder="e.g., VP Marketing, Product Manager, Founder" value={getVal("audienceRole")} onChange={e => setValue("audienceRole", e.target.value)} maxLength={100} />
                      </FormFieldGroup>
                      <FormFieldGroup label="Company size">
                        <Select value={getVal("companySize")} onValueChange={v => setValue("companySize", v)}>
                          <SelectTrigger><SelectValue placeholder="Select company size" /></SelectTrigger>
                          <SelectContent>
                            {companySizeOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </FormFieldGroup>
                      <FormFieldGroup label="What do they care about?" helpText="Their priorities, pressures, what keeps them up at night" charCount={{ current: getVal("audienceCares").length, max: 500 }}>
                        <Textarea placeholder="e.g., Revenue growth, reducing churn, proving ROI to leadership" value={getVal("audienceCares")} onChange={e => setValue("audienceCares", e.target.value)} maxLength={500} rows={3} />
                      </FormFieldGroup>
                    </FormStep>
                  )}
                  {currentStep === 2 && (
                    <FormStep stepNumber={3} title="Where do you operate?" description="Geography and market context matter for positioning.">
                      <FormFieldGroup label="Primary markets" helpText="Where most of your customers are or will be">
                        <Textarea placeholder="e.g., North America, Southeast Asia, UK" value={getVal("primaryMarkets")} onChange={e => setValue("primaryMarkets", e.target.value)} maxLength={300} rows={2} />
                      </FormFieldGroup>
                      <FormFieldGroup label="Any market-specific considerations?" helpText="Optional">
                        <Textarea placeholder="e.g., Regulatory requirements in EU, language localisation needs" value={getVal("marketNotes")} onChange={e => setValue("marketNotes", e.target.value)} maxLength={400} rows={2} />
                      </FormFieldGroup>
                    </FormStep>
                  )}
                  {currentStep === 3 && (
                    <FormStep stepNumber={4} title="What problem are you solving?" description="The clearer the problem, the clearer your positioning.">
                      <FormFieldGroup label="Core problem" helpText="Be specific. Quantify if possible. What pain are you removing?" charCount={{ current: getVal("coreProblem").length, min: 40, max: 600 }}>
                        <Textarea placeholder="e.g., Marketing teams waste 15+ hours per week manually tracking campaign performance across 6 different tools" value={getVal("coreProblem")} onChange={e => setValue("coreProblem", e.target.value)} maxLength={600} rows={4} />
                      </FormFieldGroup>
                      <Button variant="outline" size="sm" disabled={isRefining || getVal("coreProblem").length < 10} onClick={() => handleRefine("problem", "coreProblem")} className="text-xs">
                        {isRefining ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Sparkles className="h-3 w-3 mr-1" />} Refine my problem statement
                      </Button>
                    </FormStep>
                  )}
                  {currentStep === 4 && (
                    <FormStep stepNumber={5} title="What makes you different?" description="Why should someone choose you over alternatives?">
                      <FormFieldGroup label="Key differentiators" helpText="What do you do that others don't? What do you do better?" charCount={{ current: getVal("differentiators").length, min: 10, max: 600 }}>
                        <Textarea placeholder="e.g., Only platform that combines behavioural analytics with AI-powered recommendations." value={getVal("differentiators")} onChange={e => setValue("differentiators", e.target.value)} maxLength={600} rows={4} />
                      </FormFieldGroup>
                      <Button variant="outline" size="sm" disabled={isRefining || getVal("differentiators").length < 10} onClick={() => handleRefine("differentiators", "differentiators")} className="text-xs">
                        {isRefining ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Sparkles className="h-3 w-3 mr-1" />} Clarify my differentiators
                      </Button>
                    </FormStep>
                  )}
                  {currentStep === 5 && (
                    <FormStep stepNumber={6} title="Who else solves this problem?" description="Understanding alternatives helps position you clearly.">
                      <FormFieldGroup label="Direct competitors" helpText="Tools or services that solve the same problem">
                        <Textarea placeholder="e.g., Mixpanel, Amplitude, Google Analytics" value={getVal("directCompetitors")} onChange={e => setValue("directCompetitors", e.target.value)} maxLength={400} rows={3} />
                      </FormFieldGroup>
                      <FormFieldGroup label="Indirect alternatives" helpText="What do people use today instead of a product like yours?">
                        <Textarea placeholder="e.g., Manual spreadsheet tracking, hiring a data analyst" value={getVal("indirectAlternatives")} onChange={e => setValue("indirectAlternatives", e.target.value)} maxLength={400} rows={3} />
                      </FormFieldGroup>
                    </FormStep>
                  )}
                  {currentStep === 6 && (
                    <FormStep stepNumber={7} title="How should your brand sound?" description="Tone shapes how your message lands.">
                      <FormFieldGroup label="Preferred tone" helpText="Select 2\u20134 that feel right for your audience">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {toneOptions.map(tone => (
                            <label key={tone} className="flex items-center gap-2 p-3 border border-border/30 rounded-sm cursor-pointer hover:border-accent/40 transition-colors text-sm">
                              <Checkbox checked={getList("tones").includes(tone)} onCheckedChange={() => toggleItem("tones", tone)} />
                              {tone}
                            </label>
                          ))}
                        </div>
                        {getList("tones").length > 0 && getList("tones").length < 2 && (
                          <p className="text-xs text-destructive">Select at least 2 tones</p>
                        )}
                      </FormFieldGroup>
                      <FormFieldGroup label="Tone notes" helpText="Optional">
                        <Textarea placeholder="e.g., Professional but not corporate. Confident without being arrogant." value={getVal("toneNotes")} onChange={e => setValue("toneNotes", e.target.value)} maxLength={300} rows={2} />
                      </FormFieldGroup>
                    </FormStep>
                  )}
                  {currentStep === 7 && (
                    <FormStep stepNumber={8} title="Where do you communicate?" description="We'll optimise content for the platforms you actually use.">
                      <FormFieldGroup label="Primary platforms" helpText="Where does your audience spend time?">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {platformOptions.map(p => (
                            <label key={p} className="flex items-center gap-2 p-3 border border-border/30 rounded-sm cursor-pointer hover:border-accent/40 transition-colors text-sm">
                              <Checkbox checked={getList("platforms").includes(p)} onCheckedChange={() => toggleItem("platforms", p)} />
                              {p}
                            </label>
                          ))}
                        </div>
                        {getList("platforms").length === 0 && (
                          <p className="text-xs text-destructive">Select at least 1 platform</p>
                        )}
                      </FormFieldGroup>
                    </FormStep>
                  )}
                </StepWizard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
}
