// popup.js
const API_URL = "http://localhost:3000/api";

// ── DOM Elements ──────────────────────────────────────
const notLoggedIn = document.getElementById("not-logged-in");
const mainContent = document.getElementById("main-content");
const pageTitle = document.getElementById("page-title");
const pageUrl = document.getElementById("page-url");
const pageFavicon = document.getElementById("page-favicon");
const collectionSelect = document.getElementById("collection-select");
const saveBtn = document.getElementById("save-btn");
const btnText = document.getElementById("btn-text");
const btnLoading = document.getElementById("btn-loading");
const errorMsg = document.getElementById("error-msg");
const successMsg = document.getElementById("success-msg");
const openAppBtn = document.getElementById("open-app-btn");
const viewLibraryBtn = document.getElementById("view-library-btn");

// ── Init ──────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  // Step 1: Check login status
  const isLoggedIn = await checkLoginStatus();

  if (!isLoggedIn) {
    showState("not-logged-in");
    return;
  }

  showState("main-content");

  // Step 2: Current tab info lo
  await loadCurrentTab();

  // Step 3: Collections fetch karo
  await loadCollections();
});

// ── Check Login ───────────────────────────────────────
const checkLoginStatus = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      credentials: "include", // cookies bhejo
    });
    return response.ok;
  } catch {
    return false;
  }
};

// ── Load Current Tab ──────────────────────────────────
const loadCurrentTab = async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (tab) {
    pageTitle.textContent = tab.title || "Untitled";
    pageUrl.textContent = tab.url || "";

    // Favicon set karo
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(tab.url).hostname}&sz=32`;
    pageFavicon.src = faviconUrl;

    // URL store karo — save ke liye
    saveBtn.dataset.url = tab.url;
  }
};

// ── Load Collections ──────────────────────────────────
const loadCollections = async () => {
  try {
    const response = await fetch(`${API_URL}/collections`, {
      credentials: "include",
    });

    if (!response.ok) return;

    const data = await response.json();

    // Dropdown populate karo
    data.collections.forEach((col) => {
      const option = document.createElement("option");
      option.value = col._id;
      option.textContent = `${col.icon} ${col.name}`;
      collectionSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Failed to load collections:", error);
  }
};

// ── Save Item ─────────────────────────────────────────
saveBtn.addEventListener("click", async () => {
  const url = saveBtn.dataset.url;
  const collectionId = collectionSelect.value || null;

  if (!url) return;

  // Loading state
  setLoading(true);
  hideMessages();

  try {
    const response = await fetch(`${API_URL}/items/save`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, collectionId }),
    });

    const data = await response.json();

    if (!response.ok) {
      showError(data.message || "Failed to save");
      return;
    }

    // Success!
    showSuccess();

    // 2 sec baad popup close karo
    setTimeout(() => window.close(), 2000);

  } catch (error) {
    showError("Connection failed — is your server running?");
  } finally {
    setLoading(false);
  }
});

// ── Open App ──────────────────────────────────────────
openAppBtn?.addEventListener("click", () => {
  chrome.tabs.create({ url: "http://localhost:5173/dashboard" });
});

// ── View Library ──────────────────────────────────────
viewLibraryBtn?.addEventListener("click", () => {
  chrome.tabs.create({ url: "http://localhost:5173/dashboard" });
});

// ── Helper Functions ──────────────────────────────────
const showState = (state) => {
  notLoggedIn.classList.add("hidden");
  mainContent.classList.add("hidden");

  if (state === "not-logged-in") {
    notLoggedIn.classList.remove("hidden");
  } else {
    mainContent.classList.remove("hidden");
  }
};

const setLoading = (loading) => {
  saveBtn.disabled = loading;
  btnText.classList.toggle("hidden", loading);
  btnLoading.classList.toggle("hidden", !loading);
};

const showError = (msg) => {
  errorMsg.textContent = msg;
  errorMsg.classList.remove("hidden");
};

const showSuccess = () => {
  successMsg.classList.remove("hidden");
  saveBtn.classList.add("hidden");
};

const hideMessages = () => {
  errorMsg.classList.add("hidden");
  successMsg.classList.add("hidden");
};