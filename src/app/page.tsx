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

  const handleSubmit = async (input: string) => {
    // 1. Planner
    const plannerRes = await fetch("/api/agents/planner", {
      method: "POST",
      body: JSON.stringify({ input }),
    });
    const plannerData = await plannerRes.json();

    // 2. Insight
    const insightRes = await fetch("/api/agents/insight", {
      method: "POST",
      body: JSON.stringify({ plannerOutput: plannerData.data }),
    });
    const insightData = await insightRes.json();

    // 3. Execution
    const execRes = await fetch("/api/agents/execution", {
      method: "POST",
      body: JSON.stringify({ insightOutput: insightData.data }),
    });
    const execData = await execRes.json();

    setReport(execData.data);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <InputBox onSubmit={handleSubmit} />

        {/* ✅ Structured Report UI */}
        {report && (
          <div className="mt-10 space-y-6">
            <Section
              title="Problem Breakdown"
              content={report.problemBreakdown}
            />
            <Section
              title="Stakeholders"
              content={report.stakeholders}
            />
            <Section
              title="Solution Approach"
              content={report.solution}
            />
            <Section
              title="Action Plan"
              content={report.actionPlan}
            />
          </div>
        )}
      </div>
    </main>
  );
}