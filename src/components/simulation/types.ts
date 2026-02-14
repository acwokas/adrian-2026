export type SimulationPhase = "setup" | "active" | "reflection";

export interface SimulationStep {
  id: string;
  label: string;
}

export interface FormFieldConfig {
  id: string;
  label: string;
  type: "textarea" | "select";
  placeholder?: string;
  tooltip?: string;
  example?: string;
  maxLength?: number;
  options?: { value: string; label: string }[];
  required?: boolean;
}

export interface ExampleScenarioData {
  id: string;
  title: string;
  description: string;
  values: Record<string, string>;
}

export interface SimulationRoomConfig {
  id: string;
  title: string;
  pillar: "EVALUATE" | "DEFINE" | "GOVERN" | "ELEVATE";
  icon: string;
  description: string;
  howItWorks: string[];
  fields: FormFieldConfig[];
  examples: ExampleScenarioData[];
  steps: SimulationStep[];
}

export interface ResultSection {
  id: string;
  title: string;
  content: string;
}

export interface SimulationState {
  phase: SimulationPhase;
  formData: Record<string, string>;
  currentStep: number;
  totalSteps: number;
  results: ResultSection[];
  isLoading: boolean;
  error: string | null;
}
