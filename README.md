# AI-Powered Talent Scouting & Engagement Agent

A multi-page Nuxt app for the Catalyst hackathon that parses a Job Description (JD), discovers matching candidates, simulates outreach conversations, and produces a ranked shortlist with explainable scoring.

## What This Solves

Recruiters usually do these tasks manually:
- Parse unstructured JDs
- Compare candidates against required skills/experience
- Validate candidate interest
- Build a final shortlist

This app automates the full flow with a clear, demo-friendly UI and configurable ranking logic.

## Main Features

- Multi-page frontend
  - `Home` (`/`)
  - `Analyzer` (`/analyzer`)
  - `Candidates` (`/candidates`)
- JD parsing to structured `skills` + `experience`
- Candidate matching with explainability
- Simulated recruiter-candidate conversation per candidate
- Dual-score ranking:
  - `Match Score`
  - `Interest Score`
  - Combined `Final Score`
- Advanced analyzer options:
  - Match/Interest weight sliders
  - Minimum experience filter
  - Top-K shortlist control
  - Require-all-skills toggle
  - Must-have skills input
- Optional OpenAI integration with free local fallback

## Run Modes

- `ai` mode: used when `OPENAI_API_KEY` is present
- `free-local` mode: no key needed, rule-based parsing + heuristic interest scoring

## Tech Stack

- `Nuxt 3` + `Vue 3`
- Server routes via Nitro (`/server/api`)
- TypeScript for backend logic
- `OpenAI SDK` (optional)

## Architecture

```text
[Frontend Pages]
  ├── /                 (home/overview)
  ├── /analyzer         (JD analysis + scoring controls)
  └── /candidates       (candidate explorer)

/analyzer submit JD
      |
      v
[POST /api/process]
      |
      +--> Parse JD
      |      |- OpenAI parser (ai mode)
      |      |- Local parser  (free-local mode)
      |
      +--> Apply advanced options
      |      |- minExperience
      |      |- requireAllSkills
      |      |- mustHaveSkills
      |
      +--> Compute Match Score
      +--> Simulate Interest Score
      +--> Build chatSimulation
      +--> Compute Final Score (weighted)
      +--> Rank + Top-K shortlist
      |
      v
[UI cards + explainability + chat transcript]

[GET /api/candidates]
      |
      +--> candidate explorer filters
            |- search
            |- minExperience
```

## Scoring Logic

### Match Score

`Match Score = (Skill Match * 0.7) + (Experience Fit * 0.3)`

- `Skill Match = matched_required_skills / total_required_skills`
- `Experience Fit = min(candidate_experience / required_experience, 1)`

### Interest Score

- `ai` mode: generated via OpenAI prompt
- `free-local` mode: heuristic from fit ratios

### Final Score

`Final Score = (Match Score * matchWeight) + (Interest Score * interestWeight)`

`matchWeight` and `interestWeight` are configurable from analyzer sliders and normalized by backend.

## API Endpoints

### `POST /api/process`

Request body:

```json
{
  "jd": "Looking for a Laravel developer with 3+ years...",
  "options": {
    "matchWeight": 0.6,
    "interestWeight": 0.4,
    "minExperience": 2,
    "topK": 5,
    "requireAllSkills": false,
    "mustHaveSkills": ["Laravel", "API"]
  }
}
```

Response includes:
- `mode`
- `parsed`
- `options` (normalized)
- `topCandidates`
- `candidates` (ranked with explanation + chat simulation)

### `GET /api/candidates`

Query params:
- `search` (optional)
- `minExperience` (optional)

## Local Setup

### Prerequisites

- Node.js `18.x` (project tested on `v18.20.8`)
- npm `>=10`

### Install

```bash
npm install
```

### Environment

Create `.env`:

```env
OPENAI_API_KEY=
```

- Leave empty for `free-local` mode
- Set valid key for `ai` mode

### Run

```bash
npm run dev -- --host 127.0.0.1 --port 3000
```

Open:
- `http://127.0.0.1:3000/`
- `http://127.0.0.1:3000/analyzer`
- `http://127.0.0.1:3000/candidates`

## Usage Flow (Demo Friendly)

1. Go to `/analyzer`
2. Paste JD
3. Configure advanced options (weights, topK, filters)
4. Click `Run Analysis`
5. Show:
   - Parsed JD
   - Ranked shortlist (match, interest, final score)
   - Explainability text
   - Simulated outreach chat for selected candidate
6. Go to `/candidates` and show talent pool explorer filters

## Sample Input

```text
We are hiring a Laravel developer with 3+ years of experience, strong MySQL and API design skills, and exposure to Vue/Nuxt.
```

## Sample Output (shape)

```json
{
  "mode": "free-local",
  "options": {
    "matchWeight": 0.6,
    "interestWeight": 0.4,
    "minExperience": 2,
    "topK": 5,
    "requireAllSkills": false,
    "mustHaveSkills": ["Laravel", "API"]
  },
  "parsed": {
    "skills": ["Laravel", "Vue", "Nuxt", "MySQL", "API"],
    "experience": 3
  },
  "topCandidates": [
    {
      "rank": 1,
      "name": "Rahul",
      "finalScore": 0.89
    }
  ],
  "candidates": [
    {
      "rank": 1,
      "name": "Rahul",
      "matchScore": 0.91,
      "interestScore": 0.86,
      "finalScore": 0.89,
      "explanation": "Matched 4/5 skills, experience 4y in Full Stack Developer. Strong intent based on role-fit and experience.",
      "chatSimulation": [
        { "role": "recruiter", "message": "..." },
        { "role": "candidate", "message": "..." }
      ]
    }
  ]
}
```

## Project Structure

```text
app.vue                              # App shell + top navigation
pages/index.vue                      # Home page
pages/analyzer.vue                   # Advanced JD analysis page
pages/candidates.vue                 # Candidate explorer page
server/data/candidates.ts            # Shared candidate dataset
server/api/process.post.ts           # JD parsing, scoring, ranking API
server/api/candidates.get.ts         # Candidate explorer API
README.md
```

## Build / Preview

```bash
npm run build
npm run preview
```