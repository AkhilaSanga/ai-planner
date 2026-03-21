"use client";

import { useState } from "react";
import InputBox from "./components/InputBox";
import Section from "./components/Section";

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

  const handleSubmit = async (input: string) => {
    if (!input.trim()) {
      setError("Please enter a problem statement");
      return;
    }

    setIsLoading(true);
    setError(null);
    setReport(null);

    try {
      // 1. Planner
      const plannerRes = await fetch("/api/agents/planner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      if (!plannerRes.ok) throw new Error("Planner agent failed");
      const plannerData = await plannerRes.json();

      // 2. Insight
      const insightRes = await fetch("/api/agents/insight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plannerOutput: plannerData.data }),
      });

      if (!insightRes.ok) throw new Error("Insight agent failed");
      const insightData = await insightRes.json();

      // 3. Execution
      const execRes = await fetch("/api/agents/execution", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Planning Agent
          </h1>
          <p className="text-gray-600">
            Generate structured reports and actionable plans powered by AI
          </p>
        </div>

        {/* Input Section */}
        <InputBox onSubmit={handleSubmit} isLoading={isLoading} />

        {/* Error State */}
        {error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            ❌ {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <span className="ml-2">Generating your report...</span>
            </div>
          </div>
        )}

        {/* Report Section */}
        {report && !isLoading && (
          <div className="mt-12 space-y-6">
            {/* Report Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Your Report</h2>
              <p className="text-gray-600 text-sm mt-1">
                Click the buttons to refine each section
              </p>
            </div>

            {/* Sections */}
            <Section
              title="📋 Problem Breakdown"
              content={report.problemBreakdown}
              onUpdate={(val) => updateSection("problemBreakdown", val)}
            />

            <Section
              title="👥 Stakeholders"
              content={report.stakeholders}
              onUpdate={(val) => updateSection("stakeholders", val)}
            />

            <Section
              title="💡 Solution Approach"
              content={report.solution}
              onUpdate={(val) => updateSection("solution", val)}
            />

            <Section
              title="🎯 Action Plan"
              content={report.actionPlan}
              onUpdate={(val) => updateSection("actionPlan", val)}
            />

            {/* Export Section */}
            <div className="mt-10 p-6 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-gray-700 text-sm mb-4">
                📥 Export options coming soon (PDF, Word, JSON)
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                Export to PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
