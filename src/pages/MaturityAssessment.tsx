import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  ClipboardCheck,
  Download,
  RotateCcw,
  ShieldCheck,
  Scale,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

// ── Data ──

interface Question {
  id: number;
  dimension: string;
  dimensionIndex: number;
  text: string;
  options: { level: number; label: string }[];
}

const dimensions = [
  "Decision Ownership",
  "Risk Management",
  "Performance Oversight",
  "Ethical Boundaries",
  "Accountability Structures",
];

const questions: Question[] = [
  {
    id: 1, dimension: "Decision Ownership", dimensionIndex: 0,
    text: "Are AI deployment decisions clearly owned by specific individuals or roles?",
    options: [
      { level: 1, label: "No: AI decisions are made ad-hoc by whoever is implementing" },
      { level: 2, label: "Somewhat: ownership is informal and varies by project" },
      { level: 3, label: "Yes: ownership is documented but not always followed" },
      { level: 4, label: "Yes: clear ownership with documented approval processes" },
      { level: 5, label: "Yes: ownership includes accountability metrics and review" },
    ],
  },
  {
    id: 2, dimension: "Decision Ownership", dimensionIndex: 0,
    text: "Is there a documented process for who approves AI deployments?",
    options: [
      { level: 1, label: "No: approvals are informal or do not exist" },
      { level: 2, label: "Partial: some projects require approval, others do not" },
      { level: 3, label: "Yes: documented but approval criteria are unclear" },
      { level: 4, label: "Yes: clear approval authority and criteria" },
      { level: 5, label: "Yes: tiered approval based on risk with audit trail" },
    ],
  },
  {
    id: 3, dimension: "Risk Management", dimensionIndex: 1,
    text: "Are potential AI risks systematically identified before deployment?",
    options: [
      { level: 1, label: "No: risks are addressed reactively when problems occur" },
      { level: 2, label: "Sometimes: risks considered informally by teams" },
      { level: 3, label: "Yes: risk assessment exists but not consistently applied" },
      { level: 4, label: "Yes: structured risk assessment for all AI projects" },
      { level: 5, label: "Yes: continuous risk monitoring with quantified metrics" },
    ],
  },
  {
    id: 4, dimension: "Risk Management", dimensionIndex: 1,
    text: "Do you have documented risk mitigation plans for AI deployments?",
    options: [
      { level: 1, label: "No: we handle issues as they arise" },
      { level: 2, label: "Informal: teams have their own approaches" },
      { level: 3, label: "Partial: mitigation plans exist but are not comprehensive" },
      { level: 4, label: "Yes: documented mitigation for known risks" },
      { level: 5, label: "Yes: living mitigation plans updated based on monitoring" },
    ],
  },
  {
    id: 5, dimension: "Risk Management", dimensionIndex: 1,
    text: "Is there a process for escalating AI-related risks?",
    options: [
      { level: 1, label: "No: unclear who to escalate to" },
      { level: 2, label: "Informal: escalation happens through normal channels" },
      { level: 3, label: "Defined: escalation path exists but rarely used" },
      { level: 4, label: "Active: clear escalation with defined triggers" },
      { level: 5, label: "Proactive: risk escalation happens before incidents" },
    ],
  },
  {
    id: 6, dimension: "Performance Oversight", dimensionIndex: 2,
    text: "Are AI outputs reviewed by humans?",
    options: [
      { level: 1, label: "Rarely: AI runs autonomously without review" },
      { level: 2, label: "Ad-hoc: review happens when someone notices issues" },
      { level: 3, label: "Sometimes: review processes exist but inconsistently applied" },
      { level: 4, label: "Regularly: scheduled review on defined cadence" },
      { level: 5, label: "Continuous: real-time monitoring with automated alerts" },
    ],
  },
  {
    id: 7, dimension: "Performance Oversight", dimensionIndex: 2,
    text: "Do you track performance metrics for AI systems?",
    options: [
      { level: 1, label: "No: we do not measure AI performance systematically" },
      { level: 2, label: "Basic: we track some operational metrics" },
      { level: 3, label: "Yes: metrics defined but not consistently monitored" },
      { level: 4, label: "Yes: active monitoring with dashboards" },
      { level: 5, label: "Yes: metrics tied to business outcomes with targets" },
    ],
  },
  {
    id: 8, dimension: "Performance Oversight", dimensionIndex: 2,
    text: "Is there accountability for ongoing AI performance?",
    options: [
      { level: 1, label: "No: unclear who is responsible after deployment" },
      { level: 2, label: "Informal: teams monitor their own implementations" },
      { level: 3, label: "Assigned: someone owns it but accountability is loose" },
      { level: 4, label: "Clear: defined ownership with regular reporting" },
      { level: 5, label: "Measured: performance accountability with consequences" },
    ],
  },
  {
    id: 9, dimension: "Ethical Boundaries", dimensionIndex: 3,
    text: "Are ethical principles for AI use documented?",
    options: [
      { level: 1, label: "No: ethics handled case-by-case" },
      { level: 2, label: "Informal: shared understanding but not written" },
      { level: 3, label: "Documented: principles exist but not operationalised" },
      { level: 4, label: "Active: principles guide decisions with examples" },
      { level: 5, label: "Embedded: principles integrated into all processes" },
    ],
  },
  {
    id: 10, dimension: "Ethical Boundaries", dimensionIndex: 3,
    text: "Is there a process for raising ethical concerns about AI?",
    options: [
      { level: 1, label: "No: unclear how to raise concerns" },
      { level: 2, label: "Informal: concerns raised through normal channels" },
      { level: 3, label: "Exists: process documented but rarely used" },
      { level: 4, label: "Active: clear process with responsive review" },
      { level: 5, label: "Proactive: regular ethical reviews before issues arise" },
    ],
  },
  {
    id: 11, dimension: "Accountability Structures", dimensionIndex: 4,
    text: "Is it clear who is accountable when AI causes harm or errors?",
    options: [
      { level: 1, label: "No: accountability is unclear or avoided" },
      { level: 2, label: "Varies: depends on the situation" },
      { level: 3, label: "Defined: roles exist but responsibility is diffuse" },
      { level: 4, label: "Clear: specific accountability with investigation process" },
      { level: 5, label: "Comprehensive: accountability with remediation and learning" },
    ],
  },
  {
    id: 12, dimension: "Accountability Structures", dimensionIndex: 4,
    text: "Are governance processes for AI documented and accessible?",
    options: [
      { level: 1, label: "No: processes are informal or do not exist" },
      { level: 2, label: "Partial: some documentation exists in scattered places" },
      { level: 3, label: "Documented: processes exist but hard to find or follow" },
      { level: 4, label: "Accessible: clear documentation that teams reference" },
      { level: 5, label: "Living: documentation updated based on learnings" },
    ],
  },
];

