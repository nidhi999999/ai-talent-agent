<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="brand">Catalyst Talent Agent</div>
      <nav class="nav">
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/analyzer">Analyzer</NuxtLink>
        <NuxtLink to="/candidates">Candidates</NuxtLink>
      </nav>
    </header>
    <main class="page-wrap">
      <NuxtPage />
    </main>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: radial-gradient(circle at top right, #dbeafe 0%, #f6f8fb 40%, #f8fafc 100%);
  color: #0f172a;
}
.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 22px;
  background: rgba(11, 18, 32, 0.9);
  backdrop-filter: blur(8px);
  color: #fff;
  border-bottom: 1px solid rgba(148, 163, 184, 0.25);
}
.brand {
  font-weight: 700;
  letter-spacing: 0.3px;
  font-size: 0.97rem;
}
.nav {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.nav a {
  color: #dbeafe;
  text-decoration: none;
  padding: 7px 11px;
  border-radius: 10px;
  font-size: 0.92rem;
  transition: 0.2s ease;
}
.nav a:hover {
  background: rgba(59, 130, 246, 0.25);
}
.nav a.router-link-active {
  background: #1d4ed8;
  color: #fff;
}
.page-wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
}
@media (max-width: 760px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .page-wrap {
    padding: 16px;
  }
}
</style>
