import { defineEventHandler, getQuery } from "h3";
import { candidates } from "../data/candidates";

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const search = String(query.search || "").toLowerCase();
  const minExperience = Number(query.minExperience || 0);

  const filtered = candidates.filter((candidate) => {
    const text = `${candidate.name} ${candidate.currentRole} ${candidate.location} ${candidate.skills.join(" ")}`.toLowerCase();
    const matchesSearch = !search || text.includes(search);
    const matchesExperience = candidate.experience >= minExperience;
    return matchesSearch && matchesExperience;
  });

  return {
    total: filtered.length,
    candidates: filtered
  };
});
