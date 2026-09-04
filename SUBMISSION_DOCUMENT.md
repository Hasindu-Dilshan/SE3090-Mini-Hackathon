# SE3090 – Software Engineering Frameworks
## Assignment 2 — Mini Hackathon (2026) Submission Document

**Project Title:** ResQ Lanka · Real-Time Flood Early-Warning & Emergency Relief Dispatch Platform  
**Target Group / Theme:** Build for Sri Lanka (Community Flood & Disaster Relief)

---

### 1. Project Links
- **Git Repository Link:** `[Insert Your GitHub Repository URL Here]`
- **Deployed Application Link:** `[Insert Your Live Deployed Web URL Here]`
- **Two-Minute Demonstration Video Link:** `[Insert OneDrive / YouTube / Drive Link Here]`

---

### 2. Team Member Names & Student IDs

| # | Student Name | Student Registration ID | Degree Specialization |
|---|---|---|---|
| 1 | `[Insert Student 1 Name]` | `ITXXXXXXXX` | Software Engineering / AI |
| 2 | `[Insert Student 2 Name]` | `ITXXXXXXXX` | Software Engineering / AI |
| 3 | `[Insert Student 3 Name]` | `ITXXXXXXXX` | Software Engineering / AI |
| 4 | `[Insert Student 4 Name]` | `ITXXXXXXXX` | Software Engineering / AI |

---

### 3. Short Description of the Problem & Solution

#### The Sri Lankan Problem:
Seasonal monsoon flooding (Southwest and Inter-monsoons) causes catastrophic river overflows along the Kelani, Kalu, Gin, and Nilwala basins, repeatedly impacting vulnerable residential communities across Kolonnawa, Wellampitiya, Biyagama, Kaduwela, Kalutara, and Ratnapura. Victims face acute bottlenecks: critical water level warnings from the Irrigation Department are trapped in static PDF notices, official emergency telephone lines (117, 119) experience acute congestion, and volunteer rescue boats lack triage visibility into which stranded households have bedridden patients, infants, or rooftop water levels.

#### The Digital Solution:
**ResQ Lanka** is a lightweight, mobile-responsive web platform connecting flood victims, volunteer boat response flotillas, and Grama Niladhari disaster relief committees. It provides:
1. **Live Hydrological River Gauges:** Real-time water depth telemetry and flood alert classifications (Normal, Alert, Minor Flood, Major Flood) with village-level inundation warnings.
2. **Emergency Relief & Evacuation Request Form:** Form with Sri Lankan phone validation (`07X XXX XXXX`) and situational risk markers.
3. **AI Emergency Triage Engine:** Automatically analyzes water depths, group size, and medical urgency to compute objective priority scores (0–100) and dispatch instructions.
4. **Interactive Relief Shelter Directory:** Real-time capacity meters and emergency supply deficit trackers across designated community centers and temples.

---

### 4. Technologies & AI Tools Used

- **Frontend:** React 18 (JavaScript / JSX), Vite, Tailwind CSS, Lucide React Icons, Axios
- **Backend:** FastAPI (Python 3), Pydantic v2, Uvicorn
- **Database:** MongoDB (PyMongo / Motor) with resilient embedded memory fallback store
- **External APIs:** Sri Lanka Irrigation Department Hydrology Telemetry Feed (`rivermonitorsl.homerelieflk.org` / ArcGIS)
- **Hosting / Deployment:** Vercel / Netlify (Frontend) and Render / Railway (Backend)
- **AI Tools Used:** Google Antigravity & Gemini 3.8

---

### 5. Mandatory AI Declaration

> **Declaration:** "AI assistance (Antigravity & Gemini) was used to research Sri Lankan hydrological station telemetry, integrate the live rivermonitorsl Irrigation Department hydrology feed, generate initial UI layouts and component boilerplate, and formulate regex validation patterns. All application logic, Pydantic validation schemas, MongoDB fallback storage mechanisms, and React state management workflows were thoroughly reviewed, tested, and modified by our team. We understand and take full ownership of all submitted code."

---

### 6. Mandatory AI Prompt Log

| AI Tool | Exact Prompt Used | Purpose of Request | How Output Was Checked & Modified |
| :--- | :--- | :--- | :--- |
| **Gemini / Antigravity** | *"Generate authentic Sri Lankan hydrological stations for Kelani, Kalu, and Gin rivers with minor and major flood thresholds."* | Obtain realistic local sample data. | Verified against official Irrigation Department flood reports (e.g. Nagalagam St: 5.0m Alert, 7.0m Major; Hanwella: 7.0m Alert, 10.0m Major). |
| **Gemini / Antigravity** | *"Integrate real-time river telemetry using rivermonitorsl.homerelieflk.org Sri Lankan API with dual-mode simulation."* | Connect real-time Sri Lankan government water levels and rainfall. | Tested direct REST queries to ArcGIS FeatureServer (`gauges_2_view`), added dual-mode toggle so examiners can verify live calm data and active flood warnings. |
| **Gemini / Antigravity** | *"Create a Pydantic model for Sri Lankan phone number validation supporting 07X and +94 prefixes."* | Enforce strict contact number validation. | Implemented regex `^(\+94|0)[0-9]{9}$` and added friendly inline error messaging for user feedback. |
| **Gemini / Antigravity** | *"Write a FastAPI route that evaluates emergency distress factors (water depth, infants, medical needs) to output an urgency score (0-100)."* | Implement optional AI disaster triage feature. | Calibrated scoring weights so ceiling-level floods with vulnerable dependents always trigger Critical urgency (≥95). |
| **Gemini / Antigravity** | *"Build a mobile-first responsive Tailwind React component for shelter directory with capacity progress bars."* | Implement accessible emergency shelter interface. | Customised with authentic Sri Lankan district badges, direct calling links, and occupancy percentage calculations. |
