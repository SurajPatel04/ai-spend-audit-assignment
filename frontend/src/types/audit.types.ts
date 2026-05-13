export type UseCaseType = "coding" | "writing" | "data" | "research" | "mixed";

export type ToolId =
  | "cursor"
  | "githubCopilot"
  | "claude"
  | "chatgpt"
  | "anthropicApi"
  | "openaiApi"
  | "gemini"
  | "windsurf";

export interface ToolEntry {
  enabled: boolean;
  plan: string;
  seats: number | '';
  monthlySpend: number | '';
}

export interface AuditFormState {
  tools: Record<ToolId, ToolEntry>;
  teamSize: number | '';
  useCase: UseCaseType;
}

export interface PlanOption {
  key: string;
  label: string;
  pricePerSeat: number | null;
}

export interface ToolConfig {
  label: string;
  icon: string;
  description: string;
  plans: PlanOption[];
}
