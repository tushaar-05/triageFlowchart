import { Router } from 'express';
import Groq from 'groq-sdk';

const router = Router();
const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';

// Initialize Groq. It automatically picks up process.env.GROQ_API_KEY
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || ''
});

function extractJSON(text: string) {
  let cleanedText = text;
  if (text.includes('</think>')) {
    cleanedText = text.split('</think>').pop() || '';
  }

  const start = cleanedText.indexOf("{");
  const end = cleanedText.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  return cleanedText.slice(start, end + 1);
}

function normalizeRisk(risk: string) {
  const r = risk.toUpperCase();
  if (r.includes("HIGH")) return "HIGH";
  if (r.includes("MEDIUM")) return "MEDIUM";
  return "LOW";
}

router.post('/suggest', async (req, res) => {
  const { input, history } = req.body;

  if (!input) {
    return res.status(400).json({ success: false, message: "Input is required" });
  }

  const systemPrompt = `
You MUST return STRICT JSON only. Any other format is invalid.

You are a clinical triage assistant for a nurse.

You MUST follow these rules strictly:
1. Output ONLY valid JSON
2. Do NOT include explanations
3. Do NOT include markdown
4. Do NOT include <think> tags
5. Do NOT include text before or after JSON

Your output MUST ALWAYS be strictly valid JSON.

If you can confidently make a final assessment based on the provided symptoms, output EXACTLY this JSON structure:
{
  "type": "result",
  "risk_level": "LOW" | "MEDIUM" | "HIGH",
  "reason": "short explanation for the risk level",
  "action": "clear medical action to take (e.g., 'Refer to ER', 'Rest and monitor'. DO NOT say 'Ask for more information', use type: 'question' instead)"
}

If you DO NOT have enough information and must ask follow-up questions, output EXACTLY this JSON structure:
{
  "type": "question",
  "risk_level": "LOW",
  "reason": "reasoning for why you need more information",
  "follow_up_questions": [
    {
      "question": "What type of headache are you experiencing?",
      "priority": "HIGH",
      "expected_answers": ["Throbbing", "Dull ache", "Sharp", "Other"]
    },
    {
      "question": "Where exactly is the pain located?",
      "priority": "MEDIUM",
      "expected_answers": ["Forehead", "Back of head", "One side", "Other"]
    },
    {
      "question": "Have you taken any medication for it?",
      "priority": "MEDIUM",
      "expected_answers": ["Yes, ibuprofen", "Yes, tylenol", "No", "Other"]
    },
    {
      "question": "Are you experiencing any nausea?",
      "priority": "LOW",
      "expected_answers": ["Yes", "No", "Unsure", "Other"]
    }
  ]
}

Rules:
- 🛑 CRITICAL: Carefully read the CONVERSATION TRANSCRIPT below. You must evaluate the patient's latest message in the context of the entire conversation.
- If the patient definitively reports chest pain or breathing issues anywhere in the transcript → risk_level: "HIGH", type: "result"
- 🛑 CRITICAL: If the combined symptoms from the transcript are still vague (e.g., "headache", "stomach ache"), you MUST use the "question" JSON structure to gather more details. NEVER output "type": "result" if you need to ask more questions.
- When using the "question" structure, generate EXACTLY 4 highly relevant, unique follow-up questions you could ask based on their specific symptoms. Do NOT copy the example from the prompt.
- For EACH question, assign a "priority" ("HIGH", "MEDIUM", or "LOW") based on how urgent or critical that specific question is for triage.
- 🛑 CRITICAL: Do NOT output literal <OPTION> tags. For EACH question, provide EXACTLY ONE array called "expected_answers" containing EXACTLY 4 items. The first 3 items must be ACTUAL, LOGICAL, SHORT ANSWERS generated for that specific question, and the 4th item MUST be exactly the string "Other". Do not use duplicate keys.
- ALWAYS ask questions until you are confident in a final risk level to return as a "result".
`;

  const transcript = [...(history || []), `Patient: ${input}`].join("\n");

  const fullPrompt = `
${systemPrompt}

CONVERSATION TRANSCRIPT:
${transcript}

Respond ONLY in JSON.
`;

  let raw = "";
  let parsed: any = null;
  let attempts = 0;
  const MAX_ATTEMPTS = 2; // Retry if it gives a final result on the first turn

  while (attempts < MAX_ATTEMPTS) {
    attempts++;
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: fullPrompt }],
        model: 'llama-3.1-8b-instant', // Fast, reliable model for JSON
        temperature: 0.1,
        response_format: { type: 'json_object' }
      });

      raw = chatCompletion.choices[0]?.message?.content || "";
      const jsonString = extractJSON(raw);

      if (!jsonString) {
        console.error("No JSON found on attempt", attempts);
        continue; // Try again
      }

      parsed = JSON.parse(jsonString);

      // GUARDRAIL: If it's the very first message (history is empty)
      // and the AI tries to give a final result, force it to retry!
      if ((!history || history.length === 0) && parsed.type === "result") {
        console.warn("⚠️ AI attempted to return a final result on the first turn. Forcing a retry for questions...");
        parsed = null; // Clear and retry
        continue;
      }

      // Successfully parsed and passed guardrails
      break;
    } catch (err) {
      console.error("Groq/Parse failed on attempt", attempts, err);
    }
  }

  // Fallback if all attempts fail
  if (!parsed) {
    return res.status(500).json({
      success: false,
      data: {
        type: "result",
        risk_level: "HIGH",
        reason: "AI output parsing failed or refused to ask questions",
        action: "Refer to doctor immediately"
      }
    });
  }

  // 🧠 normalize risk level
  if (parsed.type === "result") {
    parsed.risk_level = normalizeRisk(parsed.risk_level);
  }

  return res.json({ success: true, data: parsed });
});

router.post('/generate', async (req, res) => {
  const { prompt, model, stream, options } = req.body;
  try {
    const rawResponse = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, model, stream, options })
    });
    const data = await rawResponse.json();
    res.json(data);
  } catch (err) {
    console.error("Ollama proxy error:", err);
    res.status(500).json({ error: String(err) });
  }
});

export default router;
