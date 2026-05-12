import type { UseCaseType } from "../../types/audit.types";

const USE_CASE_OPTIONS: { value: UseCaseType; label: string; icon: string }[] = [
  { value: "coding", label: "Coding", icon: "💻" },
  { value: "writing", label: "Writing", icon: "✍️" },
  { value: "data", label: "Data", icon: "📊" },
  { value: "research", label: "Research", icon: "🔬" },
  { value: "mixed", label: "Mixed", icon: "🔀" },
];

interface TeamMetaSectionProps {
  teamSize: number;
  useCase: UseCaseType;
  onTeamSizeChange: (size: number) => void;
  onUseCaseChange: (useCase: UseCaseType) => void;
}

export function TeamMetaSection({
  teamSize,
  useCase,
  onTeamSizeChange,
  onUseCaseChange,
}: TeamMetaSectionProps) {
  return (
    <div className="rounded-xl border border-wheat-200 bg-white/60 p-6 space-y-6">
      <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
        <span className="text-lg">👥</span>
        Team Details
      </h2>

      <div>
        <label
          htmlFor="team-size"
          className="block text-xs font-medium text-stone-600 mb-1.5"
        >
          Total team size (all roles)
        </label>
        <input
          type="number"
          id="team-size"
          min={1}
          value={teamSize}
          onChange={(e) => {
            const val = Math.max(1, parseInt(e.target.value, 10) || 1);
            onTeamSizeChange(val);
          }}
          className="w-full max-w-[200px] bg-wheat-50 border border-wheat-200 rounded-lg px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-wheat-400/40 transition-colors"
        />
      </div>

      <div>
        <label
          htmlFor="use-case-group"
          className="block text-xs font-medium text-stone-600 mb-2.5"
        >
          Primary use case
        </label>
        <div id="use-case-group" className="flex flex-wrap gap-2" role="radiogroup" aria-label="Primary use case">
          {USE_CASE_OPTIONS.map((opt) => {
            const isSelected = useCase === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onUseCaseChange(opt.value)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? "bg-wheat-100 border-wheat-400 text-wheat-800 shadow-sm shadow-wheat-400/20"
                    : "bg-wheat-50/50 border-wheat-200 text-stone-500 hover:bg-wheat-100 hover:text-stone-700"
                }`}
              >
                <span>{opt.icon}</span>
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
