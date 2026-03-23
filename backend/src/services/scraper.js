const axios = require("axios");
const cheerio = require("cheerio");

const scrapeURL = async (url) => {
  try {
    // ── YouTube Special Handling ──────────────────
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return await scrapeYouTube(url);
    }

    // ── Normal Scraping ───────────────────────────
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
      },
      timeout: 10000,
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

    $("script, style, nav, footer, header, aside, iframe").remove();

    const content =
      $("article").text() ||
      $("main").text() ||
      $("body").text();

    const cleanContent = content.replace(/\s+/g, " ").trim().slice(0, 5000);
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
    console.error("Scraping failed:", error.message);
    return {
      url,
      title: extractTitleFromURL(url),
      description: "",
      thumbnail: "",
      content: "",
      type: "article",
      scrapedAt: new Date(),
      error: error.message,
    };
  }
};

// ── YouTube Scraper ───────────────────────────────────
const scrapeYouTube = async (url) => {
  try {
    // YouTube Video ID nikalo
    const videoId = extractYouTubeId(url);

    if (!videoId) {
      return {
        url,
        title: "YouTube Video",
        description: "",
        thumbnail: "",
        content: "",
        type: "video",
        siteName: "YouTube",
        scrapedAt: new Date(),
      };
    }

    // YouTube oEmbed API use karo — free hai, key nahi chahiye
    const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

    const { data } = await axios.get(oEmbedUrl, { timeout: 8000 });

    // YouTube thumbnail URLs
    const thumbnail =
      `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    return {
      url,
      title: data.title || "YouTube Video",
      description: `Video by ${data.author_name} on YouTube`,
      thumbnail,
      siteName: "YouTube",
      content: `${data.title} by ${data.author_name}. YouTube video.`,
      type: "video",
      scrapedAt: new Date(),
    };

  } catch (error) {
    console.error("YouTube scrape error:", error.message);

    // oEmbed fail ho — fallback
    const videoId = extractYouTubeId(url);
    return {
      url,
      title: "YouTube Video",
      description: "",
      thumbnail: videoId
        ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        : "",
      siteName: "YouTube",
      content: "",
      type: "video",
      scrapedAt: new Date(),
    };
  }
};

// ── YouTube Video ID Extract ──────────────────────────
const extractYouTubeId = (url) => {
  try {
    // youtube.com/watch?v=VIDEO_ID
    if (url.includes("youtube.com/watch")) {
      const urlObj = new URL(url);
      return urlObj.searchParams.get("v");
    }

    // youtu.be/VIDEO_ID
    if (url.includes("youtu.be/")) {
      const parts = url.split("youtu.be/");
      return parts[1]?.split("?")[0];
    }

    // youtube.com/shorts/VIDEO_ID
    if (url.includes("/shorts/")) {
      const parts = url.split("/shorts/");
      return parts[1]?.split("?")[0];
    }

    return null;
  } catch {
    return null;
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
