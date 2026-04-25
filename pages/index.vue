<template>
  <section class="hero">
    <h1>AI-Powered Talent Scouting & Engagement Agent</h1>
    <p>
      Parse JDs, rank candidates on match + interest, view explainability, and export recruiter-ready shortlists.
    </p>

    <div class="cta-row">
      <NuxtLink class="btn primary" to="/analyzer">Open Analyzer</NuxtLink>
      <NuxtLink class="btn" to="/candidates">Browse Candidates</NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.hero {
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  border: 1px solid #e2e8f0;
}
h1 {
  margin: 0 0 8px;
}
p {
  color: #475569;
  line-height: 1.5;
}
.cta-row {
  margin-top: 16px;
  display: flex;
  gap: 10px;
}
.btn {
  text-decoration: none;
  border: 1px solid #cbd5e1;
  color: #0f172a;
  padding: 9px 14px;
  border-radius: 10px;
}
.btn.primary {
  background: #1d4ed8;
  border-color: #1d4ed8;
  color: #fff;
}
</style>