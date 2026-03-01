# TriageFlow AI

AI-powered, offline-capable clinical triage flowchart builder for frontline healthcare workers.

---

## 1. Problem Statement

### Problem Title
Offline-First AI-Assisted Triage System for Rural and Under-Resourced Healthcare Settings

### Problem Description
In rural clinics and primary healthcare centers, nurses and paramedics conduct initial patient triage without access to specialist doctors. Existing triage systems rely on rigid paper-based flowcharts and static checklists that cannot adapt to a patient's specific complaint, are prone to human error, and fail entirely without internet access.

There is a critical need for a flexible, AI-driven, and offline-first triage system that enables structured, consistent, and risk-based patient prioritization.

### Target Users
- Rural nurses and paramedics
- Community health workers
- Primary healthcare center staff
- Emergency department nurses
- Field medical program volunteers

### Existing Gaps
- Static paper-based triage guides with no adaptability
- No AI-assisted dynamic question generation based on patient complaints
- Inconsistent patient prioritization across staff members
- Lack of structured digital decision-support tools for offline environments
- High cognitive load during peak patient inflow periods
- No per-patient persistent flowchart history

---

## 2. Problem Understanding & Approach

### Root Cause Analysis
- Triage systems are static and cannot adapt to individual patient complaints
- No structured digital decision-tree editors exist for rural, offline deployment
- Healthcare workers lack real-time structured guidance during assessment
- Cloud-based AI solutions are impractical in low-connectivity environments

### Solution Strategy
Design an offline-first, AI-assisted triage flowchart builder that:
- Dynamically generates clinically relevant questions based on patient's exact complaint
- Guides the nurse through a structured multi-layer question flow
- Produces a final risk assessment (LOW / MEDIUM / HIGH) with a recommended action
- Persists each patient's flowchart independently for future review
- Works with or without internet (graceful fallback to mock data)

---

## 3. Proposed Solution

### Solution Overview
TriageFlow AI is an offline-capable triage decision-support system. A nurse enters a patient complaint, and the AI dynamically generates a layered set of follow-up questions. After 2–3 layers of structured Q&A, the system outputs a final triage decision (risk level + action recommendation) rendered as an interactive canvas flowchart.

### Core Idea
- AI-generated question layers based on the patient's natural-language complaint
- Multi-turn structured Q&A converging to a final clinical decision
- Each patient session is saved independently and resumable on reload
- Exportable as a structured JSON file for records

### Key Features
- AI-generated multi-layer triage questions via Groq (llama-3.1-8b-instant)
- Dynamic canvas-based flowchart using React Flow
- Locked & colour-coded completed layers (no accidental edits)
- Final Decision card: Risk level (LOW/MEDIUM/HIGH), action, clinical rationale
- Per-patient persistent state stored in browser localStorage
- Export flowchart as JSON
- "Past Patients" dashboard with one-click flowchart resumption
- "Fill Demo" button with 5 realistic patient presets for quick testing
- Offline-first architecture with graceful AI fallback

---

## 4. System Architecture

### High-Level Flow
```
User (Nurse)
  → Frontend (React + React Flow — Vercel)
  → Backend (Node.js / Express — Render)
  → AI Model (Groq API — llama-3.1-8b-instant)
  → Browser Storage (IndexedDB via Dexie + localStorage)
  → Response & Flowchart Rendered on Canvas
```

### Architecture Description
1. Nurse opens the app and adds a new patient (name, age, gender).
2. On the triage canvas, the nurse enters the patient's chief complaint and clicks **Start Triage**.
3. The frontend sends the complaint to the Express backend (`/api/ai/suggest`).
4. The backend constructs a structured clinical prompt and calls the Groq AI API.
5. The AI returns either follow-up questions or a final risk assessment in strict JSON format.
6. Layer 1 questions are rendered as interactive node cards on the React Flow canvas.
7. The nurse answers each question; once all are answered, the layer is **locked** and the next layer is requested.
8. After 2 layers (8+ answered questions), the system forces a Final Decision output.
9. The Final Decision card shows risk level, recommended action, and clinical reasoning.
10. The entire session is saved to localStorage under a per-patient key and can be exported as JSON.

### Architecture Diagram
*(Add system architecture diagram image here)*

---

## 5. Database Design

### ER Diagram
*(Add ER diagram image here)*

### ER Diagram Description

