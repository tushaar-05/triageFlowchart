Project Title
TriageFlow AI – Offline-First Intelligent Symptom Triage Builder

1. Problem Statement
# Problem Title
Offline Customizable AI-Assisted Triage System for Rural Healthcare

# Problem Description
In rural clinics and primary care centers, frontline healthcare workers such as nurses and paramedics conduct initial patient triage without access to specialized doctors. Existing triage systems rely on rigid paper-based flowcharts and static checklists that are difficult to update, not customizable to local needs, and prone to inconsistency and human error.

Additionally, many rural environments suffer from unstable or no internet connectivity, making cloud-based triage systems impractical.

There is a need for a flexible, customizable, and offline-first triage system that ensures structured, consistent, and risk-based patient prioritization.

# Target Users
Rural nurses (e.g., Nurse Asha)
Community health workers
Paramedics
Primary healthcare centers
Field medical programs

# Existing Gaps
Static paper-based triage guides
No customizable decision-tree builder
Inconsistent patient prioritization
Lack of embedded risk scoring
No structured offline decision-support tools
High cognitive load during peak patient inflow



2. Problem Understanding & Approach
# Root Cause Analysis
Triage systems are static and not easily adaptable.
No structured digital decision-tree editors exist for rural deployment.
Healthcare workers lack real-time structured guidance.
Offline environments limit cloud-based AI solutions.
# Solution Strategy
We designed an offline-first triage flowchart builder that:
Allows supervisors to create structured decision-tree protocols
Embeds conditional branching logic
Includes risk scoring and threshold-based prioritization
Uses AI safely for symptom classification and intelligent question selection
Runs fully offline using a local AI model



3. Proposed Solution
# Solution Overview
TriageFlow AI is an offline-capable triage decision-support system that enables administrators to design customizable medical triage flowcharts and empowers frontline healthcare workers to conduct standardized patient assessments.

# Core Idea
Structured decision-tree engine
Customizable drag-and-drop builder
Embedded risk scoring system
AI-assisted symptom classification
AI-assisted intelligent question selection
Fully offline execution

# Key Features
Drag-and-drop flowchart builder
Conditional branching logic
Risk scoring & priority levels
AI-based symptom category classification
AI assist node (controlled question selection)
Offline-first deployment (Ollama local model)
Patient case history dashboard
Exportable standalone executable

4. System Architecture
High-Level Flow
User (Nurse)
→ Frontend (React UI)
→ Backend (Node.js Engine)
→ Local AI Model (Ollama)
→ SQLite Database
→ Risk Calculation Engine
→ Response & Recommendation

# Architecture Description
Nurse enters patient details and chief complaint.
AI classifies complaint into predefined triage protocol.
System loads structured protocol JSON.
Nurse navigates node-by-node decision tree.
Risk score accumulates based on responses.
AI Assist Node optionally selects most relevant next question.
Final risk level and recommendation generated.
Patient data stored locally in database.


5. Database Design
# Entities
Patients
patient_id
name
age
gender
weight
vitals
Cases
case_id
patient_id
protocol_used
total_risk_score
risk_level
recommendation
Protocols
protocol_id
protocol_name
thresholds

# Nodes
node_id
protocol_id
question
input_type
risk_weight


7. Model Selected
Ollama Jayasimma/healthsoft

# Selection Reasoning
Lightweight
Offline-capable
Fast inference
Easy integration


8. Technology Stack
# Frontend
React
React Flow (Flowchart Builder)
Tailwind CSS
Backend
Node.js
Express.js

# ML/AI
Ollama (Local LLM)

# Database
MySQL

# Deployment
Electron (Offline Desktop App)


9. API Documentation & Testing
# API Endpoints List
Endpoint 1: Create Patient Case
POST /api/patient

Endpoint 2: Load Protocol
GET /api/protocol/:id

Endpoint 3: AI Classification
POST /api/classify

Endpoint 4: AI Assist Node
POST /api/ai-select


10. Module-wise Development & Deliverables
# Checkpoint 1: Research & Planning
Deliverables:
Problem breakdown
System design
Protocol structure planning

# Checkpoint 2: Backend Development

# Checkpoint 3: Frontend Development

# Checkpoint 4: Model Setup

# Checkpoint 5: Model Integration

# Checkpoint 6: Deployment


