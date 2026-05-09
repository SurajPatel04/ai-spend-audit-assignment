import { useState, useEffect } from "react";
import type { AuditFormState } from "../types/audit.types";
import { SpendForm } from "../components/SpendForm";

export function AuditPage() {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(state: AuditFormState) {
    if (import.meta.env.DEV) {
      console.log("[AuditPage] Form submitted:", state);
    }
    
    setIsSubmitting(true);
    setToast("🔄 Generating audit...");
    
    try {
      const tools = Object.entries(state.tools).map(([name, entry]) => ({
        name,
        enabled: entry.enabled,
        plan: entry.plan,
        seats: entry.seats,
        monthlySpend: entry.monthlySpend
      }));
      
      const payload = {
        tools,
        teamSize: state.teamSize,
        useCase: state.useCase
      };

      const response = await fetch('/api/v1/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to generate audit");
      }
      
      console.log("✅ Audit Result:", result.data);
      setToast("✅ Audit complete! Results logged to console.");
      
    } catch (error) {
      console.error("Audit error:", error);
      setToast("❌ Error generating audit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-green-500/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/[0.02] rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <SpendForm onSubmit={handleSubmit} />
      </main>

      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-[slideUp_0.3s_ease-out]"
          role="alert"
        >
          <div className="bg-green-500/15 backdrop-blur-xl border border-green-500/30 text-green-300 px-6 py-3 rounded-xl text-sm font-medium shadow-lg shadow-green-500/10">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
