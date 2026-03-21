export const runtime = "nodejs";

import { callAI } from "@/lib/ai";

export async function POST(req: Request) {
  const { content, instruction } = await req.json();

  if (!content || !instruction) {
    return Response.json(
      { error: "Missing content or instruction" },
      { status: 400 }
    );
  }

  const prompt = `You are a helpful AI editor.

Edit the following content based on the user's instruction.

Instruction: ${instruction}

Content:
${content}

Return only the edited text. No explanations, no markdown, just the improved content.`;

  try {
    const result = await callAI(prompt);
    return Response.json({ data: result });
  } catch (error) {
    console.error("Edit error:", error);
    return Response.json(
      { error: "Failed to edit content" },
      { status: 500 }
    );
  }
}
