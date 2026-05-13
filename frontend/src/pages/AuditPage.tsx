import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { AuditFormState } from "../types/audit.types";
import { SpendForm } from "../components/SpendForm";
import { runAudit, type AuditFormData } from "../services/api";

export function AuditPage() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(state: AuditFormState) {
    if (import.meta.env.DEV) {
      console.log("[AuditPage] Form submitted:", state);
    }
    
    const enabledToolsCount = Object.values(state.tools).filter(t => t.enabled).length;
    if (enabledToolsCount === 0) {
      toast.error("Please select at least one AI tool");
      return;
    }

    if (state.teamSize === '') {
      toast.error("Total team size cannot be empty");
      return;
    }

    const tools = Object.entries(state.tools)
      .filter(([_, entry]) => entry.enabled)
      .map(([name, entry]) => ({
        name,
        enabled: entry.enabled,
        plan: entry.plan,
        seats: entry.seats,
        monthlySpend: entry.monthlySpend
      }));
      
    for (const tool of tools) {
      if (tool.seats === '' || tool.monthlySpend === '') {
        toast.error(`Please fill out all fields for the enabled tools`);
        return;
      }
    }

    setIsSubmitting(true);
    const loadingToastId = toast.loading("Generating audit...");
    
    try {
      const payload: AuditFormData = {
        tools: tools as any,
        teamSize: state.teamSize as number,
        useCase: state.useCase
      };

      const result = await runAudit(payload);
      
      console.log("✅ Audit Result:", result);
      toast.update(loadingToastId, { render: "Audit complete! Redirecting...", type: "success", isLoading: false, autoClose: 2000 });
      
      localStorage.setItem("auditId", result.auditId);
      localStorage.setItem("auditData", JSON.stringify(result));
      navigate("/results");
      
    } catch (error) {
      console.error("Audit error:", error);
      toast.update(loadingToastId, { render: "Something went wrong. Please try again.", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-wheat-50 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-wheat-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-wheat-400/10 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <SpendForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </main>
    </div>
  );
}
