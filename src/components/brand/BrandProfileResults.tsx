import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown, Copy, RefreshCw, Download, ClipboardCopy, FileJson, ArrowRight, RotateCcw, Loader2, Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface BrandProfileResultsProps {
  profileText: string;
  formData: Record<string, string>;
  onRegenerate: (section?: string) => void;
  onStartOver: () => void;
  isRegenerating: boolean;
  generatedAt: string;
}

const PROFILE_STORAGE_KEY = "define-brand-profile-latest";

function parseProfile(text: string) {
  const sections: { key: string; title: string; content: string }[] = [];
  const sectionMap: Record<string, string> = {
    "POSITIONING SUMMARY": "positioning",
    "AUDIENCE PERSONAS": "personas",
    "BRAND VOICE GUIDE": "voice",
    "CONTENT PILLARS": "pillars",
  };

  const regex = /## (POSITIONING SUMMARY|AUDIENCE PERSONAS|BRAND VOICE GUIDE|CONTENT PILLARS)\s*\n/gi;
  const matches = [...text.matchAll(regex)];

  matches.forEach((match, i) => {
    const title = match[1].toUpperCase();
    const startIdx = match.index! + match[0].length;
    const endIdx = i + 1 < matches.length ? matches[i + 1].index! : text.length;
    const content = text.slice(startIdx, endIdx).trim();
    const key = sectionMap[title] || title.toLowerCase().replace(/\s+/g, "-");
    sections.push({ key, title, content });
  });

  return sections;
}

function copyToClipboard(text: string, label?: string) {
  navigator.clipboard.writeText(text).then(() => {
    toast.success(label ? `${label} copied` : "Copied to clipboard");
  });
}

function SectionCard({
  title,
  content,
  accentClass,
  onRegenerate,
  isRegenerating,
  sectionKey,
}: {
  title: string;
  content: string;
  accentClass: string;
  onRegenerate: () => void;
  isRegenerating: boolean;
  sectionKey: string;
}) {
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(content, title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("border rounded-sm overflow-hidden", accentClass)}
    >
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="p-5 flex items-center justify-between">
          <CollapsibleTrigger className="flex items-center gap-2 text-left flex-1 group">
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform shrink-0", open && "rotate-180")} />
            <h3 className="text-base font-semibold">{title}</h3>
          </CollapsibleTrigger>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy} title="Copy">
              {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onRegenerate}
              disabled={isRegenerating}
              title="Regenerate"
            >
              {isRegenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
        <CollapsibleContent>
          <div className="px-5 pb-5 prose prose-sm prose-invert max-w-none text-muted-foreground leading-relaxed [&_strong]:text-foreground [&_h3]:text-foreground [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_ul]:space-y-1 [&_li]:before:hidden [&_li]:pl-0 whitespace-pre-line">
            <MarkdownContent content={content} />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
}

function MarkdownContent({ content }: { content: string }) {
  // Simple markdown rendering for bold, headers, lists
  const lines = content.split("\n");
  const elements: JSX.Element[] = [];

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<br key={i} />);
      return;
    }
    if (trimmed.startsWith("### ")) {
      elements.push(<h3 key={i}>{trimmed.slice(4)}</h3>);
      return;
    }
    if (trimmed.startsWith("- **") || trimmed.startsWith("* **")) {
      const text = trimmed.slice(2);
      elements.push(
        <div key={i} className="flex gap-2 items-start py-0.5">
          <span className="h-1 w-1 rounded-full bg-accent mt-2 shrink-0" />
          <span dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
        </div>
      );
      return;
    }
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      elements.push(
        <div key={i} className="flex gap-2 items-start py-0.5">
          <span className="h-1 w-1 rounded-full bg-accent mt-2 shrink-0" />
          <span>{trimmed.slice(2)}</span>
        </div>
      );
      return;
    }
    // Bold inline
    const html = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    elements.push(<p key={i} dangerouslySetInnerHTML={{ __html: html }} />);
  });

  return <>{elements}</>;
}

