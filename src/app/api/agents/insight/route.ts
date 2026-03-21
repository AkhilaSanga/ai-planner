import { callAI } from "@/lib/ai";

export async function POST(req: Request) {
  const { plannerOutput } = await req.json();

  const prompt = `You are an insight agent. Take the following analysis and extract deeper insights.

${plannerOutput}

Provide strategic insights about:
- Root causes
- Stakeholder perspectives
- Opportunities and risks

Format with clear sections. Use line breaks between ideas.
Do NOT return JSON. Just return plain text with clear structure.`;

  try {
    const result = await callAI(prompt);
    return Response.json({ data: result });
  } catch (error) {
    console.error("Insight error:", error);
    return Response.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}