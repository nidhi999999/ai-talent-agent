<script setup lang="ts">
import { ref, onMounted } from "vue";

type Candidate = {
  name: string;
  skills: string[];
  experience: number;
  location: string;
  currentRole: string;
};

const loading = ref(false);
const loadingMore = ref(false);
const query = ref("");
const minExperience = ref(0);
const candidates = ref<Candidate[]>([]);
const total = ref(0);
const hasMore = ref(false);
const pageSize = 8;

const fetchCandidates = async (offset = 0, append = false) => {
  if (append) {
    loadingMore.value = true;
  } else {
    loading.value = true;
  }

  try {
    const res = await $fetch("/api/candidates", {
      query: {
        search: query.value,
        minExperience: minExperience.value,
        offset,
        limit: pageSize
      }
    });
    total.value = Number(res.total || 0);
    hasMore.value = Boolean(res.hasMore);
    candidates.value = append ? [...candidates.value, ...(res.candidates || [])] : (res.candidates || []);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const applyFilters = () => {
  fetchCandidates(0, false);
};

const loadMore = () => {
  if (!hasMore.value || loadingMore.value) return;
  fetchCandidates(candidates.value.length, true);
};

onMounted(fetchCandidates);
</script>

<template>
  <section class="page-head">
    <h2>Candidate Explorer</h2>
    <p>Search your talent pool before analysis. Use filters to narrow candidates by profile relevance and experience level.</p>
  </section>

  <section class="panel">
    <div class="filters">
      <label class="field">
        <span>Search Candidate or Skill</span>
        <input
          v-model="query"
          placeholder="Try: Laravel, Ahmedabad, Full Stack, Rahul"
          @input="applyFilters"
        />
      </label>

      <label class="field">
        <span>Minimum Experience (Years)</span>
        <input
          v-model.number="minExperience"
          type="number"
          min="0"
          max="12"
          placeholder="Example: 3 means 3+ years only"
          @change="applyFilters"
        />
        <small>Only candidates with this many years (or more) will be shown.</small>
      </label>

      <button class="refresh" @click="applyFilters">{{ loading ? "Refreshing..." : "Refresh List" }}</button>
    </div>

    <div class="meta">
      <p>Total matching candidates: <strong>{{ total }}</strong></p>
      <p v-if="candidates.length">Showing <strong>{{ candidates.length }}</strong> of <strong>{{ total }}</strong></p>
    </div>

    <div class="list">
      <div v-for="candidate in candidates" :key="candidate.name" class="card">
        <div class="title-row">
          <strong>{{ candidate.name }}</strong>
          <span class="badge">{{ candidate.experience }} yrs</span>
        </div>
        <div class="sub">{{ candidate.currentRole }} • {{ candidate.location }}</div>
        <div class="chips">
          <span v-for="skill in candidate.skills" :key="skill">{{ skill }}</span>
        </div>
      </div>
    </div>

    <button v-if="hasMore" class="load-more" :disabled="loadingMore" @click="loadMore">
      {{ loadingMore ? "Loading more..." : "Load More Candidates" }}
    </button>
  </section>
</template>

<style scoped>
.page-head {
  margin-bottom: 12px;
}
.page-head h2 {
  margin: 0;
  font-size: 1.8rem;
}
.page-head p {
  color: #64748b;
  margin-top: 6px;
}
.panel {
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dbe4f0;
  border-radius: 18px;
  padding: 18px;
}
.filters {
  display: grid;
  grid-template-columns: 1.4fr 1fr auto;
  gap: 12px;
  align-items: start;
}
.field span {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  display: inline-block;
  margin-bottom: 4px;
}
.field small {
  color: #64748b;
  display: block;
  margin-top: 4px;
  font-size: 12px;
}
input {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 11px 12px;
  margin-top: 6px;
  background: #fff;
}
input:focus {
  border-color: #2563eb;
  outline: 2px solid #bfdbfe;
}
.refresh,
.load-more {
  border: 0;
  background: #1d4ed8;
  color: #fff;
  border-radius: 12px;
  padding: 11px 14px;
  font-weight: 600;
  cursor: pointer;
}
.refresh {
  margin-top: 25px;
  min-height: 44px;
}
.load-more {
  margin-top: 14px;
  width: 100%;
  background: #0f766e;
}
.meta {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  color: #475569;
  font-size: 13px;
}
.list {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.card {
  border: 1px solid #d9e2ef;
  border-radius: 14px;
  padding: 12px;
  background: #fff;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.05);
}
.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.badge {
  background: #dbeafe;
  color: #1e40af;
  border-radius: 999px;
  padding: 4px 9px;
  font-size: 12px;
  font-weight: 600;
}
.sub {
  margin-top: 5px;
  color: #475569;
  font-size: 13px;
}
.chips {
  margin-top: 9px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.chips span {
  background: #e2e8f0;
  color: #0f172a;
  border-radius: 99px;
  padding: 4px 8px;
  font-size: 12px;
}
@media (max-width: 900px) {
  .filters { grid-template-columns: 1fr; }
  .meta { flex-direction: column; gap: 4px; }
  .list { grid-template-columns: 1fr; }
}
</style>
