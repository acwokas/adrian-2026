import { useState, useCallback, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
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
import { ChevronDown, UserCircle } from "lucide-react";
import { motion } from "framer-motion";

const STORAGE_KEY = "define-brand-profile-data";
const TOTAL_STEPS = 8;

const stepLabels = [
  "Business Overview",
  "Target Audience",
  "Value Proposition",
  "Competitive Landscape",
  "Brand Personality",
  "Content Pillars",
  "Platform Strategy",
  "Review & Generate",
];

const industryOptions = [
  "Technology / SaaS",
  "Professional Services",
  "E-commerce / DTC",
  "Healthcare / Biotech",
  "Finance / Fintech",
  "Education / EdTech",
  "Media / Entertainment",
  "Manufacturing / Industrial",
  "Other",
];

const toneOptions = [
  { value: "authoritative", label: "Authoritative", desc: "Expert, confident, decisive" },
  { value: "conversational", label: "Conversational", desc: "Approachable, warm, relatable" },
  { value: "provocative", label: "Provocative", desc: "Challenging, bold, contrarian" },
  { value: "analytical", label: "Analytical", desc: "Data-driven, precise, methodical" },
  { value: "inspirational", label: "Inspirational", desc: "Visionary, motivating, forward-looking" },
];

const platformOptions = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "X (Twitter)" },
  { value: "newsletter", label: "Newsletter" },
  { value: "blog", label: "Blog / Website" },
  { value: "instagram", label: "Instagram" },
  { value: "threads", label: "Threads" },
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

