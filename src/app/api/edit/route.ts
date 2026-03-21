import { callAI } from "@/lib/ai";

export async function POST(req: Request) {
  const { content, instruction } = await req.json();

  const prompt = `
You are an AI editor.

Edit the following content based on instruction.

Instruction:
${instruction}

Content:
${content}

Return only the improved text.
`;

  const result = await callAI(prompt);

  return Response.json({ data: result });
}