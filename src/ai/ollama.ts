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

      // 🔥 THIS IS THE IMPORTANT PART
      options: {
        temperature: 0,        // makes output deterministic
        top_p: 0.1,
        num_predict: 300,      // limit output length
      }
    }),
  });

  const data = await response.json();

  return data.response;
}