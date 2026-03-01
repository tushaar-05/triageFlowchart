export async function callOllama(prompt: string) {
  console.log("🚀 SENDING PROMPT TO OLLAMA:\n", prompt);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const response = await fetch(`${apiUrl}/api/ai/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "jayasimma/healthsoft",
      prompt: prompt,
      stream: false,
      // 🔥 THIS IS THE IMPORTANT PART
      options: {
        temperature: 0.1,
        top_p: 0.1,
        num_predict: 1000
      }
    }),
  });

  const data = await response.json();

  console.log("🧠 RAW MODEL RESPONSE:\n", data.response);

  return data.response;
}