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

You are a clinical triage assistant for a nurse.

You MUST follow these rules strictly:

1. Output ONLY valid JSON
2. Do NOT include explanations
3. Do NOT include markdown
4. Do NOT include <think> tags
5. Do NOT include text before or after JSON

If you DO NOT have enough information and need to ask follow-up questions, use this format:
{
  "type": "question",
  "suggested_questions": [
    {
      "question": "Clear and concise follow up question",
      "options": ["Option 1", "Option 2", "Option 3"],
      "severity": "HIGH | MEDIUM | LOW"
    }
  ]
}

If you have enough information to make a final triage decision, use this format:
{
  "type": "result",
  "risk_level": "LOW | MEDIUM | HIGH",
  "reason": "short reason why this risk level was chosen",
  "action": "clear action to take"
}

Important Rules for Questions:
- If symptoms are vague (e.g., "stomach ache", "headache"), ALWAYS return "type": "question" to ask follow-up questions first.
- You must generate up to 4 or 5 'suggested_questions' that the nurse might need to ask next.
- For each expected question, provide exactly 3 expected 'options' why this might be happening (The UI will automatically add a text box for "Other").
- Provide the 'severity' of whether it should actually be asked (HIGH, MEDIUM, LOW).
- Do not jump to HIGH risk immediately unless the user explicitly mentions emergency symptoms like severe chest pain, inability to breathe, or loss of consciousness.
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