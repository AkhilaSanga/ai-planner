import axios from "axios";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function callAI(prompt: string) {
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
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("❌ GROQ ERROR:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("❌ ERROR:", error.message);
    } else {
      console.error("❌ UNKNOWN ERROR:", error);
    }

    return "Error generating response";
  }
}