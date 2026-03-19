// popup.js
const API_URL = "https://bookmaster-b6pk.onrender.com/api";
const APP_URL = "https://book-master-ruddy.vercel.app";

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
  const isLoggedIn = await checkLoginStatus();

  if (!isLoggedIn) {
    showState("not-logged-in");
    return;
  }

  showState("main-content");
  await loadCurrentTab();
  await loadCollections();
});

// ── Get Token ─────────────────────────────────────────
// Chrome storage se token lo
const getToken = async () => {
  const result = await chrome.storage.local.get("token");
  return result.token || null;
};

// ── Check Login ───────────────────────────────────────
const checkLoginStatus = async () => {
  try {
    const token = await getToken();
    if (!token) return false;

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

    try {
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(tab.url).hostname}&sz=32`;
      pageFavicon.src = faviconUrl;
    } catch {
      pageFavicon.style.display = "none";
    }

    saveBtn.dataset.url = tab.url;
  }
};

// ── Load Collections ──────────────────────────────────
const loadCollections = async () => {
  try {
    const token = await getToken();
    if (!token) return;

    const response = await fetch(`${API_URL}/collections`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return;

    const data = await response.json();
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

  setLoading(true);
  hideMessages();

  try {
    const token = await getToken();

    const response = await fetch(`${API_URL}/items/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url, collectionId }),
    });

    const data = await response.json();

    if (!response.ok) {
      showError(data.message || "Failed to save");
      return;
    }

    showSuccess();
    setTimeout(() => window.close(), 2000);

  } catch (error) {
    showError("Connection failed!");
  } finally {
    setLoading(false);
  }
});

// ── Open App ──────────────────────────────────────────
openAppBtn?.addEventListener("click", () => {
  chrome.tabs.create({ url: `${APP_URL}/dashboard` });
});

// ── View Library ──────────────────────────────────────
viewLibraryBtn?.addEventListener("click", () => {
  chrome.tabs.create({ url: `${APP_URL}/dashboard` });
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