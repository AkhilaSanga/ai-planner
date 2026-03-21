"use client";

import { useState, useRef } from "react";
import InputBox from "./components/InputBox";
import Section from "./components/Section";
import ReportExport from "./components/ReportExport";

type Report = {
  problemBreakdown: string;
  stakeholders: string;
  solution: string;
  actionPlan: string;
};

export default function Home() {
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [problemStatement, setProblemStatement] = useState("");
  const reportRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (input: string) => {
    if (!input.trim()) {
      setError("Please enter a problem statement");
      return;
    }

    setIsLoading(true);
    setError(null);
    setReport(null);
    setProblemStatement(input);

    try {
      // 1. Planner
      const plannerRes = await fetch("/api/agents/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      if (!plannerRes.ok) throw new Error("Planner agent failed");
      const plannerData = await plannerRes.json();

      // 2. Insight
      const insightRes = await fetch("/api/agents/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plannerOutput: plannerData.data }),
      });

      if (!insightRes.ok) throw new Error("Insight agent failed");
      const insightData = await insightRes.json();

      // 3. Execution
      const execRes = await fetch("/api/agents/execution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ insightOutput: insightData.data }),
      });

      if (!execRes.ok) throw new Error("Execution agent failed");
      const execData = await execRes.json();

      setReport(execData.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSection = (key: keyof Report, value: string) => {
    setReport((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            🚀 AI Planning Agent
          </h1>
          <p className="text-slate-600 text-sm mt-2">
            Generate structured reports and actionable plans powered by AI
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Input Section */}
        <InputBox onSubmit={handleSubmit} isLoading={isLoading} />

        {/* Error State */}
        {error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="mt-12 text-center">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
              <div>
                <p className="text-slate-600 font-medium">Generating your strategic report...</p>
                <p className="text-slate-500 text-sm mt-1">This may take 30-60 seconds</p>
              </div>
            </div>
          </div>
        )}

        {/* Report Section */}
        {report && !isLoading && (
          <div className="mt-12">
            {/* Report Header */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">📋 Strategic Report</h2>
                  <p className="text-slate-600 mt-2">
                    Problem: <span className="font-medium text-slate-900">{problemStatement}</span>
                  </p>
                </div>
                <div className="flex gap-3">
                  <ReportExport report={report} problemStatement={problemStatement} reportRef={reportRef} />
                </div>
              </div>
            </div>

            {/* Report Content */}
            <div ref={reportRef} className="space-y-6 print:space-y-4">
              {/* Cover Section */}
              <div className="bg-white rounded-xl border-2 border-blue-600 p-10 text-center mb-8 print:page-break-after">
                <div className="inline-block mb-4">
                  <div className="text-5xl mb-4">📊</div>
                </div>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Strategic Planning Report</h1>
                <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">{problemStatement}</p>
                <div className="text-sm text-slate-500">
                  Generated: {new Date().toLocaleDateString("en-US", { 
                    year: "numeric", 
                    month: "long", 
                    day: "numeric" 
                  })}
                </div>
              </div>

              {/* Problem Breakdown */}
              <Section
                title="📋 Problem Breakdown"
                content={report.problemBreakdown}
                onUpdate={(val) => updateSection("problemBreakdown", val)}
              />

              {/* Stakeholders */}
              <Section
                title="👥 Key Stakeholders"
                content={report.stakeholders}
                onUpdate={(val) => updateSection("stakeholders", val)}
              />

              {/* Solution Approach */}
              <Section
                title="💡 Solution Approach"
                content={report.solution}
                onUpdate={(val) => updateSection("solution", val)}
              />

              {/* Action Plan */}
              <Section
                title="🎯 Action Plan"
                content={report.actionPlan}
                onUpdate={(val) => updateSection("actionPlan", val)}
              />

              {/* Footer */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-8 mt-10 print:page-break-before">
                <p className="text-sm">Generated by AI Planning Agent • Strategic planning made simple</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!report && !isLoading && (
          <div className="mt-12 text-center py-20">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-xl text-slate-600">Enter a problem statement to generate a strategic report</p>
          </div>
        )}
      </div>
    </main>
  );
}
