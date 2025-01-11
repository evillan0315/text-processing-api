const express = require("express");
const natural = require("natural");
const fs = require("fs");
const path = require("path");
const nlp = require("compromise");
const cors = require("cors"); // Import the cors package


const corsOptions = {
  origin: '*', // Allow all origins
};

// Initialize express app
const app = express();
app.use(express.json());
app.use(cors(corsOptions)); // Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or specify the domains you want to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
// Load themes from the themes.json file in the same directory
const themesPath = path.join(__dirname, "themes.json");
let themes;

// Read the themes file synchronously
try {
  themes = JSON.parse(fs.readFileSync(themesPath, "utf-8"));
} catch (error) {
  console.error("Error reading themes file:", error);
  process.exit(1); // Exit the app if there's an error loading themes
}

// Create a tokenizer (like NLTK's word_tokenize)
const tokenizer = new natural.WordTokenizer();

// Helper function to check if a word is related to any of the themes
function isThemeRelated(word, themes) {
  for (const [theme, relatedWords] of Object.entries(themes)) {
    for (const relatedWord of relatedWords) {
      if (natural.JaroWinklerDistance(word, relatedWord) > 0.85) {
        // Approximate similarity measure
        return theme; // Return the theme name
      }
    }
  }
  return null; // No theme related
}

// Function to extract heavy keywords
function extractHeavyKeywords(text, themes) {
  const words = tokenizer.tokenize(text.toLowerCase());
  const stopWords = new Set([
    "a",
    "an",
    "the",
    "and",
    "but",
    "or",
    "so",
    "for",
    "nor",
    "on",
    "in",
    "at",
    "with",
  ]);

  // Filter words by removing stop words and short words
  const filteredWords = words.filter(
    (word) => !stopWords.has(word) && word.length > 2
  );

  // Identify theme-related words
  const heavyKeywords = filteredWords
    .map((word) => {
      const theme = isThemeRelated(word, themes);
      return theme ? { word, theme } : null;
    })
    .filter((item) => item !== null);

  // Return frequency of keywords with their theme
  const keywordCount = {};
  heavyKeywords.forEach(({ word, theme }) => {
    const key = `${word}-${theme}`;
    keywordCount[key] = (keywordCount[key] || 0) + 1;
  });

  const sortedKeywords = Object.entries(keywordCount)
    .map(([key, count]) => {
      const [word, theme] = key.split("-");
      return { word, theme, count };
    })
    .sort((a, b) => b.count - a.count);

  return sortedKeywords;
}

// Function to identify parts of speech using compromise
function getPartOfSpeech(word) {
  const doc = nlp(word);
  if (doc.nouns().found) {
    return "noun";
  } else if (doc.pronouns().found) {
    return "pronoun";
  }
  return null;
}

// Function to wrap keywords in <span> tags with class names based on themes, and nouns and pronouns
function wrapKeywordsInSpan(text, keywords) {
  // Detect line breaks and split the text into paragraphs
  const paragraphs = text.split(/\r?\n/);  // Split by line breaks (\n or \r\n)

  // Wrap each paragraph in <p> or other tags based on hashtags
  const wrappedParagraphs = paragraphs.map(paragraph => {
    // Check if the paragraph starts with ## (double hash)
    if (paragraph.startsWith('### ')) {
      // Wrap with <h2> if it starts with double hash and remove the '## ' part
      paragraph = `<h2>${paragraph.slice(4)}</h2>`;
    }
    
    // Check if the paragraph starts with # (single hash)
    else if (paragraph.startsWith('## ')) {
      // Wrap with <h1> if it starts with a single hash and remove the '# ' part
      paragraph = `<h1>${paragraph.slice(3)}</h1>`;
    } else {
      // For regular paragraphs, wrap the keywords in <span>
      keywords.forEach(({ word, theme }) => {
        const regex = new RegExp(`\\b${word}\\b`, "gi");
        paragraph = paragraph.replace(regex, `<span>${word}</span>`);
      });

      // Wrap nouns in <b> and pronouns in <i>, ensuring no overlap with <span> tags
      paragraph = paragraph.replace(/\b\w+\b/g, (match) => {
        const pos = getPartOfSpeech(match);
        // Avoid wrapping words already in <span>
        if (!/<span[^>]*>/.test(match)) {
          if (pos === "noun") {
            return `<b>${match}</b>`;
          } else if (pos === "pronoun") {
            return `<i>${match}</i>`;
          }
        }
        return match; // No wrapping if it's neither noun nor pronoun
      });

      // Wrap regular paragraphs in <p> tags
      paragraph = `<p>${paragraph}</p>`;
      if (paragraph.startsWith('# ')) {
        // Wrap with <h2> if it starts with double hash and remove the '## ' part
        paragraph = `<h1>${paragraph.slice(2)}</h1>`;
      }
    }
    
    return paragraph;
  });

  // Join all paragraphs back into a single string
  return wrappedParagraphs.join("\n");
}



// Define API route
app.post("/process-text", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  try {
   //onsole.log("Processing text:", text); // Log the input text
    const keywords = extractHeavyKeywords(text, themes);
    const wrappedText = wrapKeywordsInSpan(text, keywords);

    return res.json({
      wrapped_text: wrappedText,
      keywords: keywords,
    });
  } catch (error) {
    console.error("Error processing text:", error); // Log the error for debugging
    return res
      .status(500)
      .json({ error: "Failed to process the request", details: error.message });
  }
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
