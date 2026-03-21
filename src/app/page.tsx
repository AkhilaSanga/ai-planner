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
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 sticky top-0 z-50 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            AI Planning Agent
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Generate strategic reports with AI-powered analysis
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Input Section */}
        <InputBox onSubmit={handleSubmit} isLoading={isLoading} />

        {/* Error State */}
        {error && (
          <div className="mt-6 sm:mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <p className="font-medium">⚠️ Error</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="mt-12 text-center py-12">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
              <div>
                <p className="text-gray-900 font-medium text-sm">Generating your strategic report...</p>
                <p className="text-gray-500 text-xs mt-1">This may take 30-60 seconds</p>
              </div>
            </div>
          </div>
        )}

        {/* Report Section */}
        {report && !isLoading && (
          <div className="mt-12">
            {/* Report Header with Export Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Strategic Report</h2>
                <p className="text-gray-600 text-sm mt-2">
                  Challenge: <span className="font-medium text-gray-900">{problemStatement}</span>
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <ReportExport report={report} problemStatement={problemStatement} reportRef={reportRef} />
              </div>
            </div>

            {/* Report Content */}
            <div ref={reportRef} className="space-y-8 sm:space-y-10">
              {/* Cover Section */}
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 sm:p-10 text-center mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  Strategic Planning Report
                </h3>
                <p className="text-base sm:text-lg text-gray-600 mb-4 max-w-2xl mx-auto">
                  {problemStatement}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Generated {new Date().toLocaleDateString("en-US", { 
                    year: "numeric", 
                    month: "long", 
                    day: "numeric" 
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
          <div className="mt-16 text-center py-16 sm:py-20">
            <div className="text-5xl sm:text-6xl mb-4">🎯</div>
            <p className="text-lg sm:text-xl text-gray-600">
              Enter a problem statement to generate a strategic report
            </p>
            <p className="text-gray-500 text-sm mt-3">
              Our AI will analyze and provide actionable insights
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
