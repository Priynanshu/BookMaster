// background.js
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-to-bookmaster",
    title: "💾 Save to BookMaster",
    contexts: ["page", "link"],
  });
});

// ── Token Save karo jab frontend bheje ───────────────
chrome.runtime.onMessageExternal.addListener(
  (message, sender, sendResponse) => {
    if (message.type === "SAVE_TOKEN") {
      chrome.storage.local.set({ token: message.token });
      sendResponse({ success: true });
    }
    if (message.type === "CLEAR_TOKEN") {
      chrome.storage.local.remove("token");
      sendResponse({ success: true });
    }
  }
);

// ── Right Click Save ──────────────────────────────────
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "save-to-bookmaster") {
    const url = info.linkUrl || info.pageUrl;
    const result = await chrome.storage.local.get("token");
    const token = result.token;

    if (!token) {
      chrome.tabs.create({ 
        url: "https://book-master-ruddy.vercel.app/login" 
      });
      return;
    }

    try {
      const response = await fetch(
        "https://bookmaster-b6pk.onrender.com/api/items/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ url }),
        }
      );

      if (response.ok) {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icons/icon48.png",
          title: "BookMaster",
          message: "✅ Saved to your library!",
        });
      }
    } catch (error) {
      console.error("Background save error:", error);
    }
  }
});