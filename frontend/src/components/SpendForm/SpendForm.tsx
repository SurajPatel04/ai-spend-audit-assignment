import type { AuditFormState } from "../../types/audit.types";
import { TOOLS_CONFIG, TOOL_IDS } from "../../constants/tools.constants";
import { useAuditForm } from "../../hooks/useAuditForm";
import { ToolCard } from "./ToolCard";
import { TeamMetaSection } from "./TeamMetaSection";

interface SpendFormProps {
  onSubmit: (state: AuditFormState) => void;
  isSubmitting?: boolean;
}

export function SpendForm({ onSubmit, isSubmitting = false }: SpendFormProps) {
  const {
    formState,
    toggleTool,
    updateToolField,
    setTeamSize,
    setUseCase,
    resetForm,
    computedMonthlyTotal,
    enabledToolCount,
  } = useAuditForm();

  const hasEnabledTools = enabledToolCount > 0;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wheat-200/50 border border-wheat-300 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-wheat-600 animate-pulse" />
          <span className="text-xs font-medium text-wheat-800">AI Spend Audit</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
          Audit Your AI Spend
        </h1>
        <p className="text-stone-600 text-sm sm:text-base max-w-lg mx-auto">
          Select the tools you pay for. We'll find what you can cut.
        </p>
      </div>

      <div className="sticky top-0 z-30 backdrop-blur-xl bg-wheat-50/80 border border-wheat-200 rounded-xl px-5 py-3 flex items-center justify-between shadow-sm shadow-wheat-200/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                hasEnabledTools ? "bg-wheat-600 animate-pulse" : "bg-wheat-300"
              }`}
            />
            <span className="text-sm text-stone-600">
              <span className="font-semibold text-stone-900">{enabledToolCount}</span>{" "}
              {enabledToolCount === 1 ? "tool" : "tools"} selected
            </span>
          </div>
          <div className="w-px h-4 bg-wheat-300" />
          <span className="text-sm text-stone-600">
            <span className="font-semibold text-wheat-800">
              ${computedMonthlyTotal.toLocaleString()}
            </span>
            /month
          </span>
        </div>

        {hasEnabledTools && (
          <button
            type="button"
            onClick={resetForm}
            className="text-xs text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
          >
            Reset all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TOOL_IDS.map((id) => (
          <ToolCard
            key={id}
            toolId={id}
            config={TOOLS_CONFIG[id]}
            entry={formState.tools[id]}
            onToggle={() => toggleTool(id)}
            onFieldChange={(field, value) => updateToolField(id, field, value)}
          />
        ))}
      </div>

      <TeamMetaSection
        teamSize={formState.teamSize}
        useCase={formState.useCase}
        onTeamSizeChange={setTeamSize}
        onUseCaseChange={setUseCase}
      />

      <div className="pt-4 pb-8">
        <button
          type="button"
          disabled={!hasEnabledTools || isSubmitting}
          onClick={() => onSubmit(formState)}
          className={`w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
            hasEnabledTools && !isSubmitting
              ? "bg-wheat-800 hover:bg-wheat-700 text-wheat-50 shadow-md shadow-wheat-800/20 hover:shadow-wheat-800/30 active:scale-[0.99]"
              : "bg-wheat-200 text-wheat-500 cursor-not-allowed"
          }`}
        >
          {isSubmitting 
            ? "Analyzing..." 
            : hasEnabledTools 
              ? "Run My Audit →" 
              : "Select at least one tool to continue"}
        </button>
      </div>
    </div>
  );
}
