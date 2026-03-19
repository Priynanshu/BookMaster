import api from "./api";

// ── Extension ID ──────────────────────────────────────
// chrome://extensions/ se copy karo
const EXTENSION_ID = "lknnojaldmjkngkhgcmdclpemebijief"; // ← yahan apna ID daalo

// ── Extension ko message bhejo ────────────────────────
const sendToExtension = (message) => {
  try {
    chrome.runtime.sendMessage(EXTENSION_ID, message);
  } catch (e) {
    // Extension nahi hai — ignore karo
  }
};

// ── Register ──────────────────────────────────────────
const register = async (userData) => {
  const response = await api.post("/auth/register", userData);

  if (response.data.token) {
    // localStorage mein save karo
    localStorage.setItem("token", response.data.token);

    // Extension ko token bhejo
    sendToExtension({
      type: "SAVE_TOKEN",
      token: response.data.token,
    });
  }

  return response.data;
};

// ── Login ─────────────────────────────────────────────
const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  if (response.data.token) {
    // localStorage mein save karo
    localStorage.setItem("token", response.data.token);

    // Extension ko token bhejo
    sendToExtension({
      type: "SAVE_TOKEN",
      token: response.data.token,
    });
  }

  return response.data;
};

// ── Logout ────────────────────────────────────────────
const logout = async () => {
  const response = await api.post("/auth/logout");

  // localStorage clear karo
  localStorage.removeItem("token");

  // Extension ka token bhi clear karo
  sendToExtension({
    type: "CLEAR_TOKEN",
  });

  return response.data;
};

// ── Get Me ────────────────────────────────────────────
const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

const authService = { register, login, logout, getMe };
export default authService;