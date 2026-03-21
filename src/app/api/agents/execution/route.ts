import { callAI } from "@/lib/ai";

export async function POST(req: Request) {
  const { insightOutput } = await req.json();

  const prompt = `
You are an execution agent.

Convert the input into a structured business report.

Return ONLY JSON in this format:

{
  "problemBreakdown": "...",
  "stakeholders": "...",
  "solution": "...",
  "actionPlan": "..."
}

Input:
${insightOutput}
`;

  const raw = await callAI(prompt);

  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = {
      problemBreakdown: raw || "No data",
      stakeholders: "Not generated",
      solution: "Not generated",
      actionPlan: "Not generated",
    };
  }

  return Response.json({ data: parsed });
}