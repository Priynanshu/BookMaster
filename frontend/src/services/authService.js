// src/services/authService.js
import api from "./api";

// ── Register ──────────────────────────────────────────
// New user banana
const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// ── Login ─────────────────────────────────────────────
// Existing user login
const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

// ── Logout ────────────────────────────────────────────
// User logout
const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

// ── Get Me ────────────────────────────────────────────
// Current logged in user ka data
const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

const authService = { register, login, logout, getMe };
export default authService;