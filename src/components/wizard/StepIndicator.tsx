import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
  stepLabels?: string[];
  className?: string;
  onStepClick?: (step: number) => void;
}

export function StepIndicator({ totalSteps, currentStep, stepLabels, className, onStepClick }: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-1.5 sm:gap-2", className)}>
      {Array.from({ length: totalSteps }, (_, i) => {
        const isComplete = i < currentStep;
        const isCurrent = i === currentStep;
        const isFuture = i > currentStep;
        const canClick = isComplete && onStepClick;

        const dot = (
          <button
            key={i}
            type="button"
            disabled={!canClick}
            onClick={() => canClick && onStepClick(i)}
            className={cn(
              "h-7 w-7 rounded-full text-xs font-medium flex items-center justify-center transition-all duration-200 shrink-0",
              isComplete && "bg-accent text-accent-foreground cursor-pointer hover:bg-accent/80",
              isCurrent && "bg-accent text-accent-foreground ring-2 ring-accent/30 ring-offset-2 ring-offset-background",
              isFuture && "bg-muted text-muted-foreground/50",
              !canClick && !isCurrent && "cursor-default"
            )}
            aria-label={stepLabels?.[i] ? `Step ${i + 1}: ${stepLabels[i]}` : `Step ${i + 1}`}
            aria-current={isCurrent ? "step" : undefined}
          >
            {isComplete ? <Check className="h-3.5 w-3.5" /> : i + 1}
          </button>
        );

        if (stepLabels?.[i]) {
          return (
            <Tooltip key={i}>
              <TooltipTrigger asChild>{dot}</TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {stepLabels[i]}
              </TooltipContent>
            </Tooltip>
          );
        }

        return dot;
      })}
    </div>
  );
}