const maturityLevels: Record<number, { label: string; description: string }> = {
  1: {
    label: "Reactive",
    description: "Governance is ad-hoc and reactive. AI decisions lack structure and oversight. High risk of issues.",
  },
  2: {
    label: "Aware",
    description: "Some governance practices exist informally. Teams are aware of needs but processes are not documented. Inconsistent implementation.",
  },
  3: {
    label: "Defined",
    description: "Governance processes are documented but not consistently followed. Good foundation but needs active management.",
  },
  4: {
    label: "Managed",
    description: "Active governance with clear accountability. Processes followed with regular oversight. Best practices in place.",
  },
  5: {
    label: "Optimised",
    description: "Continuous improvement culture. Governance is embedded, measured, and refined. Industry-leading practices.",
  },
};

function getLevel(score: number): number {
  if (score >= 5) return 5;
  if (score >= 4) return 4;
  if (score >= 3) return 3;
  if (score >= 2) return 2;
  return 1;
}

function scoreColor(score: number): string {
  if (score >= 4) return "text-emerald-400";
  if (score >= 3) return "text-accent";
  if (score >= 2) return "text-yellow-400";
  return "text-red-400";
}

function barColor(score: number): string {
  if (score >= 4) return "bg-emerald-400";
  if (score >= 3) return "bg-accent";
  if (score >= 2) return "bg-yellow-400";
  return "bg-red-400";
}

// ── Component ──

type Phase = "intro" | "assessment" | "results";

