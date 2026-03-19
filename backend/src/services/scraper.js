const axios = require("axios");
const cheerio = require("cheerio");

const scrapeURL = async (url) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
      },
      timeout: 10000, // 10 sec mein error
    });

    const $ = cheerio.load(data);

    const title =
      $("meta[property='og:title']").attr("content") ||
      $("title").text() ||
      "Untitled";

    const description =
      $("meta[property='og:description']").attr("content") ||
      $("meta[name='description']").attr("content") ||
      "";

    const thumbnail =
      $("meta[property='og:image']").attr("content") || "";

    const siteName =
      $("meta[property='og:site_name']").attr("content") || "";

    // ── Content Extract ─────────────────────────────────
    // Ads / nav / footer हटाओ
    $("script, style, nav, footer, header, aside, iframe").remove();

    // Main article text nikalo
    const content =
      $("article").text() ||
      $("main").text() ||
      $("body").text();

    // Clean karo — extra spaces/newlines hatao
    const cleanContent = content
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 5000); // AI ke liye 5000 chars kafi hai

    // ── Type Detect ─────────────────────────────────────
    const type = detectType(url, siteName);

    return {
      url,
      title: title.trim(),
      description: description.trim(),
      thumbnail,
      siteName,
      content: cleanContent,
      type,
      scrapedAt: new Date(),
    };
  } catch (error) {
    // Site ne block kiya ya timeout — basic info return karo
    console.error("Scraping failed:", error.message);
    return {
      url,
      title: extractTitleFromURL(url), // URL se hi title banao
      description: "",
      thumbnail: "",
      content: "",
      type: "article",
      scrapedAt: new Date(),
      error: error.message,
    };
  }
};

// ── Helper: URL se type detect karo ───────────────────
const detectType = (url, siteName) => {
  if (url.includes("youtube.com") || url.includes("youtu.be"))
    return "video";
  if (url.includes("twitter.com") || url.includes("x.com"))
    return "tweet";
  if (url.endsWith(".pdf")) return "pdf";
  if (url.match(/\.(jpg|jpeg|png|gif|webp)$/)) return "image";
  if (
    siteName.toLowerCase().includes("youtube") ||
    siteName.toLowerCase().includes("vimeo")
  )
    return "video";
  return "article";
};

// ── Helper: URL se readable title banao ───────────────
const extractTitleFromURL = (url) => {
  try {
    const { hostname, pathname } = new URL(url);
    const slug = pathname.split("/").filter(Boolean).pop() || hostname;
    return slug.replace(/[-_]/g, " ").replace(/\.\w+$/, "");
  } catch {
    return url;
  }
};

module.exports = { scrapeURL };
