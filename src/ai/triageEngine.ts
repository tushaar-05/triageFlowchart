// src/ai/triageEngine.ts
import { callOllama } from "./ollama";

export async function callAI(input: string, history: string[]) {
  const systemPrompt = `
You are HealthSoft Triage Assistant running locally for rural healthcare workers.

You must output ONLY JSON.

Rules:
- Ask ONE question at a time
- Use simple options
- If enough info → give final result
- If uncertain → HIGH risk

Formats:

Question:
{
  "type": "question",
  "question": "...",
  "options": ["Yes", "No"]
}

Result:
{
  "type": "result",
  "risk_level": "LOW | MEDIUM | HIGH",
  "reason": "...",
  "action": "..."
}
`;

  const fullPrompt = `
${systemPrompt}

PATIENT INPUT: ${input}
HISTORY: ${history.join(" -> ")}
`;

  const raw = await callOllama(fullPrompt);

  // 🧠 Convert string → JSON safely
  try {
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    console.error("JSON parse failed", raw);

    // fallback safety
    return {
      type: "result",
      risk_level: "HIGH",
      reason: "AI output parsing failed",
      action: "Refer to doctor immediately",
    };
  }
}