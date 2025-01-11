const natural = require("natural");
const { WordTokenizer } = natural;
const nlp = require("compromise");

const tokenizer = new WordTokenizer();

exports.extractHeavyKeywords = (text, themes) => {
  const words = tokenizer.tokenize(text.toLowerCase());
  const stopWords = new Set(["a", "an", "the", "and", "but", "or", "so", "for", "nor", "on", "in", "at", "with"]);
  const filteredWords = words.filter(word => !stopWords.has(word) && word.length > 2);

  const heavyKeywords = filteredWords.map(word => {
    for (const [theme, relatedWords] of Object.entries(themes)) {
      for (const relatedWord of relatedWords) {
        if (natural.JaroWinklerDistance(word, relatedWord) > 0.85) return { word, theme };
      }
    }
    return null;
  }).filter(Boolean);

  return heavyKeywords;
};

exports.wrapKeywordsInSpan = (text, keywords) => {
  return text.replace(/\b\w+\b/g, word => {
    const keyword = keywords.find(k => k.word.toLowerCase() === word.toLowerCase());
    return keyword ? `<span>${word}</span>` : word;
  });
};
