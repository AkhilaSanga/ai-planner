import axios from "axios";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function callAI(prompt: string) {
  try {
    const response = await axios.post(
      GROQ_URL,
      {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("AI Error:", error);
    return "Error generating response";
  }
}