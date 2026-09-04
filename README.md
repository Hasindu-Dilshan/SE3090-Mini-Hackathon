# ResQ Lanka · Real-Time Flood Early-Warning & Emergency Relief Dispatch Platform

> **SE3090 – Software Engineering Frameworks | Assignment 2 — Mini Hackathon (2026)**  
> **Faculty of Computing · Sri Lanka Institute of Information Technology (SLIIT)**  
> **Theme:** Build for Sri Lanka (Practical digital solution for a current real-world problem)

---

## 1. Project Links & Submission Links

- **GitHub Repository:** `[Insert Your GitHub Repo URL Here]`
- **Deployed Web Application:** `[Insert Your Live Deployed URL Here (e.g. Vercel / Render)]`
- **2-Minute Demonstration Video:** `[Insert OneDrive / YouTube / Google Drive Video Link Here]`

---

## 2. The Selected Sri Lankan Problem

During the Southwest and Inter-monsoons in Sri Lanka, intense torrential precipitation triggers severe riverine flooding across major low-lying basins:
- **Kelani Ganga Basin:** Kolonnawa, Wellampitiya, Kotikawatta, Sedawatta, Biyagama, Kaduwela, Hanwella.
- **Kalu Ganga Basin:** Ratnapura, Elapatha, Ayagama, Bulathsinhala, Millaniya, Palinda Nuwara.
- **Gin & Nilwala Basins:** Baddegama, Nagoda, Akuressa, Thihagoda.

### The Acute Bottlenecks:
1. **Hydrological Data Opacity:** Irrigation Department water level bulletins are published as static PDF tables or broadcast radio notices that ordinary citizens cannot search or filter by their local Grama Niladhari (GN) division.
2. **Distress Dispatch Gridlock:** Official emergency hotlines (117, 119) become overwhelmed. Rescue boats and volunteer flotillas cannot quickly determine which calls involve stranded rooftop cases with bedridden elderly or infants versus those needing dry rations.
3. **Relief Shelter Asymmetry:** Flood-displaced families flood into overburdened temples and schools while nearby relief shelters have surplus capacity and available beds.

---

## 3. The Proposed Solution

**ResQ Lanka** is a unified, mobile-responsive emergency operations and community dispatch web platform built to connect flood-affected residents, volunteer boat operators, and Grama Niladhari disaster relief committees.

The platform provides:
- Real-time gauge height tracking across Sri Lanka's most flood-prone rivers with dynamic alert badges (Normal, Alert, Minor Flood, Major Flood).
- A verified SOS distress registration form with Sri Lankan phone validation and severity tags.
- An **AI Emergency Triage & Urgency Evaluation Engine** that computes automated priority scores (0–100) and actionable rescue recommendations.
- A live community shelter directory showing bed capacities, occupancy rates, and urgent donation requests.

---

## 4. Main Software Features

1. **Hydrological River Basin Monitor:** Live water depth telemetry, alert thresholds, rising/falling trends, and village-level inundation warnings.
2. **Community Distress Dispatch Board:** Searchable and filterable queue displaying incoming SOS distress calls with real-time status updates (`Pending` → `Unit En Route` → `Rescued / Safe`).
3. **Emergency Relief Request Form:** Validated SOS reporting capturing exact GPS landmarks, Sri Lankan contact number, headcount, and vulnerability factors.
4. **Relief Shelter & Safe Haven Directory:** Directory of temples and schools with capacity meters, contact details for relief coordinators, and needed emergency supplies.
5. **AI Emergency Disaster Triage (Optional AI Feature):** Intelligent decision-support engine evaluating situational depth, vulnerable dependents, and keyword sentiment to rank life-threatening rescues.
6. **In-App Sri Lankan Crisis Context Modal:** Grounded overview of local flood geography, affected demographics, and institutional response workflows.

---

## 5. Technologies Used

- **Frontend:** React 18 (JavaScript / JSX), Vite, Tailwind CSS, Lucide Icons, Axios
- **Backend:** FastAPI (Python), Pydantic v2, Uvicorn
- **Database:** MongoDB (PyMongo & Motor async driver) with resilient embedded memory fallback store
- **Deployment Platform:** Vercel / Netlify (Frontend) & Render / Railway (Backend)

---

## 6. AI Tools Used & Mandatory Declaration

### AI Declaration:
> **Declaration:** "AI assistance (Antigravity & Gemini) was utilized to research Sri Lankan river basin data, generate initial UI layouts and component boilerplate, and formulate regex validation patterns. All application logic, Pydantic validation schemas, MongoDB fallback storage mechanisms, and React state management workflows were thoroughly reviewed, tested, and modified by our team. We understand and take full ownership of all submitted code."

---

## 7. Mandatory AI Prompt Log

