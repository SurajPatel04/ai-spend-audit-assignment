const API_URL = import.meta.env.VITE_API_URL || "";

export interface Tool {
  name: string;
  enabled: boolean;
  plan: string;
  seats: number;
  monthlySpend: number;
}

export interface AuditFormData {
  tools: Tool[];
  teamSize: number | string;
  useCase: string;
}

export interface AuditResult {
  tool: string;
  currentPlan: string;
  currentSpend: number;
  recommendedPlan: string;
  recommendedSpend: number;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
  status: "overspending" | "review" | "optimal";
}

export interface AuditData {
  auditId: string;
  results: AuditResult[];
  alternatives: string[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  savingsLevel: "high" | "medium" | "low" | "optimal";
  aiSummary: AuditSummary | string | null;
  createdAt: string;
  tools?: any[]; // Added to match what backend might return
}

export interface LeadData {
  auditId: string;
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  interestedInConsultation?: boolean;
}

export const runAudit = async (formData: AuditFormData): Promise<AuditData> => {
  const response = await fetch(`${API_URL}/api/v1/audit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error("Failed to run audit");
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || "Failed to generate audit");
  }

  return result.data;
};

export const getAudit = async (auditId: string): Promise<AuditData> => {
  const response = await fetch(`${API_URL}/api/v1/audit/${auditId}`);

  if (!response.ok) {
    throw new Error("Failed to get audit");
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || "Failed to retrieve audit");
  }

  return result.data;
};

export const saveLead = async (leadData: LeadData): Promise<any> => {
  const response = await fetch(`${API_URL}/api/v1/lead`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(leadData),
  });

  if (!response.ok) {
    throw new Error("Failed to save lead");
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || "Failed to capture lead");
  }

  return result.data;
};

export interface SummaryRequest {
  auditId: string;
  totalMonthlySpend: number;
  totalSavings: number;
  flaggedTools: string[];
  useCase: "coding" | "writing" | "data" | "research" | "mixed";
  teamSize: number;
}

export interface AuditSummary {
  summary: string;
  topRecommendation: string;
  urgencyLevel: "high" | "medium" | "low" | "optimal";
}

export const generateAuditSummary = async (auditData: SummaryRequest) => {
  const res = await fetch(`${API_URL}/api/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(auditData),
  });
  
  if (!res.ok) {
    throw new Error("Failed to generate audit summary");
  }

  const result = await res.json();
  if (!result.success && result.message) {
    throw new Error(result.message);
  }
  
  return result;
};

export const pingBackend = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/`);
    return response.ok;
  } catch (error) {
    return false;
  }
};
