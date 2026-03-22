import { NextResponse } from "next/server";

type ExecutionResponse = {
  data: {
    problemBreakdown: string;
    stakeholders: string;
    solution: string;
    actionPlan: string;
  };
};

export async function POST(req: Request): Promise<NextResponse<ExecutionResponse>> {
  try {
    const { insightOutput } = await req.json();

    const prompt = `You are an execution expert. Based on this insight: "${insightOutput}"

Generate a structured report with EXACTLY these 4 fields. Return ONLY valid JSON:

{
  "problemBreakdown": "List key problems using bullet points. Use • for bullets.",
  "stakeholders": "List stakeholders with • bullets. Format: • Name: Description",
  "solution": "Describe solution with • bullet points.",
  "actionPlan": "List numbered steps. Format: 1. Step description"
}

CRITICAL: Return ONLY the JSON object. No markdown, no code blocks, no extra text.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const apiData = await response.json();

    if (!apiData.choices || !apiData.choices[0]) {
      throw new Error("No response from API");
    }

    let raw = apiData.choices[0].message.content.trim();

    // Step 1: Remove markdown code blocks
    if (raw.includes("```")) {
      raw = raw.replace(/```[\s\S]*?```/g, "").trim();
    }
    if (raw.startsWith("```")) {
      raw = raw.substring(3);
    }
    if (raw.endsWith("```")) {
      raw = raw.substring(0, raw.length - 3);
    }

    raw = raw.trim();

    // Step 2: Find the JSON object
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No JSON object found in response");
    }

    raw = raw.substring(jsonStart, jsonEnd + 1);

    // Step 3: Clean problematic characters
    // Replace actual tabs, newlines, carriage returns in the middle of strings
    let cleaned = "";
    let inString = false;
    let escaped = false;

    for (let i = 0; i < raw.length; i++) {
      const char = raw[i];
      const code = char.charCodeAt(0);

      if (escaped) {
        cleaned += char;
        escaped = false;
        continue;
      }

      if (char === "\\") {
        cleaned += char;
        escaped = true;
        continue;
      }

      if (char === '"' && !escaped) {
        inString = !inString;
        cleaned += char;
        continue;
      }

      // Inside strings, replace control characters
      if (inString) {
        if (code < 32 && code !== 9) {
          // Replace control chars (except tab) with space
          cleaned += " ";
        } else {
          cleaned += char;
        }
      } else {
        cleaned += char;
      }
    }

    raw = cleaned;

    // Step 4: Try to parse
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Cleaned:", raw.substring(0, 500));

      // Provide fallback
      parsed = {
        problemBreakdown: "• Problem analysis required\n• Solution implementation needed",
        stakeholders: "• Team members\n• Management",
        solution: "• Strategic approach\n• Technical implementation",
        actionPlan: "1. Analyze requirements\n2. Plan solution\n3. Execute plan",
      };
    }

    // Step 5: Validate and sanitize all fields
    const data = {
      problemBreakdown: sanitizeString(parsed.problemBreakdown),
      stakeholders: sanitizeString(parsed.stakeholders),
      solution: sanitizeString(parsed.solution),
      actionPlan: sanitizeString(parsed.actionPlan),
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Execution route error:", error);

    // Return safe fallback
    return NextResponse.json({
      data: {
        problemBreakdown:
          "• Unable to generate detailed analysis at this time\n• Please try again",
        stakeholders: "• Internal team\n• Stakeholders",
        solution: "• Solution approach to be determined\n• Implementation plan required",
        actionPlan:
          "1. Review requirements\n2. Develop strategy\n3. Implement solution\n4. Monitor results",
      },
    });
  }
}

function sanitizeString(value: any): string {
  if (typeof value !== "string") {
    return String(value || "");
  }

  // Remove control characters but keep newlines
  return value
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ")
    .substring(0, 5000)
    .trim();
}
