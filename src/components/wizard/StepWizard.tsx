import { ReactNode, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "./StepIndicator";
import { ArrowLeft, ArrowRight, Download, Upload, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepWizardProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
  onNext: () => void;
  onBack: () => void;
  onGoToStep?: (step: number) => void;
  onGenerate: () => void;
  onSave: () => void;
  onLoad: (data: Record<string, string>) => void;
  isNextDisabled?: boolean;
  storageKey: string;
  children: ReactNode;
  className?: string;
}

export function StepWizard({
  currentStep,
  totalSteps,
  stepLabels,
  onNext,
  onBack,
  onGoToStep,
  onGenerate,
  onSave,
  onLoad,
  isNextDisabled,
  children,
  className,
}: StepWizardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLastStep = currentStep === totalSteps - 1;

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target?.result as string);
        onLoad(data);
      } catch {
        // invalid JSON
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }, [onLoad]);

  return (
    <div className={cn("space-y-8", className)}>
      {/* Step Indicator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <StepIndicator
          totalSteps={totalSteps}
          currentStep={currentStep}
          stepLabels={stepLabels}
          onStepClick={onGoToStep}
        />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onSave} className="text-xs text-muted-foreground">
            <Download className="h-3 w-3 mr-1" /> Save
          </Button>
          <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} className="text-xs text-muted-foreground">
            <Upload className="h-3 w-3 mr-1" /> Load
          </Button>
          <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[300px]">
        {children}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-border/20">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          disabled={currentStep === 0}
          className="text-muted-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
        </Button>

        {isLastStep ? (
          <Button
            variant="hero"
            size="default"
            onClick={onGenerate}
            disabled={isNextDisabled}
          >
            <Sparkles className="h-4 w-4 mr-1.5" /> Generate profile
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={onNext}
            disabled={isNextDisabled}
          >
            Next <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