11. End-to-End Workflow 
Patient enters clinic.
Nurse records patient details.
Chief complaint entered.
AI classifies into triage protocol.
Nurse navigates structured flowchart.
Risk score calculated dynamically.
Final recommendation generated and saved.

12. Demo & Video
Live Demo Link:
//

Demo Video Link:
//

GitHub Repository:
https://github.com/tushaar-05/triageFlowchart

13. Hackathon Deliverables Summary
Offline-first triage system
Customizable flowchart builder
Risk-based prioritization engine
AI-assisted classification
AI-assisted node selection
Standalone executable

14. Team Roles & Responsibilities
Member Name: Tushar Singh
Role: Frontend, Backend and Database
Responsibilities: UI, Flowchart Builder, SQLite, Electron

Member Name: Sai Hrudhay
Role: AI Models
Responsibilities: AI Integration

Member Name: Madhav Agarwal
Role: Frontend
Responsibilities: UI, Flowchart Builder

15. Future Scope & Scalability
# Short-Term
Add more symptom protocols
Multi-language support
Improved UI/UX
Basic analytics dashboard

# Long-Term
Integration with EHR systems
Real-time health data sync (where internet available)
State-wide deployment
Regulatory compliance layer
Advanced AI triage optimization


16. Known Limitations
Limited number of predefined protocols
AI classification depends on prompt quality
Not a diagnostic system
Designed for triage support only

17. Impact
Standardizes rural triage decisions
Reduces cognitive load on frontline workers
Improves patient prioritization
Works in low-resource environments
Enables faster escalation of high-risk cases

## Model performance & deployment guidance

Below is a concise, actionable summary of the model comparison and recommended requirements for running the preferred local model (HealthSoft 1.3B / `jayasimma/healthsoft`) in the TriageFlow AI app.

### Why HealthSoft (recommended)
- Lightweight and highly efficient: 1.3B parameters, runs on devices with as little as 4 GB RAM.
- Strong clinical accuracy for size: MedQA 72.4% (Pass rate 81.3%) and competitive scores on PubMedQA / MedMCQA.
- Larger context window (4096 tokens) which helps multi-turn and long-history workflows in triage.
- Privacy-friendly: designed for 100% local processing (no cloud dependency) — important for PHI/HIPAA-sensitive deployments.
- Low energy and latency footprint, enabling edge and mobile deployment scenarios.

### Minimum and recommended system requirements
- Minimum: 4 GB RAM, ~3.5 GB free disk space for FP16 model files and runtime artifacts, modern 4+ core CPU.
- Recommended (laptop / small clinic): 8 GB RAM, 8+ GB free disk, SSD, optional discrete GPU (RTX 4060 class) for improved throughput.
- Recommended (server): 16+ GB RAM or GPU with 8–24 GB VRAM for higher throughput and parallel users.


### Memory & storage guidance
- Use FP16 weights where possible to reduce footprint (~2.6 GB on disk). Expect runtime memory ~2.8–3.4 GB peak during inference.
- If using quantization, validate accuracy drop on a small clinical test-suite before deploying.

### Safety, reliability & compliance
- Built-in safety guardrails: low harmful advice rate (0.9%) and strong dosage/interaction detection metrics.
- Recommended runtime checks the app should enforce:
	- Always present model outputs as decision-support, not definitive diagnoses.
	- Highlight and require clinician confirmation for high-risk recommendations (e.g., medication dosing, emergency escalation).
	- Log and audit model recommendations (locally) for quality review and incident tracing.
	- Maintain a fail-safe: when the model confidence is low or an action is high-risk, display conservative recommendations and require escalation.
- Compliance: keep patient data local; do not send PHI to third-party services. Include administrative controls for access and data retention policies to align with HIPAA where applicable.


### Deployment tips for TriageFlow
- Use Ollama (or your chosen local runtime) to host the `jayasimma/healthsoft` model locally. Prefer FP16 and enable any available runtime quantization only after accuracy validation.
- For offline mobile/edge deployments, package the model with the app binary or provide an on-device download and verify storage and RAM constraints on target hardware.
- Provide a toggle in-app for strict safety mode that raises thresholds for “require escalation” and shows additional confirmation UI for any medication/dosage suggestions.

### Limitations & cautions
- This model is a triage-assist tool, not a diagnostic or definitive clinical decision-maker.
- Local model performance is hardware-dependent; always validate on representative local hardware prior to clinical rollout.
- Keep an incident reporting workflow so clinicians can flag incorrect or unsafe model outputs.

