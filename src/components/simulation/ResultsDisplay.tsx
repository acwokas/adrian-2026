import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Check, ChevronDown, RotateCcw, SlidersHorizontal, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSimulation } from "./SimulationProvider";
import type { ResultSection } from "./types";

function StreamingText({ text, speed = 12 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;
    const interval = setInterval(() => {
      indexRef.current += 1;
      if (indexRef.current >= text.length) {
        setDisplayed(text);
        clearInterval(interval);
      } else {
        setDisplayed(text.slice(0, indexRef.current));
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <div className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed">
      {displayed}
      {displayed.length < text.length && (
        <span className="inline-block w-0.5 h-4 bg-accent animate-pulse ml-0.5 align-text-bottom" />
      )}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-muted-foreground hover:text-foreground transition-colors p-1"
      aria-label="Copy to clipboard"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function ResultSectionCard({ section, animate }: { section: ResultSection; animate: boolean }) {
  return (
    <Collapsible defaultOpen>
      <div className="border border-border/30 bg-card rounded-sm overflow-hidden">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left hover:bg-secondary/30 transition-colors group">
          <h3 className="text-sm font-medium">{section.title}</h3>
          <div className="flex items-center gap-2">
            <CopyButton text={section.content} />
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 border-t border-border/20 pt-3">
            {animate ? (
              <StreamingText text={section.content} />
            ) : (
              <div className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed">
                {section.content}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export function ResultsDisplay() {
  const { results, isLoading, setPhase, reset } = useSimulation();

  const handleDownload = () => {
    const content = results
      .map((s) => `## ${s.title}\n\n${s.content}`)
      .join("\n\n---\n\n");
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "simulation-results.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Loading skeleton */}
      {isLoading && results.length === 0 && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-border/30 bg-card rounded-sm p-4 space-y-3">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* Result sections */}
      {results.map((section, i) => (
        <ResultSectionCard
          key={section.id}
          section={section}
          animate={i === results.length - 1 && isLoading}
        />
      ))}

      {/* Actions */}
      {!isLoading && results.length > 0 && (
        <div className={cn(
          "flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/20"
        )}>
          <Button variant="outline" size="sm" onClick={() => setPhase("setup")}>
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
            Adjust inputs
          </Button>
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Start over
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} className="sm:ml-auto">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Download results
          </Button>
        </div>
      )}
    </div>
  );
}
