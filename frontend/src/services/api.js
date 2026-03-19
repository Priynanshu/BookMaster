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

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response Interceptor — 401 pe logout karo ────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
)

export default api;