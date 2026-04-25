<template>
  <section class="hero">
    <div class="badge">Hackathon MVP • Recruiter Workflow</div>
    <h1>Scout, engage, and rank candidates in minutes</h1>
    <p>
      Turn any Job Description into a ranked shortlist with explainable matching, simulated candidate interest,
      and recruiter-friendly controls.
    </p>

    <div class="cta-row">
      <NuxtLink class="btn primary" to="/analyzer">Start Analysis</NuxtLink>
      <NuxtLink class="btn" to="/candidates">Explore Talent Pool</NuxtLink>
    </div>

    <div class="metrics">
      <div class="metric">
        <strong>2 Modes</strong>
        <span>AI + Free Local</span>
      </div>
      <div class="metric">
        <strong>15 Candidates</strong>
        <span>Mock talent dataset</span>
      </div>
      <div class="metric">
        <strong>Explainable</strong>
        <span>Score + reason + chat</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  background: linear-gradient(145deg, #ffffff 0%, #f0f7ff 100%);
  border-radius: 20px;
  padding: 28px;
  border: 1px solid #d9e6f8;
  box-shadow: 0 16px 50px rgba(15, 23, 42, 0.08);
}
.badge {
  display: inline-block;
  font-size: 12px;
  color: #1e40af;
  background: #dbeafe;
  border-radius: 999px;
  padding: 5px 10px;
  font-weight: 600;
  margin-bottom: 12px;
}
h1 {
  margin: 0 0 10px;
  font-size: clamp(1.7rem, 3vw, 2.2rem);
}
p {
  color: #475569;
  line-height: 1.5;
  max-width: 780px;
}
.cta-row {
  margin-top: 18px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.btn {
  text-decoration: none;
  border: 1px solid #cbd5e1;
  color: #0f172a;
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 600;
}
.btn.primary {
  background: #1d4ed8;
  border-color: #1d4ed8;
  color: #fff;
}
.metrics {
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.metric {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
}
.metric strong {
  display: block;
}
.metric span {
  color: #64748b;
  font-size: 13px;
}
@media (max-width: 800px) {
  .metrics {
    grid-template-columns: 1fr;
  }
}
</style>