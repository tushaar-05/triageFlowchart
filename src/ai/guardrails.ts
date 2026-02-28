// src/ai/guardrails.ts

export type TriageResult = {
  type: "result";
  risk_level: "HIGH";
  reason: string;
  action: string;
};

export function checkRedFlags(inputText: string): TriageResult | null {
  if (!inputText) return null;

  const text = inputText.toLowerCase();

  const redFlags = [
    "breathing difficulty",
    "difficulty breathing",
    "shortness of breath",
    "not breathing",
    "chest pain",
    "pressure in chest",
    "unconscious",
    "unresponsive",
    "fainted",
    "seizure",
    "convulsion",
    "bleeding heavily",
    "severe bleeding",
    "vomiting blood",
    "blood in vomit",
    "blood in stool",
    "unable to drink",
    "not able to drink",
    "very weak cannot stand",
    "severe dehydration",
    "no urine",
    "blue lips",
    "spo2",
    "oxygen low"
  ];

  for (let keyword of redFlags) {
    if (text.includes(keyword)) {
      return {
        type: "result",
        risk_level: "HIGH",
        reason: `Red flag symptom detected: ${keyword}`,
        action: "Immediate emergency referral required"
      };
    }
  }

  return null;
}