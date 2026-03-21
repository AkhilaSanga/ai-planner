import { callAI } from "@/lib/ai";

export async function POST(req: Request) {
  const { input } = await req.json();

  const prompt = `
You are a planning agent.

Break the problem into structured parts.

Problem:
${input}

Return JSON ONLY:
{
  "problemBreakdown": ["point1", "point2"],
  "stakeholders": ["user", "admin"]
}
`;

  const result = await callAI(prompt);

  return Response.json({ data: result });
}