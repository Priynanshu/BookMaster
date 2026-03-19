// src/services/api.js
import axios from "axios";

// ── Base Axios Instance ───────────────────────────────
// Har request mein base URL automatically lagega
// Alag alag jagah URL likhne ki zaroorat nahi
const api = axios.create({
  baseURL:  "https://bookmaster-b6pk.onrender.com/api",
  withCredentials: true, // cookies automatically send hongi
  headers: {
    "Content-Type": "application/json",
  },
});

// Har request mein token automatically lagao
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;