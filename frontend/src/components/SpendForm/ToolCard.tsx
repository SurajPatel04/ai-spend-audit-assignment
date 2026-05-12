import { useMemo } from "react";
import type { ToolId, ToolEntry, ToolConfig } from "../../types/audit.types";
import { TOOL_ACCENT_COLORS } from "../../constants/tools.constants";

interface ToolCardProps {
  toolId: ToolId;
  config: ToolConfig;
  entry: ToolEntry;
  onToggle: () => void;
  onFieldChange: (field: keyof ToolEntry, value: any) => void;
}

function getPlanBadge(planKey: string, pricePerSeat: number | null): string {
  if (pricePerSeat === null) return "Usage-based";
  if (["team", "business", "enterprise"].includes(planKey)) return "Team";
  return "Individual";
}

export function ToolCard({ toolId, config, entry, onToggle, onFieldChange }: ToolCardProps) {
  const accentColor = TOOL_ACCENT_COLORS[toolId];

  const selectedPlan = useMemo(
    () => config.plans.find((p) => p.key === entry.plan) ?? config.plans[0],
    [config.plans, entry.plan]
  );

  const isApiPlan = selectedPlan.pricePerSeat === null;

  const estimatedSpend = useMemo(() => {
    if (selectedPlan.pricePerSeat === null) return null;
    return selectedPlan.pricePerSeat * entry.seats;
  }, [selectedPlan.pricePerSeat, entry.seats]);

  const showSpendWarning = useMemo(() => {
    if (estimatedSpend === null || estimatedSpend === 0) return false;
    const diff = Math.abs(entry.monthlySpend - estimatedSpend);
    return diff / estimatedSpend > 0.2;
  }, [entry.monthlySpend, estimatedSpend]);

  const planBadge = getPlanBadge(selectedPlan.key, selectedPlan.pricePerSeat);

  return (
    <div
      className={`relative rounded-xl border transition-all duration-300 ease-in-out overflow-hidden ${
        entry.enabled
          ? "border-wheat-300 bg-white shadow-md shadow-wheat-400/10"
          : "border-wheat-200 bg-wheat-50/50 opacity-70 hover:opacity-100 hover:bg-white"
      }`}
      style={{ borderLeftWidth: "3px", borderLeftColor: entry.enabled ? accentColor : "transparent" }}
    >
      <div
        className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer select-none"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-expanded={entry.enabled}
        aria-label={`Toggle ${config.label}`}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(); } }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <img src={config.icon} alt={config.label} className="w-8 h-8 object-contain flex-shrink-0" />
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-stone-900 truncate">{config.label}</h3>
            <p className="text-xs text-stone-500 truncate">{config.description}</p>
          </div>
        </div>

        <label
          htmlFor={`toggle-${toolId}`}
          className="relative inline-flex items-center flex-shrink-0 cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            id={`toggle-${toolId}`}
            checked={entry.enabled}
            onChange={onToggle}
            className="sr-only peer"
            aria-label={`Enable ${config.label}`}
          />
          <div
            className={`w-10 h-5 rounded-full transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-wheat-400/50 ${
              entry.enabled ? "bg-wheat-500" : "bg-wheat-300"
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                entry.enabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </label>
      </div>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
          entry.enabled ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pt-1 space-y-4 border-t border-wheat-200">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label htmlFor={`plan-${toolId}`} className="text-xs font-medium text-stone-600">
                  Plan
                </label>
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${accentColor}20`,
                    color: accentColor,
                  }}
                >
                  {planBadge}
                </span>
              </div>
              <select
                id={`plan-${toolId}`}
                value={entry.plan}
                onChange={(e) => onFieldChange("plan", e.target.value)}
                className="w-full bg-white border border-wheat-300 rounded-lg px-3 py-2 text-sm text-stone-900 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-wheat-400/40 transition-colors"
              >
                {config.plans.map((p) => (
                  <option key={p.key} value={p.key} className="bg-wheat-50 text-stone-900">
                    {p.label}
                    {p.pricePerSeat !== null ? ` — $${p.pricePerSeat}/seat` : " — Custom pricing"}
                  </option>
                ))}
              </select>
            </div>

            {!isApiPlan && (
              <div>
                <label htmlFor={`seats-${toolId}`} className="block text-xs font-medium text-stone-600 mb-1.5">
                  Seats / Users
                </label>
                <input
                  type="number"
                  id={`seats-${toolId}`}
                  min={1}
                  max={10000}
                  value={entry.seats}
                  onChange={(e) => {
                    const val = Math.max(1, Math.min(10000, parseInt(e.target.value, 10) || 1));
                    onFieldChange("seats", val);
                  }}
                  className="w-full bg-white border border-wheat-300 rounded-lg px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-wheat-400/40 transition-colors"
                />
              </div>
            )}

            <div>
              <label htmlFor={`spend-${toolId}`} className="block text-xs font-medium text-stone-600 mb-1.5">
                Monthly Spend
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-stone-400 pointer-events-none">
                  $
                </span>
                <input
                  type="number"
                  id={`spend-${toolId}`}
                  min={0}
                  value={entry.monthlySpend}
                  onChange={(e) => {
                    const val = Math.max(0, parseFloat(e.target.value) || 0);
                    onFieldChange("monthlySpend", val);
                  }}
                  className="w-full bg-white border border-wheat-300 rounded-lg pl-7 pr-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-wheat-400/40 transition-colors"
                />
              </div>

              {estimatedSpend !== null && (
                <p className="text-xs text-stone-500 mt-1.5">
                  Estimated: <span className="text-stone-400">${estimatedSpend.toLocaleString()}/mo</span>
                </p>
              )}

              {showSpendWarning && (
                <p className="flex items-center gap-1.5 text-xs text-orange-500 mt-1.5">
                  <span>⚠</span>
                  Differs from plan pricing — double-check
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
