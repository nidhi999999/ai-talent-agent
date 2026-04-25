<script setup lang="ts">
import { ref } from "vue";

type CandidateResult = {
  rank: number;
  name: string;
  currentRole: string;
  location: string;
  matchScore: number;
  interestScore: number;
  finalScore: number;
  explanation: string;
  chatSimulation: { role: string; message: string }[];
};

const jd = ref("");
const loading = ref(false);
const mode = ref("");
const parsed = ref<{ skills: string[]; experience: number } | null>(null);
const results = ref<CandidateResult[]>([]);
const topCandidates = ref<CandidateResult[]>([]);
const errorMessage = ref("");
const warningMessage = ref("");
const hasMore = ref(false);
const totalCandidates = ref(0);
const loadingMore = ref(false);
const pageSize = 5;

const options = ref({
  matchWeight: 0.6,
  interestWeight: 0.4,
  minExperience: 0,
  topK: 5,
  requireAllSkills: false,
  mustHaveSkillsRaw: ""
});

const selectedCandidate = ref<CandidateResult | null>(null);

const roundWeight = (value: number) => Number(value.toFixed(2));

const onMatchWeightChange = (value: number) => {
  const normalized = Math.min(0.9, Math.max(0.1, value));
  options.value.matchWeight = roundWeight(normalized);
  options.value.interestWeight = roundWeight(1 - normalized);
};

const onInterestWeightChange = (value: number) => {
  const normalized = Math.min(0.9, Math.max(0.1, value));
  options.value.interestWeight = roundWeight(normalized);
  options.value.matchWeight = roundWeight(1 - normalized);
};

const getMustHaveSkills = () =>
  options.value.mustHaveSkillsRaw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const runAnalysis = async (offset = 0, append = false) => {
  const res = await $fetch("/api/process", {
    method: "POST",
    body: {
      jd: jd.value,
      options: {
        matchWeight: options.value.matchWeight,
        interestWeight: options.value.interestWeight,
        minExperience: options.value.minExperience,
        topK: options.value.topK,
        requireAllSkills: options.value.requireAllSkills,
        mustHaveSkills: getMustHaveSkills()
      },
      pagination: {
        offset,
        limit: pageSize
      }
    }
  });

  mode.value = res.mode;
  parsed.value = res.parsed;
  topCandidates.value = res.topCandidates || [];
  warningMessage.value = res.warning || "";
  hasMore.value = Boolean(res.hasMore);
  totalCandidates.value = Number(res.totalCandidates || 0);

  const incoming = (res.candidates || []) as CandidateResult[];
  results.value = append ? [...results.value, ...incoming] : incoming;
};

const analyzeJD = async () => {
  loading.value = true;
  errorMessage.value = "";
  warningMessage.value = "";
  selectedCandidate.value = null;
  results.value = [];
  hasMore.value = false;
  totalCandidates.value = 0;

  try {
    await runAnalysis(0, false);
  } catch {
    errorMessage.value = "Analysis failed. Check input and try again.";
  } finally {
    loading.value = false;
  }
};

const loadMore = async () => {
  if (!hasMore.value || loadingMore.value) return;
  loadingMore.value = true;
  try {
    await runAnalysis(results.value.length, true);
  } catch {
    errorMessage.value = "Failed to load more candidates. Please retry.";
  } finally {
    loadingMore.value = false;
  }
};
</script>

