import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAudit, saveLead, generateAuditSummary, type AuditData, type AuditSummary } from "../services/api";

import cursorImg from "../assets/new-cursor.webp";
import copilotImg from "../assets/github-copilot.webp";
import claudeImg from "../assets/Claude_AI_symbol.svg.png";
import chatgptImg from "../assets/ChatGPT-Logo.png";
import anthropicApiImg from "../assets/anthropic-icon-.webp";
import geminiImg from "../assets/Google-Gemini.png";
import windsurfImg from "../assets/Windsurf.png";

const TOOL_ICONS: Record<string, string> = {
  Cursor: cursorImg,
  "Claude (Anthropic)": claudeImg,
  "ChatGPT (OpenAI)": chatgptImg,
  "GitHub Copilot": copilotImg,
  "Anthropic API (Direct)": anthropicApiImg,
  "OpenAI API (Direct)": chatgptImg,
  "Gemini (Google)": geminiImg,
  Windsurf: windsurfImg,
  Claude: claudeImg,
  ChatGPT: chatgptImg,
  "Anthropic API": anthropicApiImg,
  "OpenAI API": chatgptImg,
  Gemini: geminiImg,
};

const getToolIcon = (toolName: string) => {
  return TOOL_ICONS[toolName] || "";
};

export default function Results() {
  const navigate = useNavigate();
  const { auditId: urlAuditId } = useParams();

  const isPublicShare = !!urlAuditId;

  // --- STATES ---
  const [data, setData] = useState<AuditData | null>(() => {
    if (!isPublicShare) {
      try {
        const stored = localStorage.getItem("auditData");
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return null;
  });

  const [loading, setLoading] = useState<boolean>(!data);
  const [error, setError] = useState<string | null>(null);

  const [leadForm, setLeadForm] = useState({
    email: "",
    companyName: "",
    role: "",
    teamSize: "",
    interestedInConsultation: false,
  });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);

  const [summary, setSummary] = useState<AuditSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const hasFetchedSummary = React.useRef(false);

  // --- FETCH DATA ---
  useEffect(() => {
    const localAuditId = localStorage.getItem("auditId");
    const auditId = urlAuditId || localAuditId;

    if (!auditId) {
      navigate("/");
      return;
    }

    const fetchAuditData = async () => {
      try {
        const result = await getAudit(auditId);
        setData(result);

        // Pre-check consultation if high savings
        if (result.totalMonthlySavings > 500) {
          setLeadForm((prev) => ({ ...prev, interestedInConsultation: true }));
        }
        
        // Update local storage if this is not a public share view
        if (!isPublicShare) {
          localStorage.setItem("auditData", JSON.stringify(result));
        }
      } catch (err: any) {
        if (!data) {
          setError(err.message || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAuditData();
  }, [navigate, urlAuditId, isPublicShare]);
  
  useEffect(() => {
    if (!data || hasFetchedSummary.current) return;
    hasFetchedSummary.current = true;

    const fetchSummary = async () => {
      // If audit already has summary saved, use it directly
      if (data.aiSummary && typeof data.aiSummary !== "string") {
        setSummary(data.aiSummary as AuditSummary);
        setSummaryLoading(false);
        return;
      }

      try {
        setSummaryLoading(true);
        const totalMonthlySpend = data.results?.reduce((acc, r) => acc + r.currentSpend, 0) || 0;
        const flaggedTools = data.results?.filter(r => r.status !== 'optimal').map(r => r.tool) || [];
        
        let teamSize = 1;
        if (data.tools && Array.isArray(data.tools)) {
          teamSize = Math.max(...data.tools.map((t: any) => t.seats || 1), 1);
        }

        const result = await generateAuditSummary({
          auditId: data.auditId,
          totalMonthlySpend,
          totalSavings: data.totalMonthlySavings ?? (data as any).totalSavings ?? 0,
          flaggedTools,
          useCase: "mixed",
          teamSize,
        });
        setSummary(result.data);
      } catch (err) {
        console.error("Failed to generate summary", err);
      } finally {
        setSummaryLoading(false);
      }
    };

    fetchSummary();
  }, [data]);

  // --- HANDLERS ---
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data?.auditId || !leadForm.email) return;

    setLeadSubmitting(true);
    setLeadError(null);
    try {
      await saveLead({
        auditId: data.auditId,
        email: leadForm.email,
        companyName: leadForm.companyName,
        role: leadForm.role,
        teamSize: leadForm.teamSize ? parseInt(leadForm.teamSize) : undefined,
        interestedInConsultation: leadForm.interestedInConsultation,
      });
      setLeadSubmitted(true);
    } catch (err: any) {
      setLeadError(err.message || "Failed to submit lead.");
    } finally {
      setLeadSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (!data?.auditId) return;
    const shareUrl = `${window.location.origin}/audit/${data.auditId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- RENDERERS ---
  if (loading) {
    return (
      <div className="min-h-screen bg-wheat-50 flex flex-col items-center justify-center text-stone-900">
        <div className="w-12 h-12 border-4 border-wheat-200 border-t-wheat-600 rounded-full animate-spin mb-4"></div>
        <p className="text-xl">Analyzing your AI spend...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-wheat-50 flex flex-col items-center justify-center text-stone-900 p-6 text-center">
        <h2 className="text-2xl font-bold mb-4 text-stone-900">
          {error === "Audit not found" ? "Audit not found" : "Oops, something went wrong"}
        </h2>
        <p className="text-stone-500 mb-6">{error}</p>
        <button
          onClick={() => {
            if (error === "Audit not found" || isPublicShare) {
              navigate("/");
            } else {
              window.location.reload();
            }
          }}
          className="px-6 py-3 bg-wheat-600 text-white hover:bg-wheat-700 transition rounded-lg font-medium"
        >
          {error === "Audit not found" || isPublicShare ? "Go to Homepage" : "Try Again"}
        </button>
      </div>
    );
  }

  const totalMonthlySavings = data.totalMonthlySavings ?? (data as any).totalSavings ?? 0;
  const totalAnnualSavings = data.totalAnnualSavings ?? (totalMonthlySavings * 12);
  const savingsLevel = data.savingsLevel || "optimal";
  const aiSummary = data.aiSummary;
  const results = data.results || [];
  const alternatives = data.alternatives || [];

  const isOptimal = totalMonthlySavings < 100 && savingsLevel === "optimal";

  // Determine Hero Colors
  let heroBg = "bg-wheat-100 border-wheat-300";
  let heroText = "text-wheat-900";
  if (savingsLevel === "high" || totalMonthlySavings > 500) {
    heroBg = "bg-emerald-50 border-emerald-200";
    heroText = "text-emerald-800";
  } else if (savingsLevel === "medium") {
    heroBg = "bg-amber-50 border-amber-200";
    heroText = "text-amber-800";
  } else if (savingsLevel === "optimal") {
    heroBg = "bg-purple-50 border-purple-200";
    heroText = "text-purple-800";
  }

  // Lead capture title
  let leadTitle = "Get your full audit report by email";
  if (totalMonthlySavings > 500) {
    leadTitle = "Lock in these savings with Credex";
  } else if (isOptimal) {
    leadTitle = "Get notified when optimizations apply to your stack";
  }

  return (
    <div className="min-h-screen bg-wheat-50 text-stone-800 font-sans pb-20">
      {/* Header */}
      <header className="p-6 flex justify-between items-center max-w-4xl mx-auto">
        {!isPublicShare ? (
          <button
            onClick={() => navigate("/")}
            className="text-stone-500 hover:text-stone-900 transition flex items-center gap-2 font-medium"
            aria-label="Run Another Audit"
          >
            ← Run Another Audit
          </button>
        ) : (
          <button
            onClick={() => navigate("/")}
            className="text-wheat-700 hover:text-wheat-900 font-semibold transition flex items-center gap-2"
            aria-label="Run your own audit"
          >
            Run your own audit →
          </button>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-6 space-y-8">
        {/* 2. HERO SECTION */}
        <section
          className={`p-8 md:p-12 rounded-2xl border ${heroBg} text-center shadow-sm`}
        >
          {isOptimal ? (
            <>
              <h1 className={`text-4xl md:text-5xl font-extrabold mb-4 ${heroText}`}>
                You're spending well.
              </h1>
              <p className="text-xl text-stone-600">
                No major optimizations found. Your AI stack looks well optimized.
              </p>
            </>
          ) : (
            <>
              <h1 className={`text-4xl md:text-5xl font-extrabold mb-4 ${heroText}`}>
                You could save ${totalMonthlySavings.toLocaleString()}/month
              </h1>
              <p className="text-xl text-stone-600">
                ${totalAnnualSavings.toLocaleString()} saved annually — that's $
                {totalAnnualSavings.toLocaleString()}/year back in your budget
              </p>
            </>
          )}
        </section>

        {/* 4. CREDEX CTA BANNER */}
        {!isOptimal && totalMonthlySavings > 500 && (
          <section className="bg-wheat-800 border border-wheat-900 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-2">
                You're leaving ${totalMonthlySavings.toLocaleString()}/month on the table
              </h2>
              <p className="text-wheat-100 text-sm md:text-base">
                Credex offers discounted AI credits for Cursor, Claude, and ChatGPT
                Enterprise. Teams saving this much typically recover costs within the
                first month.
              </p>
            </div>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 bg-white text-wheat-900 font-bold px-6 py-3 rounded-lg hover:bg-wheat-50 transition"
            >
              Book a Free Credex Consultation →
            </a>
          </section>
        )}

        {/* 3. AI SUMMARY CARD */}
        <section className="bg-white border border-wheat-200 rounded-xl p-6 shadow-sm summary-card">
          <h2 className="text-xl font-bold mb-4 text-stone-900">
            Your Personalized Audit Summary
          </h2>
          
          {summaryLoading ? (
            <p className="text-stone-500 animate-pulse">
              Generating your personalized summary...
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">
                {summary?.summary || (typeof aiSummary === "string" ? aiSummary : undefined) || `Based on your current AI tool stack, we identified potential savings of $${totalMonthlySavings}/month. Review the recommendations below to optimize your spend.`}
              </p>
              
              {summary?.topRecommendation && (
                <p className="top-rec text-wheat-800 font-medium bg-wheat-100/50 p-3 rounded-lg border border-wheat-300">
                  ⚡ {summary.topRecommendation}
                </p>
              )}
              
              {summary?.urgencyLevel && (
                <div className="mt-4">
                  <span 
                    className={`badge inline-block px-3 py-1 rounded-full text-sm font-semibold border ${
                      summary.urgencyLevel === "high" 
                        ? "bg-red-50 text-red-700 border-red-200" 
                        : summary.urgencyLevel === "medium" 
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200" 
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    {summary.urgencyLevel === "high" ? "🔴 Act Now" 
                      : summary.urgencyLevel === "medium" ? "🟡 Review Soon" 
                      : "🟢 Looks Good"}
                  </span>
                </div>
              )}
            </div>
          )}
        </section>
        {/* 5. PER-TOOL BREAKDOWN */}
        {!isOptimal && results.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold mb-4 text-stone-900">Per-Tool Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((result, idx) => {
                let badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
                let badgeText = "Optimized";
                if (result.status === "overspending") {
                  badgeClass = "bg-red-50 text-red-700 border-red-200";
                  badgeText = "Overspending";
                } else if (result.status === "review") {
                  badgeClass = "bg-yellow-50 text-yellow-700 border-yellow-200";
                  badgeText = "Review";
                }

                return (
                  <div
                    key={idx}
                    className="bg-white border border-wheat-200 rounded-xl p-6 flex flex-col h-full shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        {getToolIcon(result.tool) ? (
                          <img 
                            src={getToolIcon(result.tool)} 
                            alt={result.tool} 
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <span className="text-2xl" aria-hidden="true">
                            🔧
                          </span>
                        )}
                        <h3 className="text-xl font-bold text-stone-900">{result.tool}</h3>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeClass}`}
                      >
                        {badgeText}
                      </span>
                    </div>

                    <div className="mb-4 flex items-center gap-3 text-sm font-medium">
                      <span className="bg-wheat-100 text-stone-700 px-3 py-1.5 rounded-lg border border-wheat-200">
                        {result.currentPlan}
                      </span>
                      <span className="text-stone-400">→</span>
                      <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200">
                        {result.recommendedPlan}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 mb-4 text-sm">
                      <p className="text-stone-500">
                        Current: <span className="text-stone-800 font-medium">${result.currentSpend}/mo</span>
                      </p>
                      <p className="text-stone-500">
                        Recommended: <span className="text-stone-800 font-medium">${result.recommendedSpend}/mo</span>
                      </p>
                      {result.monthlySavings > 0 && (
                        <p className="text-emerald-600 font-medium mt-1">
                          ${result.monthlySavings}/mo saved
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-stone-500 mt-auto pt-4 border-t border-wheat-100">
                      {result.reason}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 6. ALTERNATIVES SECTION */}
        {alternatives && alternatives.length > 0 && (
          <section className="bg-white border border-wheat-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-stone-900">Additional Optimizations</h2>
            <div className="space-y-3">
              {alternatives.map((alt, idx) => (
                <div
                  key={idx}
                  className="bg-wheat-50 border border-wheat-200 p-4 rounded-lg flex items-start gap-3"
                >
                  <span className="text-wheat-600 mt-0.5">💡</span>
                  <p className="text-stone-700 text-sm leading-relaxed">{alt}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. YOU'RE SPENDING WELL */}
        {isOptimal && (
          <section className="bg-white border border-wheat-200 rounded-xl p-6 text-center shadow-sm">
            <h2 className="text-xl font-bold mb-2 text-stone-900">
              Your AI stack looks well optimized.
            </h2>
            <p className="text-stone-500">
              We'll notify you when better options become available for your tools.
            </p>
          </section>
        )}

        <hr className="border-wheat-300" />

        {/* 8. LEAD CAPTURE SECTION (Hidden for Public Share Version) */}
        {!isPublicShare && (
          <section className="bg-white border border-wheat-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-stone-900">{leadTitle}</h2>

            {leadSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-emerald-700 text-center font-medium">
                ✅ Report sent! Check your inbox.
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4 max-w-lg">
                {leadError && (
                  <div className="text-red-700 text-sm bg-red-50 p-3 rounded border border-red-200">
                    {leadError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    className="w-full bg-wheat-50 border border-wheat-300 rounded-lg px-4 py-2 text-stone-900 focus:outline-none focus:border-wheat-500 focus:ring-1 focus:ring-wheat-500 transition"
                    placeholder="you@company.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={leadForm.companyName}
                      onChange={(e) =>
                        setLeadForm({ ...leadForm, companyName: e.target.value })
                      }
                      className="w-full bg-wheat-50 border border-wheat-300 rounded-lg px-4 py-2 text-stone-900 focus:outline-none focus:border-wheat-500 focus:ring-1 focus:ring-wheat-500 transition"
                      placeholder="Acme Corp"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Role
                    </label>
                    <select
                      value={leadForm.role}
                      onChange={(e) => setLeadForm({ ...leadForm, role: e.target.value })}
                      className="w-full bg-wheat-50 border border-wheat-300 rounded-lg px-4 py-2 text-stone-900 focus:outline-none focus:border-wheat-500 focus:ring-1 focus:ring-wheat-500 transition appearance-none"
                    >
                      <option value="">Select a role...</option>
                      <option value="Founder">Founder</option>
                      <option value="Engineering Manager">Engineering Manager</option>
                      <option value="CTO">CTO</option>
                      <option value="Developer">Developer</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Team Size
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={leadForm.teamSize}
                      onChange={(e) =>
                        setLeadForm({ ...leadForm, teamSize: e.target.value })
                      }
                      className="w-full bg-wheat-50 border border-wheat-300 rounded-lg px-4 py-2 text-stone-900 focus:outline-none focus:border-wheat-500 focus:ring-1 focus:ring-wheat-500 transition"
                      placeholder="e.g. 10"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 mt-4 pt-2">
                  <input
                     type="checkbox"
                    id="consultation"
                    checked={leadForm.interestedInConsultation}
                    onChange={(e) =>
                      setLeadForm({
                        ...leadForm,
                        interestedInConsultation: e.target.checked,
                      })
                    }
                    className="mt-1 w-4 h-4 rounded border-wheat-300 text-wheat-600 focus:ring-wheat-500 focus:ring-offset-white bg-wheat-50"
                  />
                  <label htmlFor="consultation" className="text-sm text-stone-600">
                    I'm interested in a Credex consultation to discuss enterprise AI
                    discounts and optimizations.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={leadSubmitting}
                  className="mt-6 w-full md:w-auto px-6 py-2.5 bg-wheat-800 hover:bg-wheat-700 disabled:opacity-50 disabled:cursor-not-allowed transition rounded-lg font-medium text-white shadow-sm"
                >
                  {leadSubmitting ? "Sending..." : "Get My Report"}
                </button>
              </form>
            )}
          </section>
        )}

        {/* 9. SHARE SECTION */}
        <section className="bg-white border border-wheat-200 rounded-xl p-6 shadow-sm text-center md:text-left">
          <h2 className="text-xl font-bold mb-4 text-stone-900">Share this audit</h2>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex w-full md:w-auto flex-1 items-center bg-wheat-50 border border-wheat-200 rounded-lg overflow-hidden">
              <div className="px-4 py-2 text-stone-600 text-sm truncate flex-1 select-all">
                {window.location.origin}/audit/{data.auditId}
              </div>
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-wheat-200 hover:bg-wheat-300 text-wheat-900 transition text-sm font-medium border-l border-wheat-300 shrink-0 min-w-[90px]"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `I just audited my AI tool spend and found $${totalMonthlySavings}/month in savings. Check yours → ${window.location.origin}/audit/${data.auditId}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto shrink-0 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white px-5 py-2.5 rounded-lg transition font-medium text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
              Share on Twitter
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
