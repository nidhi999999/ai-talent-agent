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
const query = ref("");
const minExperience = ref(0);
const candidates = ref<Candidate[]>([]);

const fetchCandidates = async () => {
  loading.value = true;
  try {
    const res = await $fetch("/api/candidates", {
      query: {
        search: query.value,
        minExperience: minExperience.value
      }
    });
    candidates.value = res.candidates || [];
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCandidates);
</script>

<template>
  <section class="panel">
    <h2>Candidate Explorer</h2>
    <p>Use this page to inspect your talent pool before running JD analysis.</p>
    <div class="filters">
      <input v-model="query" placeholder="Search name, skill, role, location..." @input="fetchCandidates" />
      <input v-model.number="minExperience" type="number" min="0" max="12" @change="fetchCandidates" />
      <button @click="fetchCandidates">{{ loading ? "Loading..." : "Refresh" }}</button>
    </div>
    <div class="list">
      <div v-for="candidate in candidates" :key="candidate.name" class="card">
        <strong>{{ candidate.name }}</strong>
        <div>{{ candidate.currentRole }} - {{ candidate.location }}</div>
        <div>{{ candidate.experience }} years</div>
        <div class="chips">
          <span v-for="skill in candidate.skills" :key="skill">{{ skill }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.panel { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; }
h2 { margin: 0; }
p { color: #64748b; margin-top: 8px; }
.filters { display: grid; grid-template-columns: 1fr 140px 120px; gap: 10px; margin-top: 12px; }
input { width: 100%; border: 1px solid #cbd5e1; border-radius: 10px; padding: 9px; }
button { border: 0; background: #1d4ed8; color: #fff; border-radius: 10px; }
.list { margin-top: 14px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px; background: #f8fafc; }
.chips { margin-top: 7px; display: flex; flex-wrap: wrap; gap: 6px; }
.chips span { background: #dbeafe; color: #1e3a8a; border-radius: 99px; padding: 4px 8px; font-size: 12px; }
@media (max-width: 900px) {
  .filters { grid-template-columns: 1fr; }
  .list { grid-template-columns: 1fr; }
}
</style>
