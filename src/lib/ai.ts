import axios from "axios";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function callAI(prompt: string) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.error("❌ GROQ_API_KEY not set in environment variables");
    throw new Error("API key not configured");
  }

  try {
    const response = await axios.post(
      GROQ_URL,
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const content = response.data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response content from API");
    }

    return content;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;

      console.error("❌ GROQ API Error:");
      console.error("Status:", status);
      console.error("Data:", data);
      console.error("Message:", error.message);

      if (status === 401) {
        throw new Error("Invalid API key");
      } else if (status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      } else if (status === 500) {
        throw new Error("API server error. Please try again.");
      }
    } else if (error instanceof Error) {
      console.error("❌ Error:", error.message);
    } else {
      console.error("❌ Unknown error:", error);
    }

    throw error;
  }
}

