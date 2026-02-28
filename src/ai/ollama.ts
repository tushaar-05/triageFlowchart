// src/ai/ollama.ts

export async function callOllama(prompt: string) {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "jayasimma/healthsoft",
      prompt: prompt,
      stream: false,
    }),
  });

  const data = await response.json();

  // Ollama returns text inside "response"
  return data.response;
}