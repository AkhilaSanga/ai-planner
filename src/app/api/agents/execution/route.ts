import { callAI } from "@/lib/ai";

export async function POST(req: Request) {
  const { insightOutput } = await req.json();

  const prompt = `You are an execution agent. Generate a structured report based on the insights below.

${insightOutput}

Return ONLY a JSON object with these exact fields (all as plain text strings):
{
  "problemBreakdown": "Detailed explanation of the problem using bullet points (• format)",
  "stakeholders": "List of stakeholders involved, describe their roles",
  "solution": "Comprehensive solution approach with clear steps",
  "actionPlan": "Numbered action items (1. 2. 3. format)"
}

CRITICAL:
- Return ONLY valid JSON
- No markdown code blocks
- No extra text before or after JSON
- All fields must be plain text strings
- Use \\n for line breaks in the JSON strings
- Use • for bullet points
- Use 1. 2. 3. for numbered lists`;

  let raw = await callAI(prompt);

  // Clean up response
  raw = raw.trim();
  raw = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "");
  
  // Extract JSON if there's extra text
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    raw = jsonMatch[0];
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    console.error("JSON Parse Error:", error);
    console.error("Raw:", raw.substring(0, 300));
    
    // Fallback to structured but unparseable response
    parsed = {
      problemBreakdown: raw || "Unable to parse response",
      stakeholders: "See problem breakdown",
      solution: "See problem breakdown",
      actionPlan: "See problem breakdown",
    };
  }

  // Validate all fields are strings
  const validated = {
    problemBreakdown: String(parsed.problemBreakdown || ""),
    stakeholders: String(parsed.stakeholders || ""),
    solution: String(parsed.solution || ""),
    actionPlan: String(parsed.actionPlan || ""),
  };

  return Response.json({ data: validated });
}