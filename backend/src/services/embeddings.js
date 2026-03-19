const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({ 
  token: process.env.COHERE_API_KEY 
});

const generateEmbedding = async (text) => {
  try {
    const response = await cohere.embed({
      texts: [text.slice(0, 2000)],
      model: "embed-english-v3.0",
      inputType: "search_document",
    });

    return response.embeddings[0];

  } catch (error) {
    console.error("Embedding failed:", error.message);
    return [];
  }
};

// ── generateTags: auto generate tags using AI ────────
// Takes title + content and generates 5 relevant tags
const generateTags = async (title, content) => {
  try {
    // cohere.chat — conversational AI endpoint
    // We send our instructions as a message/prompt
    const response = await cohere.chat({
      model: "command-r-plus-08-2024",
      message: `
        Below is the title and content of an article.
        Suggest 5 relevant tags for it.
        Return only a JSON array, nothing else.
        Example: ["javascript", "web development", "react"]
        
        Title: ${title}
        Content: ${content.slice(0, 1000)}
      `,
    });

    // response.text contains the AI's reply
    // Remove markdown backticks if AI included them
    const cleaned = response.text
      .replace(/```json|```/g, "")
      .trim();

    return JSON.parse(cleaned);

  } catch (error) {
    console.error("Tagging failed:", error.message);
    return [];
  }
};

// ── generateSummary: create a short summary ──────────
// Generates a 2-3 line summary of the given content
const generateSummary = async (content) => {
  try {
    const response = await cohere.chat({
      model: "command-r-plus-08-2024",
      message: `
        Below is some content. Give a 2-3 line summary of it.
        Write only the summary, nothing extra.
        
        Content: ${content.slice(0, 2000)}
      `,
    });

    return response.text.trim();

  } catch (error) {
    console.error("Summary failed:", error.message);
    return "";
  }
};

// ── generateSearchEmbedding: embedding for search ────
// When user searches, inputType is "search_query"
// When saving a document, inputType is "search_document"
// This difference helps Cohere optimize similarity matching
const generateSearchEmbedding = async (query) => {
  try {
    const response = await cohere.embed({
      texts: [query],
      model: "embed-english-v3.0",
      inputType: "search_query", // ← different type for search queries
    });

    return response.embeddings[0];

  } catch (error) {
    console.error("Search embedding failed:", error.message);
    return [];
  }
};

module.exports = { 
  generateEmbedding, 
  generateTags, 
  generateSummary,
  generateSearchEmbedding  
};