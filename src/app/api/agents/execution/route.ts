import { callAI } from "@/lib/ai";

export async function POST(req: Request) {
  const { insightOutput } = await req.json();

  const prompt = `
You are an execution agent.

Return ONLY valid JSON. No markdown. No code blocks.

IMPORTANT:
- All fields MUST be plain strings (no objects, no arrays)
- Do NOT use \`\`\`json or formatting

Format:
{
  "problemBreakdown": "Explain in clear paragraphs",
  "stakeholders": "List stakeholders in text format",
  "solution": "Explain solution clearly",
  "actionPlan": "Step-by-step plan in text"
}

Input:
${insightOutput}
`;

  let raw = await callAI(prompt);

  // ✅ Remove markdown if AI still sends it
  raw = raw.replace(/```json|```/g, "").trim();

  let parsed;

  try {
    // Remove markdown if present
  let cleaned = raw.replace(/```json|```/g, "").trim();

  // Extract only JSON part (important fix)
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start !== -1 && end !== -1) {
    cleaned = cleaned.substring(start, end + 1);
  }

  parsed = JSON.parse(cleaned);
} catch (e) {
  console.log("❌ JSON Parse Failed:", raw);

    parsed = {
      problemBreakdown: raw, // return raw text if parsing fails
      stakeholders: "Not generated",
      solution: "Not generated",
      actionPlan: "Not generated",
    };
  }

  return Response.json({ data: parsed });
}