export default function MaturityAssessment() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const answer = (questionId: number, level: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: level }));
  };

  const dimensionScores = useMemo(() => {
    return dimensions.map((dim, i) => {
      const qs = questions.filter((q) => q.dimensionIndex === i);
      const answered = qs.filter((q) => answers[q.id] !== undefined);
      if (answered.length === 0) return 0;
      const sum = answered.reduce((acc, q) => acc + (answers[q.id] ?? 1), 0);
      return Math.round((sum / qs.length) * 10) / 10;
    });
  }, [answers]);

  const overallScore = useMemo(() => {
    const valid = dimensionScores.filter((s) => s > 0);
    if (valid.length === 0) return 0;
    return Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 10) / 10;
  }, [dimensionScores]);

  const overallLevel = getLevel(overallScore);
  const allAnswered = Object.keys(answers).length === questions.length;
  const q = questions[currentQ];

  const lowestDimIndex = dimensionScores.indexOf(Math.min(...dimensionScores.filter((s) => s > 0)));

  const roadmapLinks: Record<number, { text: string; href: string }> = {
    0: { text: "Practice in Governance Review Simulator", href: "/tools/govern/governance-review" },
    1: { text: "Download Risk Exposure Checklist via Ethical Dilemma Simulator", href: "/tools/govern/ethical-dilemma" },
    2: { text: "Build Performance Accountability Template via Governance Review", href: "/tools/govern/governance-review" },
    3: { text: "Navigate Ethical Dilemma Simulator to establish principles", href: "/tools/govern/ethical-dilemma" },
    4: { text: "Document escalation paths via Governance Review Simulator", href: "/tools/govern/governance-review" },
  };

  const nextSteps: Record<string, string[]> = {
    foundation: [
      "Document AI decision owners and approval process",
      "Create basic risk checklist for AI projects",
      "Define minimum review requirements for AI outputs",
      "Schedule first governance review meeting",
    ],
    consistency: [
      "Audit adherence to documented processes",
      "Establish accountability metrics",
      "Create escalation procedures",
      "Train teams on governance processes",
    ],
    optimisation: [
      "Implement continuous improvement cycle",
      "Benchmark against industry standards",
      "Develop governance maturity metrics",
      "Share best practices across organisation",
    ],
  };

  const activeSteps = overallLevel <= 2 ? nextSteps.foundation : overallLevel <= 3 ? nextSteps.consistency : nextSteps.optimisation;

  const handleDownload = () => {
    const lines = [
      "AI GOVERNANCE MATURITY ASSESSMENT",
      `Date: ${new Date().toLocaleDateString("en-GB")}`,
      "",
      `Overall Score: ${overallScore} / 5.0`,
      `Maturity Level: Level ${overallLevel}: ${maturityLevels[overallLevel].label}`,
      `${maturityLevels[overallLevel].description}`,
      "",
      "DIMENSION BREAKDOWN",
      ...dimensions.map((d, i) => `  ${d}: ${dimensionScores[i]} / 5.0 (Level ${getLevel(dimensionScores[i])}: ${maturityLevels[getLevel(dimensionScores[i])].label})`),
      "",
      "WEAKEST AREA",
      `  ${dimensions[lowestDimIndex]} (${dimensionScores[lowestDimIndex]} / 5.0)`,
      `  Recommendation: ${roadmapLinks[lowestDimIndex].text}`,
      "",
      "NEXT STEPS",
      ...activeSteps.map((s) => `  □ ${s}`),
      "",
      "QUESTION RESPONSES",
      ...questions.map((q) => `  Q${q.id}. ${q.text}\n     Answer: Level ${answers[q.id] ?? "Skipped"}: ${q.options.find((o) => o.level === answers[q.id])?.label ?? "Skipped"}`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `governance-maturity-assessment-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const restart = () => {
    setPhase("intro");
    setCurrentQ(0);
    setAnswers({});
  };

  return (
    <Layout>
      <SEO
        canonical="/tools/govern/maturity-assessment"
        title="AI Governance Maturity Assessment | EDGE Govern"
        description="Assess your organisation's AI governance maturity across 5 dimensions. Get a personalised roadmap and recommendations."
        keywords="AI governance maturity, governance assessment, EDGE govern, AI oversight"
      />

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
              <Link to="/tools/govern" className="hover:text-foreground transition-colors">Govern</Link>
              <span>/</span>
              <span className="text-foreground">Maturity Assessment</span>
            </div>
            <div className="flex items-center gap-3">
              <ClipboardCheck className="h-6 w-6 text-accent" />
              <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15]">
                AI Governance Maturity Assessment
              </h1>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-[720px]">
              Evaluate where you are and get a roadmap for improvement.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="container-wide max-w-[900px] mx-auto">
          <AnimatePresence mode="wait">
            {/* ── INTRO ── */}
            {phase === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="p-6 md:p-8 bg-card border border-border/30 space-y-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This 12-question assessment evaluates your organisation's AI governance maturity across five dimensions:
                  </p>
                  <ol className="space-y-2">
                    {dimensions.map((d, i) => {
                      const descs = [
                        "Clarity about who owns AI decisions",
                        "How AI risks are identified and mitigated",
                        "How AI outputs are reviewed and measured",
                        "How ethical concerns are addressed",
                        "How responsibility is established",
                      ];
                      return (
                        <li key={d} className="text-sm text-muted-foreground flex items-start gap-3 pl-4">
                          <span className="text-accent/60 font-medium shrink-0">{i + 1}.</span>
                          <span><span className="font-medium text-foreground/80">{d}</span>: {descs[i]}</span>
                        </li>
                      );
                    })}
                  </ol>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Takes 5–10 minutes. Results are private and provide a personalised roadmap.
                  </p>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground/70">
                    <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-accent/60" />
                    <span>Assessment scores are calculated in your browser and never stored on servers.</span>
                  </div>
                </div>
                <Button variant="hero" size="default" onClick={() => setPhase("assessment")}>
                  Start assessment <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </motion.div>
            )}

            {/* ── ASSESSMENT ── */}
            {phase === "assessment" && (
              <motion.div key="assessment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                {/* Progress */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Question {currentQ + 1} of {questions.length}</span>
                  <span className="text-accent/70">{q.dimension}</span>
                </div>
                <div className="w-full h-1 bg-secondary/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-300"
                    style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                  />
                </div>

                {/* Question */}
                <div className="p-6 md:p-8 bg-card border border-border/30 space-y-5">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] tracking-wide uppercase font-normal text-muted-foreground border-border/40">
                      {q.dimension}
                    </Badge>
                  </div>
                  <h2 className="text-base md:text-lg font-medium leading-relaxed">{q.text}</h2>
                  <div className="space-y-2">
                    {q.options.map((opt) => (
                      <button
                        key={opt.level}
                        onClick={() => answer(q.id, opt.level)}
                        className={cn(
                          "w-full text-left p-3.5 text-sm border rounded-sm transition-all",
                          answers[q.id] === opt.level
                            ? "bg-accent/10 border-accent/40 text-foreground"
                            : "border-border/30 text-muted-foreground hover:border-border/60 hover:text-foreground"
                        )}
                      >
                        <span className="font-medium text-accent/60 mr-2">Level {opt.level}</span>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nav */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
                    disabled={currentQ === 0}
                  >
                    <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Previous
                  </Button>
                  <div className="flex gap-2">
                    {!answers[q.id] && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          answer(q.id, 1);
                          if (currentQ < questions.length - 1) setCurrentQ((p) => p + 1);
                        }}
                        className="text-muted-foreground/50"
                      >
                        Skip
                      </Button>
                    )}
                    {currentQ < questions.length - 1 ? (
                      <Button
                        variant="heroOutline"
                        size="sm"
                        onClick={() => setCurrentQ((p) => p + 1)}
                        disabled={!answers[q.id]}
                      >
                        Next <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                      </Button>
                    ) : (
                      <Button
                        variant="hero"
                        size="sm"
                        onClick={() => setPhase("results")}
                        disabled={!allAnswered}
                      >
                        Calculate maturity score <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Dimension dots */}
                <div className="flex gap-1 justify-center pt-2">
                  {questions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentQ(i)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        i === currentQ ? "bg-accent scale-125" : answers[questions[i].id] ? "bg-accent/40" : "bg-secondary"
                      )}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── RESULTS ── */}
            {phase === "results" && (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                {/* Overall */}
                <div className="p-6 md:p-8 bg-card border border-border/30 text-center space-y-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground/50">Your AI Governance Maturity</p>
                  <div className="space-y-1">
                    <p className={cn("text-5xl md:text-6xl font-bold", scoreColor(overallScore))}>{overallScore}</p>
                    <p className="text-sm text-muted-foreground">out of 5.0</p>
                  </div>
                  <Badge variant="outline" className="text-sm px-4 py-1 font-medium">
                    Level {overallLevel}: {maturityLevels[overallLevel].label}
                  </Badge>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[500px] mx-auto">
                    {maturityLevels[overallLevel].description}
                  </p>
                </div>

                {/* Dimension breakdown */}
                <div className="p-6 md:p-8 bg-card border border-border/30 space-y-5">
                  <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground/50">Dimension Breakdown</h3>
                  <div className="space-y-4">
                    {dimensions.map((dim, i) => {
                      const score = dimensionScores[i];
                      const lvl = getLevel(score);
                      return (
                        <div key={dim} className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-foreground/80 font-medium">{dim}</span>
                            <span className={cn("font-medium", scoreColor(score))}>{score} / 5.0</span>
                          </div>
                          <div className="w-full h-2 bg-secondary/50 rounded-full overflow-hidden">
                            <div
                              className={cn("h-full rounded-full transition-all duration-500", barColor(score))}
                              style={{ width: `${(score / 5) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground/50">
                            Level {lvl}: {maturityLevels[lvl].label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Roadmap */}
                <div className="p-6 md:p-8 bg-card border border-border/30 space-y-5">
                  <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground/50">Personalised Roadmap</h3>

                  {/* Start here */}
                  <div className="p-4 border border-accent/20 bg-accent/5 rounded-sm space-y-2">
                    <p className="text-xs uppercase tracking-widest text-accent font-medium">Start here</p>
                    <p className="text-sm text-foreground">
                      Your weakest area is <span className="font-medium">{dimensions[lowestDimIndex]}</span>{" "}
                      <span className="text-muted-foreground">({dimensionScores[lowestDimIndex]} / 5.0)</span>
                    </p>
                    <Button variant="heroOutline" size="sm" asChild>
                      <Link to={roadmapLinks[lowestDimIndex].href}>
                        {roadmapLinks[lowestDimIndex].text} <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                      </Link>
                    </Button>
                  </div>

                  {/* Quick wins */}
                  {dimensionScores.some((s) => s >= 2 && s < 3) && (
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground/50">Quick wins</p>
                      <p className="text-sm text-muted-foreground">
                        These dimensions are partially developed. Easiest to improve:
                      </p>
                      <ul className="space-y-1.5">
                        {dimensions.map((d, i) =>
                          dimensionScores[i] >= 2 && dimensionScores[i] < 3 ? (
                            <li key={d} className="text-sm text-muted-foreground flex items-start gap-2 pl-4">
                              <span className="w-1 h-1 rounded-full bg-yellow-400 shrink-0 mt-2" />
                              <span><span className="font-medium text-foreground/80">{d}</span>: {dimensionScores[i]} / 5.0</span>
                            </li>
                          ) : null
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Critical gaps */}
                  {dimensionScores.some((s) => s > 0 && s < 2) && (
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground/50">Critical gaps</p>
                      <ul className="space-y-1.5">
                        {dimensions.map((d, i) =>
                          dimensionScores[i] > 0 && dimensionScores[i] < 2 ? (
                            <li key={d} className="text-sm text-muted-foreground flex items-start gap-2 pl-4">
                              <span className="w-1 h-1 rounded-full bg-red-400 shrink-0 mt-2" />
                              <span><span className="font-medium text-foreground/80">{d}</span> — {dimensionScores[i]} / 5.0 — requires investment</span>
                            </li>
                          ) : null
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Recommended tools */}
                <div className="p-6 md:p-8 bg-card border border-border/30 space-y-4">
                  <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground/50">Recommended Tools</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {(dimensionScores[0] < 3 || dimensionScores[2] < 3 || dimensionScores[4] < 3) && (
                      <Link to="/tools/govern/governance-review" className="p-4 border border-border/30 hover:border-accent/30 transition-colors group space-y-2">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-accent" />
                          <span className="text-sm font-medium group-hover:text-accent transition-colors">Governance Review Simulator</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Practice defending ownership, oversight, and accountability structures.</p>
                      </Link>
                    )}
                    {(dimensionScores[1] < 3 || dimensionScores[3] < 3) && (
                      <Link to="/tools/govern/ethical-dilemma" className="p-4 border border-border/30 hover:border-accent/30 transition-colors group space-y-2">
                        <div className="flex items-center gap-2">
                          <Scale className="h-4 w-4 text-accent" />
                          <span className="text-sm font-medium group-hover:text-accent transition-colors">Ethical Dilemma Simulator</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Navigate risk management and ethical boundary decisions.</p>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Next steps */}
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left py-3 border-t border-border/20 group">
                    <span className="text-sm font-medium">Next steps checklist</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ul className="space-y-2 py-4">
                      {activeSteps.map((step) => (
                        <li key={step} className="text-sm text-muted-foreground flex items-start gap-2 pl-4">
                          <span className="w-1 h-1 rounded-full bg-accent/60 shrink-0 mt-2" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-border/20">
                  <Button variant="hero" size="sm" onClick={handleDownload}>
                    <Download className="h-3.5 w-3.5 mr-1.5" /> Download full report
                  </Button>
                  <Button variant="heroOutline" size="sm" onClick={restart}>
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Retake assessment
                  </Button>
                  <Button variant="heroOutline" size="sm" asChild>
                    <Link to="/tools/govern">
                      Explore governance tools <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
}
