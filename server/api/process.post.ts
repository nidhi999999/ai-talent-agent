import OpenAI from "openai";
import { createError, defineEventHandler, readBody } from "h3";
import { candidates, type Candidate } from "../data/candidates";

type ParsedJD = {
  skills: string[];
  experience: number;
};

type AnalyzerOptions = {
  matchWeight: number;
  interestWeight: number;
  minExperience: number;
  topK: number;
  requireAllSkills: boolean;
  mustHaveSkills: string[];
};

type PaginationOptions = {
  offset: number;
  limit: number;
};

type ChatTurn = {
  role: "recruiter" | "candidate";
  message: string;
};

type CandidateScore = Candidate & {
  matchedSkills: number;
  matchScore: number;
  interestScore: number;
  finalScore: number;
  rank: number;
  chatSimulation: ChatTurn[];
  explanation: string;
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = OPENAI_API_KEY
  ? new OpenAI({
      apiKey: OPENAI_API_KEY
    })
  : null;

const knownSkills = [
  "laravel",
  "vue",
  "nuxt",
  "mysql",
  "api",
  "node",
  "react",
  "mongodb",
  "tailwind",
  "typescript",
  "javascript",
  "php",
  "postgresql",
  "aws",
  "docker",
  "html",
  "css"
];

function parseExperienceFromText(text: string): number {
  const patterns = [/\b(\d+)\s*\+?\s*years?\b/i, /\bminimum\s+(\d+)\b/i];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return Number(match[1]);
    }
  }
  return 2;
}

function parseJDFree(jd: string): ParsedJD {
  const lower = jd.toLowerCase();
  const skills = knownSkills
    .filter((skill) => lower.includes(skill))
    .map((skill) => skill.charAt(0).toUpperCase() + skill.slice(1));

  return {
    skills,
    experience: parseExperienceFromText(jd)
  };
}

async function parseJDWithAI(jd: string): Promise<ParsedJD> {
  if (!openai) {
    return parseJDFree(jd);
  }

  try {
    const jdRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `
Extract structured JSON ONLY (no extra text):
{
  "skills": string[],
  "experience": number
}

Job Description:
${jd}
`
        }
      ],
      temperature: 0.2
    });

    const rawContent = jdRes.choices[0].message.content || "{}";
    const parsed = JSON.parse(rawContent) as ParsedJD;

    return {
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      experience: Number(parsed.experience || 0)
    };
  } catch {
    return parseJDFree(jd);
  }
}

function simulateInterestFree(candidate: Candidate, parsed: ParsedJD) {
  const matchedSkills = candidate.skills.filter((s) =>
    parsed.skills.map((x) => x.toLowerCase()).includes(s.toLowerCase())
  ).length;
  const skillRatio = parsed.skills.length ? matchedSkills / parsed.skills.length : 0;
  const expRatio = parsed.experience ? Math.min(candidate.experience / parsed.experience, 1) : 0.5;

  const interestScore = Number((0.5 + skillRatio * 0.3 + expRatio * 0.2).toFixed(2));
  const reason =
    interestScore >= 0.8
      ? "Strong intent based on role-fit and experience."
      : interestScore >= 0.6
        ? "Moderate intent; candidate appears reasonably aligned."
        : "Low-to-neutral intent; candidate fit appears limited.";

  return { interestScore, reason };
}

async function simulateInterestWithAI(candidate: Candidate, parsed: ParsedJD) {
  if (!openai) {
    return simulateInterestFree(candidate, parsed);
  }

  try {
    const interestRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `
You are simulating a candidate response.

Candidate:
Name: ${candidate.name}
Skills: ${candidate.skills.join(", ")}
Experience: ${candidate.experience} years

Given this job:
Required skills: ${parsed.skills.join(", ")}
Experience: ${parsed.experience} years

Return STRICT JSON:
{
  "interestScore": number (0 to 1),
  "reason": string (max 1-2 lines)
}
`
        }
      ],
      temperature: 0.3
    });

    const rawContent = interestRes.choices[0].message.content || "{}";
    const obj = JSON.parse(rawContent) as { interestScore?: number; reason?: string };

    return {
      interestScore: Number((obj.interestScore ?? 0.5).toFixed(2)),
      reason: obj.reason || "Neutral interest"
    };
  } catch {
    return simulateInterestFree(candidate, parsed);
  }
}

function normalizeOptions(raw: Partial<AnalyzerOptions> | undefined): AnalyzerOptions {
  const matchWeight = Number(raw?.matchWeight ?? 0.6);
  const interestWeight = Number(raw?.interestWeight ?? 0.4);
  const total = matchWeight + interestWeight || 1;

  return {
    matchWeight: Number((matchWeight / total).toFixed(2)),
    interestWeight: Number((interestWeight / total).toFixed(2)),
    minExperience: Math.max(0, Number(raw?.minExperience ?? 0)),
    topK: Math.min(10, Math.max(3, Number(raw?.topK ?? 5))),
    requireAllSkills: Boolean(raw?.requireAllSkills),
    mustHaveSkills: Array.isArray(raw?.mustHaveSkills) ? raw!.mustHaveSkills.filter(Boolean) : []
  };
}

