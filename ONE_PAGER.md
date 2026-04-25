# AI-Powered Talent Scouting & Engagement Agent — One-Page Write-up

## 1) Problem & Approach
Recruiters spend time manually parsing JDs, filtering profiles, and validating candidate interest.
This solution automates the workflow:

JD Input -> Requirement Parsing -> Candidate Matching -> Interest Simulation -> Ranked Shortlist

The app supports:
- JD parsing (AI mode + free local fallback)
- Explainable matching (skills + experience)
- Simulated conversational outreach
- Final ranked output for recruiter action

## 2) Architecture
Frontend (Nuxt/Vue):
- / (Home): overview
- /analyzer: JD analysis + advanced controls
- /candidates: candidate explorer with search/filter/load-more

Backend APIs:
- POST /api/process
  - Parse JD
  - Filter and score candidates
  - Simulate candidate interest
  - Return ranked shortlist + explanations + chat simulation
- GET /api/candidates
  - Candidate search/filter/pagination

Data layer:
- Shared mock candidate dataset with frontend/backend/backend/full-stack profile variety

## 3) Scoring & Ranking Logic
Match Score:
- Skill Match Ratio = matched required skills / total required skills
- Experience Fit = min(candidate_exp / required_exp, 1)
- Match Score = (Skill Match Ratio * 0.7) + (Experience Fit * 0.3)

Interest Score:
- AI mode: LLM-based intent simulation
- Free mode: deterministic heuristic

Final Score:
- Final Score = (Match Score * matchWeight) + (Interest Score * interestWeight)
- Weights are user-configurable and auto-balanced to total 1.0
- Candidates are ranked by Final Score descending

## 4) Product Decisions & Trade-offs
What was prioritized:
- Working end-to-end prototype
- Clear explainability for judges/recruiters
- Strong UX with advanced controls and pagination

Trade-offs:
- Candidate pool is mock data (no live LinkedIn/ATS integration)
- Outreach is simulated, not real messaging
- No authentication or recruiter account system in MVP

Future improvements:
- ATS/CSV ingestion
- Real messaging integrations
- Persisted projects/shortlists
- Confidence calibration analytics