**Patients** (stored in IndexedDB via Dexie)
| Field | Type | Description |
|---|---|---|
| id | auto-increment | Primary key |
| name | string | Patient full name |
| age | number | Patient age |
| gender | string | Male / Female |
| chief_complaint | string | Primary symptom |
| created_at | ISO string | Record timestamp |
| synced | boolean | Cloud sync status |

**Triage Flow State** (stored in localStorage per patient)
| Key | Value |
|---|---|
| `triageFlow_${patientId}` | JSON blob: nodes, edges, complaint, currentLevel, hasStarted |

---

## 6. Dataset Selected

| Field | Details |
|---|---|
| **Dataset Name** | Clinical triage conversation examples (used for prompt engineering) |
| **Source** | Synthetically designed based on standard CTAS / ESI triage protocols |
| **Data Type** | Text — structured symptom-question-answer pairs |
| **Selection Reason** | No public dataset matched the multi-turn triage Q&A format needed; prompts were engineered to elicit clinically relevant structured JSON output from the model |
| **Preprocessing Steps** | Prompt structure tested and iteratively refined; strict JSON schema enforced via `response_format: { type: 'json_object' }` in Groq API |

---

## 7. Model Selected

### Model Name
**Groq — `llama-3.1-8b-instant`** (cloud inference, production)
**Ollama — `jayasimma/healthsoft`** (local inference, offline fallback)

### Selection Reasoning
- **Groq** provides ultra-low-latency inference (<500ms) via their LPU hardware — ideal for real-time triage Q&A loops
- `llama-3.1-8b-instant` reliably follows strict JSON schema instructions, critical for structured medical output
- **HealthSoft** (1.3B parameters) chosen as the offline fallback — lightweight, privacy-preserving, runs on 4 GB RAM
- Both models were validated to return clinically coherent triage questions and risk assessments

### Alternatives Considered
| Model | Reason Not Selected |
|---|---|
| GPT-4o | Cloud-only, cost, no offline fallback |
| Mistral 7B | Slower inference, less reliable JSON adherence |
| BioMedLM | Too large for offline deployment targets |

### Evaluation Metrics
- JSON schema compliance rate (target: >95%)
- Clinical relevance of generated questions (manual nurse review)
- Final decision accuracy on 5 demo patient presets
- Latency per layer (target: <2 seconds end-to-end)

---

## 8. Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, React Flow (@xyflow/react), React Router v6, Vite |
| **Styling** | Tailwind CSS |
| **Backend** | Node.js, Express.js, TypeScript |
| **AI / ML** | Groq API (`llama-3.1-8b-instant`), Ollama (`jayasimma/healthsoft`) |
| **Database** | Dexie.js (IndexedDB wrapper) for patient records; localStorage for per-patient flowchart state |
| **Deployment** | Vercel (frontend), Render (backend) |

---

## 9. API Documentation & Testing

### API Endpoints List

**Endpoint 1: Generate AI Triage Questions or Final Decision**
```
POST /api/ai/suggest
Content-Type: application/json

Body:
{
  "input": "I can't hear from my left ear",
  "history": [
    "AI Question: How long have you had this? -> Patient: Since this morning",
    ...
  ]
}

Response:
{
  "success": true,
  "data": {
    "type": "question",
    "risk_level": "LOW",
    "reason": "...",
    "follow_up_questions": [...]
  }
}
```

**Endpoint 2: Proxy Ollama Generation (offline fallback)**
```
POST /api/ai/generate
Content-Type: application/json

Body:
{
  "model": "jayasimma/healthsoft",
  "prompt": "...",
  "stream": false
}
```

**Endpoint 3: Health Check**
```
GET /api/health

Response:
{ "status": "ok", "timestamp": "..." }
```

### API Testing Screenshots
*(Add Postman / Thunder Client screenshots here)*

---

## 10. Module-wise Development & Deliverables

### Checkpoint 1: Research & Planning
**Deliverables:**
- Problem statement and target user definition
- Decision-tree protocol structure design
- AI prompt strategy for structured JSON output
- Technology stack selection

### Checkpoint 2: Backend Development
**Deliverables:**
- Express.js server with CORS, dotenv, and modular routing
- `/api/ai/suggest` endpoint with Groq integration
- `/api/ai/generate` endpoint as Ollama proxy
- Backend guardrails: force final result after 8 answered questions
- `.env.production` for Vercel → Render connection

### Checkpoint 3: Frontend Development
**Deliverables:**
- Dashboard with patient management (Add Patient modal, Past Patients list)
- Per-patient flowchart persistence in localStorage
- Export flowchart to JSON
- "Fill Demo" button with 5 realistic patient presets
- React Flow canvas with custom `QuestionNode`, `LevelZoneNode`, `RootNode`