function normalizePagination(raw: Partial<PaginationOptions> | undefined): PaginationOptions {
  return {
    offset: Math.max(0, Number(raw?.offset ?? 0)),
    limit: Math.min(20, Math.max(3, Number(raw?.limit ?? 5)))
  };
}

function buildChatSimulation(candidate: Candidate, interestReason: string): ChatTurn[] {
  return [
    {
      role: "recruiter",
      message: `Hi ${candidate.name}, we have a role matching ${candidate.skills.slice(0, 3).join(", ")}. Are you open to discussing it?`
    },
    {
      role: "candidate",
      message: `${interestReason} I can share availability for a technical discussion this week.`
    },
    {
      role: "recruiter",
      message: "Great, we'll align on compensation range and location preferences in the next step."
    }
  ];
}

export default defineEventHandler(async (event) => {
  const { jd, options, pagination } = await readBody(event);
  if (!jd || typeof jd !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "Job description is required."
    });
  }
  const normalizedOptions = normalizeOptions(options);
  const normalizedPagination = normalizePagination(pagination);

  // 1) Parse JD with AI (or free local fallback)
  const parsed = await parseJDWithAI(jd);
  if (normalizedOptions.mustHaveSkills.length) {
    const merged = new Set([...parsed.skills, ...normalizedOptions.mustHaveSkills]);
    parsed.skills = Array.from(merged);
  }

  if (parsed.skills.length === 0) {
    return {
      mode: openai ? "ai" : "free-local",
      options: normalizedOptions,
      pagination: normalizedPagination,
      parsed,
      topCandidates: [],
      candidates: [],
      totalCandidates: 0,
      hasMore: false,
      warning: "No relevant skills detected in JD. Please add specific technical requirements."
    };
  }

  // 2) Compute Match Score
  const baseCandidates = candidates.filter((candidate) => {
    if (candidate.experience < normalizedOptions.minExperience) {
      return false;
    }
    if (!normalizedOptions.requireAllSkills) {
      return true;
    }
    const parsedSkillsLower = parsed.skills.map((x) => x.toLowerCase());
    return parsedSkillsLower.every((skill) =>
      candidate.skills.map((s) => s.toLowerCase()).includes(skill)
    );
  });

  const results: CandidateScore[] = baseCandidates.map((c) => {
    const matchedSkills = c.skills.filter((s) =>
      parsed.skills.map((x) => x.toLowerCase()).includes(s.toLowerCase())
    ).length;

    const skillMatch = parsed.skills.length
      ? matchedSkills / parsed.skills.length
      : 0;

    const expMatch = parsed.experience
      ? Math.min(c.experience / parsed.experience, 1)
      : 0;

    const matchScore = +(skillMatch * 0.7 + expMatch * 0.3).toFixed(2);

    return {
      ...c,
      matchedSkills,
      matchScore,
      interestScore: 0.5,
      finalScore: 0,
      rank: 0,
      chatSimulation: [],
      explanation: ""
    };
  }).filter((candidate) => {
    if (candidate.matchedSkills === 0) {
      return false;
    }
    if (parsed.skills.length >= 4 && candidate.matchedSkills < 2) {
      return false;
    }
    return true;
  });

  // 3) Simulate Interest (AI or free local fallback)
  for (const r of results) {
    const { interestScore, reason } = await simulateInterestWithAI(r, parsed);
    r.interestScore = +interestScore.toFixed(2);
    r.chatSimulation = buildChatSimulation(r, reason);
    r.explanation = `Matched ${r.matchedSkills}/${parsed.skills.length || 0} skills, experience ${r.experience}y in ${r.currentRole}. ${reason}`;
  }

  // 4) Final ranking
  const ranked = results.sort((a, b) => {
    const A = a.matchScore * normalizedOptions.matchWeight + a.interestScore * normalizedOptions.interestWeight;
    const B = b.matchScore * normalizedOptions.matchWeight + b.interestScore * normalizedOptions.interestWeight;
    return B - A;
  });

  ranked.forEach((candidate, index) => {
    candidate.finalScore = Number(
      (candidate.matchScore * normalizedOptions.matchWeight + candidate.interestScore * normalizedOptions.interestWeight).toFixed(2)
    );
    candidate.rank = index + 1;
  });

  const totalCandidates = ranked.length;
  const pagedCandidates = ranked.slice(
    normalizedPagination.offset,
    normalizedPagination.offset + normalizedPagination.limit
  );
  const hasMore = normalizedPagination.offset + normalizedPagination.limit < totalCandidates;

  return {
    mode: openai ? "ai" : "free-local",
    options: normalizedOptions,
    pagination: normalizedPagination,
    parsed,
    topCandidates: ranked.slice(0, normalizedOptions.topK),
    candidates: pagedCandidates,
    totalCandidates,
    hasMore
  };
});