<template>
  <section class="page-head">
    <h1>JD Analyzer</h1>
    <p>Paste a job description, tune recruiter preferences, and generate an explainable ranked shortlist.</p>
  </section>

  <section class="grid">
    <div class="panel">
      <h2>Job Description Input</h2>
      <textarea
        v-model="jd"
        rows="9"
        placeholder="Paste the full job description here. Include role, required skills, and minimum years of experience."
      />

      <div class="options-grid">
        <label>
          Match Weight (Skill/Experience Fit): {{ options.matchWeight.toFixed(2) }}
          <input
            :value="options.matchWeight"
            type="range"
            min="0.1"
            max="0.9"
            step="0.1"
            @input="onMatchWeightChange(Number(($event.target as HTMLInputElement).value))"
          />
        </label>
        <label>
          Interest Weight (Candidate Intent): {{ options.interestWeight.toFixed(2) }}
          <input
            :value="options.interestWeight"
            type="range"
            min="0.1"
            max="0.9"
            step="0.1"
            @input="onInterestWeightChange(Number(($event.target as HTMLInputElement).value))"
          />
          <small>Weights are auto-balanced to total 1.0 for consistent ranking.</small>
        </label>
        <label>
          Minimum Experience (Years)
          <input
            v-model.number="options.minExperience"
            type="number"
            min="0"
            max="12"
            placeholder="Example: 3 means only 3+ years candidates"
          />
          <small>Use this to exclude junior profiles from shortlist.</small>
        </label>
        <label>
          Top-K Highlight Count
          <input v-model.number="options.topK" type="number" min="3" max="10" placeholder="How many top names to highlight" />
          <small>This controls the Top shortlist preview section.</small>
        </label>
      </div>

      <label class="inline">
        <input v-model="options.requireAllSkills" type="checkbox" />
        Require all parsed skills
      </label>

      <label>
        Must-have skills (comma-separated, optional)
        <input v-model="options.mustHaveSkillsRaw" type="text" placeholder="Example: Laravel, API, MySQL" />
      </label>

      <button :disabled="loading || !jd.trim()" @click="analyzeJD">
        {{ loading ? "Analyzing..." : "Run Analysis" }}
      </button>

      <p v-if="mode" class="muted">Mode: {{ mode }}</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="warningMessage" class="warning">{{ warningMessage }}</p>
      <div v-if="parsed" class="summary">
        <strong>Parsed JD:</strong>
        <div>Skills: {{ parsed.skills.join(", ") || "None" }}</div>
        <div>Experience: {{ parsed.experience }} years</div>
      </div>
    </div>

    <div class="panel">
      <h2>Ranked Shortlist</h2>
      <p class="muted">Top: {{ topCandidates.map((c) => c.name).join(", ") || "-" }}</p>
      <p class="muted" v-if="results.length">Showing {{ results.length }} / {{ totalCandidates }}</p>
      <div v-for="candidate in results" :key="candidate.name" class="card" @click="selectedCandidate = candidate">
        <div class="row">
          <strong>#{{ candidate.rank }} {{ candidate.name }}</strong>
          <span>{{ candidate.currentRole }}</span>
        </div>
        <div class="row small">
          <span>Match: {{ candidate.matchScore }}</span>
          <span>Interest: {{ candidate.interestScore }}</span>
          <span>Final: {{ candidate.finalScore }}</span>
        </div>
        <div class="small">{{ candidate.location }}</div>
        <p>{{ candidate.explanation }}</p>
      </div>
      <button v-if="hasMore" class="load-more" :disabled="loadingMore" @click="loadMore">
        {{ loadingMore ? "Loading more..." : "Load More" }}
      </button>
    </div>
  </section>

  <section v-if="selectedCandidate" class="panel chat">
    <h3>Simulated Outreach: {{ selectedCandidate.name }}</h3>
    <div v-for="(turn, idx) in selectedCandidate.chatSimulation" :key="idx" class="bubble" :class="turn.role">
      <strong>{{ turn.role }}:</strong> {{ turn.message }}
    </div>
  </section>
</template>

<style scoped>
.page-head {
  margin-bottom: 12px;
}
.page-head h1 {
  margin: 0;
  font-size: 1.9rem;
}
.page-head p {
  margin-top: 6px;
  color: #64748b;
}
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.panel {
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dbe4f0;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
}
h2, h3 { margin: 0 0 12px; }
textarea, input[type="number"], input[type="text"] {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 10px;
  margin-top: 6px;
  background: #fff;
}
textarea:focus,
input[type="number"]:focus,
input[type="text"]:focus {
  border-color: #2563eb;
  outline: 2px solid #bfdbfe;
}
.options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; }
label { display: block; font-size: 14px; margin-top: 8px; }
small { color: #64748b; display: block; margin-top: 4px; font-size: 12px; }
.inline { display: flex; gap: 8px; align-items: center; }
button {
  margin-top: 14px; width: 100%; border: 0; background: #1d4ed8; color: #fff; padding: 10px; border-radius: 10px;
}
button:disabled { opacity: 0.6; }
.muted { color: #64748b; font-size: 13px; }
.error { color: #b91c1c; font-size: 13px; }
.warning { color: #92400e; font-size: 13px; }
.summary { margin-top: 10px; background: #f8fafc; border-radius: 10px; padding: 10px; font-size: 14px; }
.card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px; margin-top: 10px; cursor: pointer; }
.card:hover { border-color: #93c5fd; }
.row { display: flex; justify-content: space-between; gap: 8px; }
.small { font-size: 13px; color: #475569; }
.load-more {
  margin-top: 12px;
  background: #0f766e;
}
.chat {
  margin-top: 16px;
  background: #fff;
  border: 1px solid #dbe4f0;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
}
.bubble { padding: 10px; border-radius: 10px; margin-top: 8px; font-size: 14px; }
.bubble.recruiter { background: #dbeafe; }
.bubble.candidate { background: #dcfce7; }
@media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
</style>
