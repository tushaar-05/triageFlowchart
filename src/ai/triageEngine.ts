// src/ai/triageEngine.ts
import { checkRedFlags } from "./guardrails";

const BACKEND_API_URL = import.meta.env.VITE_API_URL || '';

export async function callAI(input: string, history: string[]) {
  // 🛡️ 1. Run Guardrails First (Offline, instant, deterministic)
  const redFlagMatch = checkRedFlags(input);
  if (redFlagMatch) {
    console.log("🚨 GUARDRAIL ENGAGED: Skipped AI, returning instant result.");
    return redFlagMatch;
  }

  // 🤖 2. If no red flags, call the secure backend proxy
  try {
    const apiUrl = `${BACKEND_API_URL}/api/ai/suggest`;
    console.log("Hitting Backend API:", apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ input, history })
    });

    if (!response.ok) {
      // Attempt to parse the backend error JSON payload instead of throwing a generic error.
      let backendErrorData = null;
      try {
        const errorJson = await response.json();
        if (errorJson && errorJson.data) {
          backendErrorData = errorJson.data;
        }
      } catch (e) {
        // failed to parse
      }

      if (backendErrorData) {
        return backendErrorData;
      }
      throw new Error(`Backend returned status ${response.status}`);
    }

    const { success, data, message } = await response.json();

    if (!success || !data) {
      throw new Error(message || "Backend failed to return valid data payload.");
    }

    return data;
  } catch (error: any) {
    console.error("AI Proxy Error:", error);

    // Fallback if the network or backend is completely unreachable
    return {
      type: "result",
      risk_level: "HIGH",
      reason: `Network error or AI service unreachable: ${error.message || error}`,
      action: "Refer to doctor immediately"
    };
  }
}