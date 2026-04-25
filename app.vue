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
  background: #f6f8fb;
  color: #0f172a;
}
.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 24px;
  background: #0b1220;
  color: #fff;
}
.brand {
  font-weight: 700;
  letter-spacing: 0.2px;
}
.nav {
  display: flex;
  gap: 16px;
}
.nav a {
  color: #dbeafe;
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 8px;
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
</style>
