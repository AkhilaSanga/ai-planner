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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AI Planning Agent
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Generate strategic reports with AI-powered analysis
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        {/* Input Section */}
        <div className="mb-12">
          <InputBox onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 shadow-sm">
            <p className="font-semibold text-lg">⚠️ Error</p>
            <p className="mt-2">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="my-20 text-center py-20">
            <div className="inline-flex flex-col items-center gap-6">
              <div className="flex gap-3">
                <div
                  className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
              <div>
                <p className="text-gray-900 font-bold text-lg">
                  Generating your strategic report...
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  This may take 30-60 seconds
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Report Section */}
        {report && !isLoading && (
          <div className="mt-12">
            {/* Report Header with Export Buttons */}
            <div className="mb-10">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Strategic Report
                </h2>
                <p className="text-gray-700 text-base">
                  <span className="font-semibold">Challenge:</span> {problemStatement}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <ReportExport
                  report={report}
                  problemStatement={problemStatement}
                  reportRef={reportRef}
                />
              </div>
            </div>

            {/* Report Content */}
            <div ref={reportRef} className="space-y-8">
              {/* Cover Section */}
              <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-3xl p-12 text-center shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-5xl font-bold text-gray-900 mb-6">
                  Strategic Planning Report
                </h3>
                <p className="text-xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
                  {problemStatement}
                </p>
                <p className="text-gray-500 text-sm">
                  Generated{" "}
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
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
            </div>
          </div>
        )}

        {/* Empty State */}
        {!report && !isLoading && (
          <div className="my-24 text-center py-24">
            <div className="text-7xl mb-8">🚀</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Enter a problem statement
            </h2>
            <p className="text-gray-600 text-lg">
              Our AI will generate a comprehensive analysis and action plan
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-600 text-sm">
          <p>© 2026 Akhila Sanga | AI Planning Agent | Version v1.1.0</p>
        </div>
      </footer>
    </main>
  );
}
