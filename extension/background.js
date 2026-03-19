// background.js
// Right click menu add karo — "Save to BookMaster"
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-to-bookmaster",
    title: "💾 Save to BookMaster",
    contexts: ["page", "link"],
  });
});

// Right click menu click handler
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "save-to-bookmaster") {
    const url = info.linkUrl || info.pageUrl;

    try {
      const response = await fetch("http://localhost:3000/api/items/save", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        // Success notification
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