export default function BrandProfileGenerator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>(loadData);

  // Autosave
  useEffect(() => {
    if (Object.keys(formData).length > 0) saveData(formData);
  }, [formData]);

  const setValue = useCallback((key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const getVal = (key: string) => formData[key] || "";

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS - 1));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));
  const handleGoToStep = (step: number) => {
    // Only allow going to completed steps
    if (step < currentStep) setCurrentStep(step);
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
  };

  const handleGenerate = () => {
    // Placeholder — generation will be implemented next
    console.log("Generate profile with:", formData);
  };

  // Step validation
  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 0: return (getVal("businessName").length >= 2) && (getVal("businessDescription").length >= 30);
      case 1: return (getVal("targetAudience").length >= 20);
      case 2: return (getVal("valueProp").length >= 20);
      case 3: return (getVal("competitors").length >= 10);
      case 4: return !!getVal("brandTone");
      case 5: return (getVal("contentPillars").length >= 10);
      case 6: return !!getVal("platforms");
      case 7: return true;
      default: return false;
    }
  };

  const selectedPlatforms = getVal("platforms") ? getVal("platforms").split(",").filter(Boolean) : [];
  const togglePlatform = (val: string) => {
    const updated = selectedPlatforms.includes(val)
      ? selectedPlatforms.filter(p => p !== val)
      : [...selectedPlatforms, val];
    setValue("platforms", updated.join(","));
  };

  return (
    <Layout>
      <SEO
        canonical="/tools/define/brand-profile"
        title="Brand Profile Generator | EDGE Define"
        description="Create your positioning foundation. 8-step guided process to define how your brand should be understood."
        keywords="brand positioning, brand profile, brand voice, content strategy, audience personas, EDGE framework"
        breadcrumb={[
          { name: "Tools", path: "/tools" },
          { name: "Define", path: "/tools/define" },
          { name: "Brand Profile Generator", path: "/tools/define/brand-profile" },
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
                    "On Step 8, review your inputs and generate your profile.",
                    "The AI creates positioning summary, personas, voice guide, and content pillars.",
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

          {/* Wizard */}
          <StepWizard
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            stepLabels={stepLabels}
            onNext={handleNext}
            onBack={handleBack}
            onGoToStep={handleGoToStep}
            onGenerate={handleGenerate}
            onSave={handleSave}
            onLoad={handleLoad}
            isNextDisabled={!isStepValid()}
            storageKey={STORAGE_KEY}
          >
            {/* Step 1: Business Overview */}
            {currentStep === 0 && (
              <FormStep
                stepNumber={1}
                title="Business Overview"
                description="Tell us about your business or personal brand."
                example={`Business: Acme Consulting\nDescription: We help mid-market SaaS companies build scalable go-to-market strategies. Our focus is on reducing sales cycles and improving win rates through structured processes and data-driven decision-making.`}
              >
                <FormFieldGroup label="Business or brand name" charCount={{ current: getVal("businessName").length, max: 100 }}>
                  <Input
                    placeholder="e.g., Acme Consulting"
                    value={getVal("businessName")}
                    onChange={e => setValue("businessName", e.target.value)}
                    maxLength={100}
                  />
                </FormFieldGroup>
                <FormFieldGroup
                  label="What do you do?"
                  helpText="Describe your business, product, or service in plain language."
                  charCount={{ current: getVal("businessDescription").length, min: 30, max: 500 }}
                >
                  <Textarea
                    placeholder="e.g., We help mid-market SaaS companies build scalable go-to-market strategies..."
                    value={getVal("businessDescription")}
                    onChange={e => setValue("businessDescription", e.target.value)}
                    maxLength={500}
                    rows={4}
                  />
                </FormFieldGroup>
                <FormFieldGroup label="Industry" helpText="Select the closest match.">
                  <Select value={getVal("industry")} onValueChange={v => setValue("industry", v)}>
                    <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                    <SelectContent>
                      {industryOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormFieldGroup>
              </FormStep>
            )}

            {/* Step 2: Target Audience */}
            {currentStep === 1 && (
              <FormStep
                stepNumber={2}
                title="Target Audience"
                description="Who are you trying to reach?"
                example={`Primary: VP Sales and CROs at B2B SaaS companies (Series B-D, 50-500 employees) who are struggling to scale their sales team beyond founder-led selling.\n\nSecondary: Marketing leaders at the same companies who need to align with sales on pipeline generation.`}
              >
                <FormFieldGroup
                  label="Describe your ideal audience"
                  helpText="Include role, seniority, company size, and what they care about."
                  charCount={{ current: getVal("targetAudience").length, min: 20, max: 800 }}
                >
                  <Textarea
                    placeholder="e.g., VP Sales and CROs at B2B SaaS companies who are struggling to scale..."
                    value={getVal("targetAudience")}
                    onChange={e => setValue("targetAudience", e.target.value)}
                    maxLength={800}
                    rows={5}
                  />
                </FormFieldGroup>
                <FormFieldGroup
                  label="What problems do they face?"
                  helpText="What keeps them up at night?"
                  charCount={{ current: getVal("audiencePains").length, max: 500 }}
                >
                  <Textarea
                    placeholder="e.g., Long sales cycles, inconsistent pipeline, difficulty hiring..."
                    value={getVal("audiencePains")}
                    onChange={e => setValue("audiencePains", e.target.value)}
                    maxLength={500}
                    rows={3}
                  />
                </FormFieldGroup>
              </FormStep>
            )}

            {/* Step 3: Value Proposition */}
            {currentStep === 2 && (
              <FormStep
                stepNumber={3}
                title="Value Proposition"
                description="What makes you different and why should anyone care?"
                example={`We combine sales process design with data analytics to identify exactly where deals stall and why. Unlike traditional sales training, we build systems, not motivation.`}
              >
                <FormFieldGroup
                  label="What value do you deliver?"
                  helpText="Focus on outcomes, not features."
                  charCount={{ current: getVal("valueProp").length, min: 20, max: 600 }}
                >
                  <Textarea
                    placeholder="e.g., We reduce average sales cycle by 30% through structured qualification frameworks..."
                    value={getVal("valueProp")}
                    onChange={e => setValue("valueProp", e.target.value)}
                    maxLength={600}
                    rows={4}
                  />
                </FormFieldGroup>
                <FormFieldGroup
                  label="What do people misunderstand about what you do?"
                  helpText="Common misconceptions or objections you hear."
                  charCount={{ current: getVal("misconceptions").length, max: 400 }}
                >
                  <Textarea
                    placeholder="e.g., People think we're a sales training company, but we actually..."
                    value={getVal("misconceptions")}
                    onChange={e => setValue("misconceptions", e.target.value)}
                    maxLength={400}
                    rows={3}
                  />
                </FormFieldGroup>
              </FormStep>
            )}

            {/* Step 4: Competitive Landscape */}
            {currentStep === 3 && (
              <FormStep
                stepNumber={4}
                title="Competitive Landscape"
                description="Who else is in this space and how are you different?"
                example={`Competitors: Gartner (too expensive for mid-market), Pavilion (community-focused, not hands-on), freelance consultants (inconsistent quality).\n\nOur edge: We actually build the systems and stay until they work.`}
              >
                <FormFieldGroup
                  label="Key competitors or alternatives"
                  helpText="Include direct competitors, indirect alternatives, and 'do nothing' as an option."
                  charCount={{ current: getVal("competitors").length, min: 10, max: 600 }}
                >
                  <Textarea
                    placeholder="e.g., Main competitors are..., but customers also consider..."
                    value={getVal("competitors")}
                    onChange={e => setValue("competitors", e.target.value)}
                    maxLength={600}
                    rows={4}
                  />
                </FormFieldGroup>
                <FormFieldGroup
                  label="Your unfair advantage"
                  helpText="What can you do that others can't easily replicate?"
                  charCount={{ current: getVal("advantage").length, max: 400 }}
                >
                  <Textarea
                    placeholder="e.g., 15 years of operational experience in exactly this segment..."
                    value={getVal("advantage")}
                    onChange={e => setValue("advantage", e.target.value)}
                    maxLength={400}
                    rows={3}
                  />
                </FormFieldGroup>
              </FormStep>
            )}

            {/* Step 5: Brand Personality */}
            {currentStep === 4 && (
              <FormStep
                stepNumber={5}
                title="Brand Personality"
                description="How should your brand sound and feel?"
              >
                <FormFieldGroup label="Primary tone" helpText="Choose the tone that best represents how you communicate.">
                  <Select value={getVal("brandTone")} onValueChange={v => setValue("brandTone", v)}>
                    <SelectTrigger><SelectValue placeholder="Select primary tone" /></SelectTrigger>
                    <SelectContent>
                      {toneOptions.map(o => (
                        <SelectItem key={o.value} value={o.value}>
                          <span>{o.label}</span>
                          <span className="text-muted-foreground ml-2 text-xs">— {o.desc}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormFieldGroup>
                <FormFieldGroup
                  label="Words that describe your brand"
                  helpText="3-5 adjectives that capture your brand's personality."
                  charCount={{ current: getVal("brandWords").length, max: 200 }}
                >
                  <Input
                    placeholder="e.g., Direct, pragmatic, evidence-based, understated"
                    value={getVal("brandWords")}
                    onChange={e => setValue("brandWords", e.target.value)}
                    maxLength={200}
                  />
                </FormFieldGroup>
                <FormFieldGroup
                  label="Words you want to avoid"
                  helpText="Language or associations you don't want."
                  charCount={{ current: getVal("avoidWords").length, max: 200 }}
                >
                  <Input
                    placeholder="e.g., Guru, disruptive, synergy, thought leader"
                    value={getVal("avoidWords")}
                    onChange={e => setValue("avoidWords", e.target.value)}
                    maxLength={200}
                  />
                </FormFieldGroup>
              </FormStep>
            )}

            {/* Step 6: Content Pillars */}
            {currentStep === 5 && (
              <FormStep
                stepNumber={6}
                title="Content Pillars"
                description="What themes should your content revolve around?"
                example={`1. Sales process design — frameworks, templates, case studies\n2. Revenue operations — metrics, dashboards, alignment\n3. Hiring & team building — what to look for, interview processes\n4. Industry insights — market trends, competitive analysis`}
              >
                <FormFieldGroup
                  label="Content themes or topics"
                  helpText="List 3-5 themes you want to be known for. These become your content pillars."
                  charCount={{ current: getVal("contentPillars").length, min: 10, max: 600 }}
                >
                  <Textarea
                    placeholder="e.g., 1. Sales process design&#10;2. Revenue operations&#10;3. Hiring & team building"
                    value={getVal("contentPillars")}
                    onChange={e => setValue("contentPillars", e.target.value)}
                    maxLength={600}
                    rows={5}
                  />
                </FormFieldGroup>
                <FormFieldGroup
                  label="Topics you explicitly won't cover"
                  helpText="Setting boundaries is as important as setting themes."
                  charCount={{ current: getVal("avoidTopics").length, max: 300 }}
                >
                  <Textarea
                    placeholder="e.g., We don't cover marketing automation, paid ads, or generic productivity tips"
                    value={getVal("avoidTopics")}
                    onChange={e => setValue("avoidTopics", e.target.value)}
                    maxLength={300}
                    rows={2}
                  />
                </FormFieldGroup>
              </FormStep>
            )}

            {/* Step 7: Platform Strategy */}
            {currentStep === 6 && (
              <FormStep
                stepNumber={7}
                title="Platform Strategy"
                description="Where will you publish content?"
              >
                <FormFieldGroup label="Select platforms" helpText="Choose all that apply.">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {platformOptions.map(p => (
                      <label
                        key={p.value}
                        className="flex items-center gap-2 p-3 border border-border/30 rounded-sm cursor-pointer hover:border-accent/40 transition-colors text-sm"
                      >
                        <Checkbox
                          checked={selectedPlatforms.includes(p.value)}
                          onCheckedChange={() => togglePlatform(p.value)}
                        />
                        {p.label}
                      </label>
                    ))}
                  </div>
                </FormFieldGroup>
                <FormFieldGroup
                  label="Posting frequency goal"
                  helpText="How often do you realistically want to publish?"
                >
                  <Select value={getVal("frequency")} onValueChange={v => setValue("frequency", v)}>
                    <SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="3-5-week">3-5 times per week</SelectItem>
                      <SelectItem value="1-2-week">1-2 times per week</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </FormFieldGroup>
              </FormStep>
            )}

            {/* Step 8: Review */}
            {currentStep === 7 && (
              <FormStep
                stepNumber={8}
                title="Review & Generate"
                description="Review your inputs below. Click 'Generate profile' to create your brand positioning package."
              >
                <div className="space-y-4">
                  {[
                    { label: "Business", value: getVal("businessName") },
                    { label: "Description", value: getVal("businessDescription") },
                    { label: "Industry", value: getVal("industry") },
                    { label: "Target Audience", value: getVal("targetAudience") },
                    { label: "Value Proposition", value: getVal("valueProp") },
                    { label: "Competitors", value: getVal("competitors") },
                    { label: "Brand Tone", value: toneOptions.find(t => t.value === getVal("brandTone"))?.label || getVal("brandTone") },
                    { label: "Content Pillars", value: getVal("contentPillars") },
                    { label: "Platforms", value: selectedPlatforms.map(p => platformOptions.find(o => o.value === p)?.label || p).join(", ") },
                    { label: "Frequency", value: getVal("frequency") },
                  ].filter(r => r.value).map(r => (
                    <div key={r.label} className="space-y-1">
                      <p className="text-xs uppercase tracking-wider text-accent font-medium">{r.label}</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{r.value}</p>
                    </div>
                  ))}
                </div>
              </FormStep>
            )}
          </StepWizard>
        </div>
      </section>
    </Layout>
  );
}
