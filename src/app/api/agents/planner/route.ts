import { callAI } from "@/lib/ai";

export async function POST(req: Request) {
  const { input } = await req.json();

  const prompt = `You are a planning agent. Analyze the following problem and create a structured plan.

${input}

Provide a clear analysis of the problem. Include:
- Key challenges
- Key considerations
- Preliminary insights

Be concise but comprehensive. Format with line breaks between sections.
Do NOT return JSON. Just return plain text with clear structure.`;

  try {
    const result = await callAI(prompt);
    return Response.json({ data: result });
  } catch (error) {
    console.error("Planner error:", error);
    return Response.json(
      { error: "Failed to generate plan" },
      { status: 500 }
    );
  }
}