export function BrandProfileResults({
  profileText,
  formData,
  onRegenerate,
  onStartOver,
  isRegenerating,
  generatedAt,
}: BrandProfileResultsProps) {
  const sections = parseProfile(profileText);

  const accentClasses: Record<string, string> = {
    positioning: "border-accent/30 bg-accent/5",
    personas: "border-primary/20 bg-card",
    voice: "border-primary/20 bg-card",
    pillars: "border-accent/20 bg-card",
  };

  const handleDownloadPdf = () => {
    // Generate a printable HTML and open print dialog
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html><head>
        <title>${formData.productName || "Brand"} Profile</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #1a1a1a; line-height: 1.6; }
          h1 { font-size: 24px; border-bottom: 2px solid #2dd4bf; padding-bottom: 8px; }
          h2 { font-size: 18px; color: #0d9488; margin-top: 32px; }
          h3 { font-size: 15px; margin-top: 16px; }
          p { margin: 8px 0; }
          ul { padding-left: 20px; }
          li { margin: 4px 0; }
          .meta { color: #666; font-size: 12px; margin-bottom: 24px; }
        </style>
      </head><body>
        <h1>${formData.productName || "Brand"} Profile</h1>
        <p class="meta">Generated ${new Date(generatedAt).toLocaleDateString()} via EDGE Define</p>
        ${profileText.replace(/## /g, "<h2>").replace(/### /g, "<h3>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n- /g, "\n<br>• ").replace(/\n/g, "<br>")}
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleCopyAll = () => {
    copyToClipboard(profileText, "Full profile");
  };

  const handleSaveJson = () => {
    const payload = {
      formData,
      profile: profileText,
      generatedAt,
      sections: sections.map(s => ({ key: s.key, title: s.title, content: s.content })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(formData.productName || "brand").toLowerCase().replace(/\s+/g, "-")}-profile.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleConfirmStartOver = () => {
    if (window.confirm("This will clear your profile and all inputs. Are you sure?")) {
      onStartOver();
    }
  };

  // Save to localStorage for other tools
  const saveProfileForOtherTools = useCallback(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({
        formData,
        profile: profileText,
        generatedAt,
      }));
      toast.success("Profile saved for content sprint");
    } catch {
      toast.error("Could not save profile");
    }
  }, [formData, profileText, generatedAt]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{formData.productName} Brand Profile</h2>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Generated {new Date(generatedAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section, i) => (
          <SectionCard
            key={section.key}
            title={section.title}
            content={section.content}
            accentClass={accentClasses[section.key] || "border-border/30 bg-card"}
            onRegenerate={() => onRegenerate(section.title)}
            isRegenerating={isRegenerating}
            sectionKey={section.key}
          />
        ))}
      </div>

      {/* Next Steps */}
      <div className="border border-accent/20 bg-accent/5 rounded-sm p-5 space-y-3">
        <p className="text-sm font-medium text-foreground">Brand profile created! What's next?</p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link to="/tools/define/content-sprint">
              Generate 7-day sprint <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/tools/define/engagement">
              Analyse engagement <ArrowRight className="h-3.5 w-3.5 ml-1" />
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
          <Button variant="outline" size="sm" onClick={handleCopyAll}>
            <ClipboardCopy className="h-3.5 w-3.5 mr-1.5" /> Copy all sections
          </Button>
          <Button variant="outline" size="sm" onClick={handleSaveJson}>
            <FileJson className="h-3.5 w-3.5 mr-1.5" /> Save as JSON
          </Button>
          <Button variant="outline" size="sm" onClick={saveProfileForOtherTools} asChild={false}>
            <ArrowRight className="h-3.5 w-3.5 mr-1.5" /> Use for content sprint
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => onRegenerate()} disabled={isRegenerating} className="text-muted-foreground">
            {isRegenerating ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5 mr-1.5" />}
            Regenerate entire profile
          </Button>
          <Button variant="ghost" size="sm" onClick={handleConfirmStartOver} className="text-muted-foreground">
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Start over
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/tools/elevate/prompt-engineer#optimize">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Optimise with Prompt Engineer
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
