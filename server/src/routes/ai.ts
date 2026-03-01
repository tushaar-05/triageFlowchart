import { Router } from 'express';
import { Ollama } from 'ollama';

const router = Router();
const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
const ollama = new Ollama({ host: ollamaUrl });

router.post('/suggest-layer', async (req, res) => {
  const { complaint, currentLevel } = req.body;

  const prompt = `
        You are an expert triage AI. Focus: Medical protocols.
        Patient complaint: "${complaint}".
        We are at triage level ${currentLevel}. 
        Return a JSON array containing EXACTLY 3 strictly formatted follow-up questions to ask the patient.
        You MUST wrap the output in a JSON array. DO NOT output a single object.
        Format must exact match: 
        [
          { "id": "q1", "question": "Are you experiencing shortness of breath?", "type": "Binary", "options": ["Yes", "No"] },
          { "id": "q2", "question": "Does the pain radiate?", "type": "Binary", "options": ["Yes", "No"] },
          { "id": "q3", "question": "How long has it lasted?", "type": "Multiple Choice", "options": ["<1 hr", "1-24 hrs", ">24 hrs"] }
        ]
    `;

  try {
    const response = await ollama.chat({
      model: 'jayasimma/healthsoft', // Switched to the specific health model you pulled locally!
      messages: [{ role: 'user', content: prompt }],
      format: 'json'
    });

    // Parse JSON output
    let content = response.message.content;

    // Robust extraction for models that add conversational text around JSON
    const startArr = content.indexOf('[');
    const endArr = content.lastIndexOf(']');
    const startObj = content.indexOf('{');
    const endObj = content.lastIndexOf('}');

    // Pick whichever brackets correctly enclose valid JSON
    if (startArr !== -1 && endArr !== -1 && (startObj === -1 || startArr < startObj)) {
      content = content.slice(startArr, endArr + 1);
    } else if (startObj !== -1 && endObj !== -1) {
      content = content.slice(startObj, endObj + 1);
    }

    console.log("Extracted content to parse:", content);
    const parsed = JSON.parse(content.trim());
    console.log("Parsed JSON:", JSON.stringify(parsed, null, 2));

    let suggestionsArray: any[] = [];
    if (Array.isArray(parsed)) {
      suggestionsArray = parsed;
    } else if (parsed.question && Array.isArray(parsed.options)) {
      // The model returned a single question object instead of an array!
      suggestionsArray = [parsed];
    } else if (parsed.questions && Array.isArray(parsed.questions)) {
      suggestionsArray = parsed.questions;
    } else if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
      suggestionsArray = parsed.suggestions;
    } else {
      // Last resort: search for ANY array inside the object
      for (const val of Object.values(parsed)) {
        if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object') {
          suggestionsArray = val as any[];
          break;
        }
      }
    }

    if (!suggestionsArray || suggestionsArray.length === 0) {
      throw new Error("Could not extract a valid array from AI output.");
    }

    // Quick map to ensure IDs are somewhat unique and schema is safe
    const mappedSuggestions = suggestionsArray.map((s: any, i: number) => ({
      id: `sq-l${currentLevel}-${i}-${Date.now()}`,
      question: s.question || "Unable to parse question from AI",
      type: s.type || "Binary",
      options: Array.isArray(s.options) ? s.options : ["Yes", "No"],
    }));

    res.json({ success: true, suggestions: mappedSuggestions });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ success: false, message: "Ollama offline or failed." });
  }
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
