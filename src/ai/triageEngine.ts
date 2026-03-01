// src/ai/triageEngine.ts
import { checkRedFlags } from "./guardrails";

const BACKEND_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function callAI(input: string, history: string[]) {
  // 🛡️ 1. Run Guardrails First (Offline, instant, deterministic)
  const redFlagMatch = checkRedFlags(input);
  if (redFlagMatch) {
    console.log("🚨 GUARDRAIL ENGAGED: Skipped AI, returning instant result.");
    return redFlagMatch;
  }

  // 🤖 2. If no red flags, call the secure backend proxy
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/ai/suggest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ input, history })
    });

    if (!response.ok) {
      throw new Error(`Backend returned status ${response.status}`);
    }

    const json = await response.json();

    if (!json.success || !json.data) {
      throw new Error("Backend failed to return valid data payload.");
    }

    return json.data;
  } catch (error) {
    console.error("AI Proxy Error:", error);

    // Fallback if the network or backend is completely unreachable
    return {
      type: "result",
      risk_level: "HIGH",
      reason: "Network error or AI service unreachable.",
      action: "Refer to doctor immediately"
    };
  }
}