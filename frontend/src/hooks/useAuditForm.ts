import { useState, useEffect, useMemo, useCallback } from "react";
import type { AuditFormState, ToolEntry, ToolId, UseCaseType } from "../types/audit.types";
import { TOOLS_CONFIG, TOOL_IDS } from "../constants/tools.constants";

const STORAGE_KEY = "auditFormState";

function buildDefaultState(): AuditFormState {
  const tools = {} as Record<ToolId, ToolEntry>;
  for (const id of TOOL_IDS) {
    const firstPlanKey = TOOLS_CONFIG[id].plans[0].key;
    tools[id] = {
      enabled: false,
      plan: firstPlanKey,
      seats: 1,
      monthlySpend: 0,
    };
  }
  return { tools, teamSize: 1, useCase: "mixed" };
}

function loadFromStorage(): AuditFormState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as AuditFormState;
      const defaults = buildDefaultState();
      for (const id of TOOL_IDS) {
        if (!parsed.tools[id]) {
          parsed.tools[id] = defaults.tools[id];
        }
      }
      return parsed;
    }
  } catch {}
  return buildDefaultState();
}

export interface UseAuditFormReturn {
  formState: AuditFormState;
  toggleTool: (toolId: ToolId) => void;
  updateToolField: (toolId: ToolId, field: keyof ToolEntry, value: any) => void;
  setTeamSize: (size: number) => void;
  setUseCase: (useCase: UseCaseType) => void;
  resetForm: () => void;
  computedMonthlyTotal: number;
  enabledToolCount: number;
}

export function useAuditForm(): UseAuditFormReturn {
  const [formState, setFormState] = useState<AuditFormState>(loadFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formState));
    } catch {}
  }, [formState]);

  const toggleTool = useCallback((toolId: ToolId): void => {
    setFormState((prev) => {
      const currentEntry = prev.tools[toolId];
      const firstPlanKey = TOOLS_CONFIG[toolId].plans[0].key;
      return {
        ...prev,
        tools: {
          ...prev.tools,
          [toolId]: {
            enabled: !currentEntry.enabled,
            plan: firstPlanKey,
            seats: 1,
            monthlySpend: 0,
          },
        },
      };
    });
  }, []);

  const updateToolField = useCallback(
    (toolId: ToolId, field: keyof ToolEntry, value: any): void => {
      setFormState((prev) => ({
        ...prev,
        tools: {
          ...prev.tools,
          [toolId]: {
            ...prev.tools[toolId],
            [field]: value,
          },
        },
      }));
    },
    []
  );

  const setTeamSize = useCallback((size: number): void => {
    setFormState((prev) => ({ ...prev, teamSize: Math.max(1, size) }));
  }, []);

  const setUseCase = useCallback((useCase: UseCaseType): void => {
    setFormState((prev) => ({ ...prev, useCase }));
  }, []);

  const resetForm = useCallback((): void => {
    localStorage.removeItem(STORAGE_KEY);
    setFormState(buildDefaultState());
  }, []);

  const computedMonthlyTotal = useMemo(() => {
    return TOOL_IDS.reduce((total, id) => {
      const entry = formState.tools[id];
      return entry.enabled ? total + entry.monthlySpend : total;
    }, 0);
  }, [formState.tools]);

  const enabledToolCount = useMemo(() => {
    return TOOL_IDS.filter((id) => formState.tools[id].enabled).length;
  }, [formState.tools]);

  return {
    formState,
    toggleTool,
    updateToolField,
    setTeamSize,
    setUseCase,
    resetForm,
    computedMonthlyTotal,
    enabledToolCount,
  };
}
