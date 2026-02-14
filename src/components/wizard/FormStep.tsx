import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { motion, AnimatePresence } from "framer-motion";

interface FormStepProps {
  stepNumber: number;
  title: string;
  description?: string;
  example?: string;
  children: ReactNode;
  className?: string;
}

export function FormStep({ stepNumber, title, description, example, children, className }: FormStepProps) {
  const [showExample, setShowExample] = useState(false);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepNumber}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
        className={cn("space-y-5", className)}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-accent font-medium">
              Step {stepNumber}
            </span>
          </div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          )}
        </div>

        {example && (
          <Collapsible open={showExample} onOpenChange={setShowExample}>
            <CollapsibleTrigger className="flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 transition-colors">
              <span>{showExample ? "Hide" : "Show"} example</span>
              <ChevronDown className={cn("h-3 w-3 transition-transform", showExample && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-3 p-4 bg-muted/30 border border-border/20 rounded-sm text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {example}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        <div className="space-y-4">
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

interface FormFieldGroupProps {
  label: string;
  helpText?: string;
  error?: string;
  charCount?: { current: number; min?: number; max?: number };
  children: ReactNode;
  className?: string;
}

export function FormFieldGroup({ label, helpText, error, charCount, children, className }: FormFieldGroupProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="text-sm font-medium text-foreground">{label}</label>
      {helpText && (
        <p className="text-xs text-muted-foreground/70">{helpText}</p>
      )}
      {children}
      <div className="flex items-center justify-between">
        {error && <p className="text-xs text-destructive">{error}</p>}
        {charCount && (
          <p className={cn(
            "text-xs ml-auto",
            charCount.min && charCount.current < charCount.min ? "text-destructive" : "text-muted-foreground/50"
          )}>
            {charCount.current}
            {charCount.max ? ` / ${charCount.max}` : ""}
            {charCount.min && charCount.current < charCount.min ? ` (min ${charCount.min})` : ""}
          </p>
        )}
      </div>
    </div>
  );
}
