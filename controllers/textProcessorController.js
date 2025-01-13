const { extractHeavyKeywords, wrapKeywordsInSpan } = require("../services/textProcessingService");
const themes = require("../models/themes.json");

exports.processText = (req, res) => {
  const { text } = req.body;
  
  if (!text) return res.status(400).json({ error: "No text provided" });

  try {
    const keywords = extractHeavyKeywords(text, themes);
    const wrappedText = wrapKeywordsInSpan(text, keywords);
    res.json({ wrapped_text: wrappedText, keywords });
  } catch (error) {
    console.error("Error processing text:", error);
    res.status(500).json({ error: "Failed to process the request", details: error.message });
  }
};