| Tool | Exact Prompt | Purpose | How Output was Checked / Modified |
| :--- | :--- | :--- | :--- |
| **Gemini / Antigravity** | *"Generate authentic Sri Lankan hydrological stations for Kelani, Kalu, and Gin rivers with minor and major flood thresholds."* | Produce realistic local sample data for Sri Lanka. | Cross-checked against official Irrigation Department hydrological reports (Nagalagam St: 5.0m Alert, 7.0m Major; Hanwella: 7.0m Alert, 10.0m Major). |
| **Gemini / Antigravity** | *"Create a Pydantic model for Sri Lankan phone number validation supporting 07X and +94 prefixes."* | Enforce strict contact number validation. | Added regex `^(\+94|0)[0-9]{9}$` and strip whitespace/hyphen filters with friendly error messaging. |
| **Gemini / Antigravity** | *"Write a FastAPI route that evaluates emergency distress factors (water depth, infants, medical needs) to output an urgency score (0-100)."* | Implement the optional AI disaster triage feature. | Calibrated weighting logic so ceiling/rooftop floods with medical emergencies always produce a score ≥95 (Critical). |
| **Gemini / Antigravity** | *"Build a mobile-first responsive Tailwind React component for shelter directory with capacity progress bars."* | Implement accessible emergency UI. | Replaced generic styling with custom Sri Lankan district badges, direct calling links, and occupancy percentage calculations. |

---

## 8. Team Member Details & Contributions

| Member Name | Student ID | Designated Area | Key Contributions |
| :--- | :--- | :--- | :--- |
| **Team Member 1** | `ITXXXXXX` | **Problem & Solution Design** | Researched Kelani/Kalu river flood data, framed Sri Lankan problem statement, created in-app crisis modal. |
| **Team Member 2** | `ITXXXXXX` | **UI Development** | Designed responsive layout, navigation bar, emergency ticker, gauge status cards, and shelter directory. |
| **Team Member 3** | `ITXXXXXX` | **Functional Implementation** | Developed FastAPI endpoints, Pydantic validation schemas, AI triage scoring algorithm, and React state handling. |
| **Team Member 4** | `ITXXXXXX` | **Testing, Git & Deployment** | Executed validation test suite, managed Git commits, configured deployment scripts, and authored demo script. |

---

## 9. Installation & Execution Instructions

### Prerequisites
- Node.js (v18 or newer) & npm
- Python (v3.10 or newer)
- MongoDB (Optional: local MongoDB or MongoDB Atlas URI. If unavailable, an embedded in-memory database activates automatically with zero errors).

### Quick 1-Click Launch (Windows)
Double-click `run_app.bat` in the project root directory. This automatically launches both the backend and frontend in separate terminals.

---

### Manual Step-by-Step Launch

#### 1. Backend (FastAPI + MongoDB)
```bash
# Navigate to backend folder
cd backend

# Create & activate Python virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Configure environment variables
# Copy .env.example to .env and adjust MONGO_URI if using MongoDB Atlas
cp .env.example .env

# Start FastAPI server
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend runs at:* `http://127.0.0.1:8000`  
*Interactive Swagger API Docs:* `http://127.0.0.1:8000/docs`

#### 2. Frontend (React + Vite)
```bash
# Open a second terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
*Frontend runs at:* `http://localhost:5173`

---

## 10. Verification of Minimum Software Requirements

| # | Requirement | How It Is Satisfied in ResQ Lanka |
|---|---|---|
| **1** | **Clear Landing Page** | Dashboard with live disaster ticker, situational metric cards, and prominent SOS action buttons. |
| **2** | **In-App Sri Lankan Problem Context** | Interactive "Crisis Context" modal detailing southwest monsoon flooding, river basins, and affected demographics. |
| **3** | **At Least Two Functional Features** | Feature 1: River Basin Early-Warning Gauge Monitor.<br>Feature 2: Shelter Directory with capacity calculators.<br>Feature 3: Live SOS Dispatch Board with real-time status management. |
| **4** | **Form Accepting User Input** | Emergency Relief & Evacuation Request Form for stranded citizens. |
| **5** | **Input Validation with Friendly Messages** | Real-time Sri Lankan phone regex (`07X XXX XXXX`), positive headcount requirement, and friendly error labels. |
| **6** | **Search, Filter & Calculate Information** | Instant search by village/station; filter by basin, urgency, or alert stage; dynamic capacity calculations and AI triage scores. |
| **7** | **Responsive Mobile & Desktop Interface** | Mobile-first layout with clean mobile drawer navigation and multi-column desktop grids. |
| **8** | **Basic Navigation** | Tabbed navigation across Dashboard, River Gauges, SOS Board, Shelters, AI Triage, and SOS Form. |
| **9** | **Relevant Sample Data** | Authentic stations (Nagalagam Street, Hanwella, Putupaula) and shelters in Kolonnawa, Biyagama, Kaduwela, and Ratnapura. |
| **10** | **Demonstration of Value** | Streamlines life-or-death communication between stranded villagers and rescue teams during annual floods. |
| **AI** | **Optional AI Feature** | AI Emergency Triage Simulator calculating situational urgency (0–100) and rescue action plans. |
