// src/services/api.js
import axios from "axios";

// ── Base Axios Instance ───────────────────────────────
// Har request mein base URL automatically lagega
// Alag alag jagah URL likhne ki zaroorat nahi
const api = axios.create({
  baseURL:  "http://localhost:3000/api",
  withCredentials: true, // cookies automatically send hongi
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;