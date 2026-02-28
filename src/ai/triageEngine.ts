// src/ai/triageEngine.ts
import { callOllama } from "./ollama";

function extractJSON(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  return text.slice(start, end + 1);
}

function normalizeRisk(risk: string) {
  const r = risk.toUpperCase();
  if (r.includes("HIGH")) return "HIGH";
  if (r.includes("MEDIUM")) return "MEDIUM";
  return "LOW";
}

export async function callAI(input: string, history: string[]) {
  const systemPrompt = `
You MUST return STRICT JSON only. Any other format is invalid.

You are a clinical triage assistant.

You MUST follow these rules strictly:

1. Output ONLY valid JSON
2. Do NOT include explanations
3. Do NOT include markdown
4. Do NOT include <think> tags
5. Do NOT include text before or after JSON

If asking a question:
{
  "type": "question",
  "question": "string",
  "options": ["option1", "option2", "option3"]
}

If final result:
{
  "type": "result",
  "risk_level": "LOW | MEDIUM | HIGH",
  "reason": "short reason",
  "action": "clear action"
}

Rules:
- If chest pain or breathing issue → HIGH
- If uncertain → HIGH
- Ask one question at a time
`;

  const fullPrompt = `
${systemPrompt}

PATIENT INPUT: ${input}
HISTORY: ${history.join(" -> ")}

Respond ONLY in JSON.
`;

  const raw = await callOllama(fullPrompt);

  const jsonString = extractJSON(raw);

  // 🛑 if no JSON found
  if (!jsonString) {
    console.error("No JSON found:", raw);
    return {
      type: "result",
      risk_level: "HIGH",
      reason: "Invalid AI output",
      action: "Refer to doctor immediately"
    };
  }

  try {
    const parsed = JSON.parse(jsonString);

    // 🧠 normalize risk level
    if (parsed.type === "result") {
      parsed.risk_level = normalizeRisk(parsed.risk_level);
    }

    return parsed;
  } catch (err) {
    console.error("Parse failed:", raw);

    return {
      type: "result",
      risk_level: "HIGH",
      reason: "AI output parsing failed",
      action: "Refer to doctor immediately"
    };
  }
}