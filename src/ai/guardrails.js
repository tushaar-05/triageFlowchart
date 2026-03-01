"use strict";
// src/ai/guardrails.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRedFlags = checkRedFlags;
function checkRedFlags(inputText) {
    if (!inputText)
        return null;
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
        "oxygen low",
        "cancer"
    ];
    // More robust matching: check if the keyword is present but NOT preceded by negations
    // like "no", "not having", "without", etc., within a few words.
    for (let keyword of redFlags) {
        if (text.includes(keyword)) {
            const idx = text.indexOf(keyword);
            // Get up to 30 characters before the keyword
            const precedingText = text.slice(Math.max(0, idx - 30), idx).trim();
            // Check for common negations leading up to the keyword
            const negations = ["no", "not", "without", "doesn't have", "does not have", "denies"];
            let hasNegation = false;
            for (let neg of negations) {
                // We just check if the negation word appears in the immediate preceding text
                // (This handles "no chest pain" and "no severe chest pain")
                // We add spaces around to ensure we don't match substrings like "nothing" when we want "no"
                // But since it could be at the start of the string, we just do a simpler check 
                // using regex boundary
                const regex = new RegExp(`\\b${neg}\\b`, "i");
                if (regex.test(precedingText)) {
                    hasNegation = true;
                    break;
                }
            }
            // If it's a true positive, fire the guardrail.
            if (!hasNegation) {
                return {
                    type: "result",
                    risk_level: "HIGH",
                    reason: `Red flag symptom detected: ${keyword}`,
                    action: "Immediate emergency referral required"
                };
            }
        }
    }
    return null;
}
