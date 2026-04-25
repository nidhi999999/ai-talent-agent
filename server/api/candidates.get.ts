import { defineEventHandler, getQuery } from "h3";
import { candidates } from "../data/candidates";

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const search = String(query.search || "").toLowerCase();
  const minExperience = Number(query.minExperience || 0);
  const offset = Math.max(0, Number(query.offset || 0));
  const limit = Math.min(20, Math.max(4, Number(query.limit || 8)));

  const filtered = candidates.filter((candidate) => {
    const text = `${candidate.name} ${candidate.currentRole} ${candidate.location} ${candidate.skills.join(" ")}`.toLowerCase();
    const matchesSearch = !search || text.includes(search);
    const matchesExperience = candidate.experience >= minExperience;
    return matchesSearch && matchesExperience;
  });

  const paged = filtered.slice(offset, offset + limit);

  return {
    total: filtered.length,
    hasMore: offset + limit < filtered.length,
    candidates: paged
  };
});