### Checkpoint 4: Model Training
**Deliverables:**
- Prompt engineering for strict clinical JSON schema
- System prompt with guardrails (red-flag detection, force-result directive)
- `forceResult` logic when `answeredHistory.length >= 8`

### Checkpoint 5: Model Integration
**Deliverables:**
- Groq API integration in backend with `response_format: json_object`
- Ollama local proxy via backend (CORS bypass)
- Graceful fallback to mock question arrays when AI is unavailable
- Final Decision card with risk-level colour coding (RED/AMBER/GREEN)

### Checkpoint 6: Deployment
**Deliverables:**
- Frontend deployed to Vercel
- Backend deployed to Render
- `VITE_API_URL` set via `.env.production` committed to repo
- `GROQ_API_KEY` set in Render environment variables
- End-to-end smoke test across all 5 demo patient presets

---

## 11. End-to-End Workflow

1. Nurse opens the TriageFlow AI app and logs in.
2. On the Dashboard, nurse clicks **Add Patient** and fills in Name, Age, Gender.
3. App navigates to the triage canvas — nurse types the patient's chief complaint and clicks **Start Triage**.
4. The AI generates Layer 1 (4 clinically relevant questions) auto-placed on the canvas.
5. Nurse reads each question card aloud to the patient and clicks the answer.
6. Once all Layer 1 questions are answered, the layer is locked and Layer 2 is generated.
7. After Layer 2 is answered (8 total answers), the system generates the **Final Decision** layer.
8. The Final Decision card shows: Risk Level, Recommended Action, Clinical Reason.
9. Nurse clicks **Complete Triage**; the session is auto-saved per patient.
10. Nurse can return to the Dashboard to see past patients and reopen any flowchart.
11. Nurse clicks **Export JSON** to save the full flowchart as a structured file for records.

---

## 12. Demo & Video

**Live Demo Link:** https://triagesystem.vercel.app

**Demo Video Link:**

**GitHub Repository:** https://github.com/tushaar-05/triageFlowchart

---

## 13. Hackathon Deliverables Summary

- ✅ AI-assisted dynamic triage question generation (Groq + Ollama)
- ✅ Multi-layer interactive flowchart canvas (React Flow)
- ✅ Final risk assessment with action recommendation
- ✅ Per-patient persistent flowchart state (localStorage + IndexedDB)
- ✅ Offline-first architecture with graceful fallback
- ✅ Patient dashboard with "Past Patients" list and flowchart resumption
- ✅ JSON export of complete triage session
- ✅ Deployed: Vercel (frontend) + Render (backend)

---

## 14. Team Roles & Responsibilities

| Member Name | Role | Responsibilities |
|---|---|---|
| Tushar Singh | Full Stack & AI Integration | Frontend (React, React Flow), Backend (Node.js, Express), AI prompt engineering, Groq/Ollama integration, deployment |
| Sai Hrudhay | AI Models | AI model research, HealthSoft model selection, offline model evaluation |
| Madhav Agarwal | Frontend | UI components, flowchart builder interface |

---

## 15. Future Scope & Scalability

### Short-Term
- Multi-language support (Hindi, Tamil, regional languages)
- Voice input for patient complaints
- Nurse-facing confidence indicator per AI question
- Printable triage summary PDF

### Long-Term
- Integration with national EHR/ABHA health ID systems
- Real-time sync when internet is available (background service worker)
- State-wide deployment across rural PHC networks
- Regulatory compliance layer (HIPAA / ABDM)
- Fine-tuned clinical model trained on Indian clinical datasets
- Multi-user role management (nurse vs. doctor vs. admin)

---

## 16. Known Limitations

- AI output quality depends on the Groq API being reachable (online mode required for production)
- Local Ollama model (HealthSoft) requires the user's machine to have Ollama installed and running
- The system is a **triage-support tool only** — not a diagnostic system and not a substitute for clinical judgment
- Risk level output not validated against clinical gold-standard datasets
- Currently limited to 2 layers of questions before a forced final decision
- No multi-user authentication or role-based access control in the current version

---

## 17. Impact

- **Standardizes** triage decisions across all nurses regardless of experience level
- **Reduces cognitive load** during high-pressure patient intake moments
- **Improves patient prioritization** — high-risk cases flagged immediately
- **Works in low-resource environments** — offline-capable, minimal hardware requirements
- **Enables faster escalation** of critical cases to the right level of care
- **Creates structured records** — every triage session is saved and exportable for audit and review
