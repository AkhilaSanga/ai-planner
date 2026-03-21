import { callAI } from "@/lib/ai";

export async function POST(req: Request) {
  const { plannerOutput } = await req.json();

  const prompt = `
You are an insight agent.

Enhance this with reasoning and context:

${plannerOutput}

Return improved structured explanation.
`;

  const result = await callAI(prompt);

  return Response.json({ data: result });
}