export async function callLLM({
  provider,
  apiKey,
  prompt,
}) {
  if (!apiKey) {
    throw new Error("API key not provided");
  }

  switch (provider) {
    case "gemini":
      return callGemini(apiKey, prompt);
    default:
      throw new Error("Unsupported LLM provider");
  }
}

async function callGemini(apiKey, prompt) {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      apiKey,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Gemini API error");
  }

  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No response from AI"
  );
}
