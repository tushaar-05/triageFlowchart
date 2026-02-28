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
        Return an array of EXACTLY 3 JSON objects representing strictly formatted follow-up questions to ask the patient.
        Format must exact match: [{ "id": "q1", "question": "Are you experiencing shortness of breath?", "type": "Binary", "options": ["Yes", "No"] }]
        Provide only valid JSON array.
    `;

  try {
    const response = await ollama.chat({
      model: 'jayasimma/healthsoft', // Switched to the specific health model you pulled locally!
      messages: [{ role: 'user', content: prompt }],
      format: 'json'
    });

    // Parse JSON output
    let content = response.message.content;

    // Basic sanitization in case ollama outputs markdown
    if (content.startsWith('```json')) content = content.substring(7);
    if (content.endsWith('```')) content = content.substring(0, content.length - 3);

    const suggestions = JSON.parse(content.trim());

    // Quick map to ensure IDs are somewhat unique
    const mappedSuggestions = suggestions.map((s: any, i: number) => ({
      ...s,
      id: `sq-l${currentLevel}-${i}-${Date.now()}`
    }));

    res.json({ success: true, suggestions: mappedSuggestions });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ success: false, message: "Ollama offline or failed." });
  }
});

export default router;
