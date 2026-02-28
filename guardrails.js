// guardrails.js

export function checkRedFlags(initialInput) {
  const text = initialInput.toLowerCase();

  const redFlags = [
    "breathing difficulty",
    "difficulty breathing",
    "chest pain",
    "unconscious",
    "unresponsive",
    "seizure",
    "convulsion",
    "severe bleeding",
    "bleeding heavily",
    "not able to drink",
    "unable to drink",
    "severe dehydration",
    "blue lips",
    "oxygen low",
    "spo2 low",
    "no pulse"
  ];

  for (let flag of redFlags) {
    if (text.includes(flag)) {
      return {
        type: "result",
        risk_level: "HIGH",
        reason: `Red flag symptom detected: ${flag}`,
        action: "Immediate emergency referral required"
      };
    }
  }

  return null; // safe to proceed with AI
}