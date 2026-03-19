// src/services/searchService.js
import api from "./api";

// ── Semantic Search ───────────────────────────────────
const semanticSearch = async (query) => {
  const response = await api.get("/search", { params: { q: query } });
  return response.data;
};

// ── Search by Tag ─────────────────────────────────────
const searchByTag = async (tag) => {
  const response = await api.get("/search/tags", { params: { tag } });
  return response.data;
};

// ── Get All Tags ──────────────────────────────────────
const getAllTags = async () => {
  const response = await api.get("/search/tags/all");
  return response.data;
};

const searchService = { semanticSearch, searchByTag, getAllTags };
export default searchService;