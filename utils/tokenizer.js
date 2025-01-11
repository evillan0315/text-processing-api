const natural = require("natural");

// Create a tokenizer instance
const tokenizer = new natural.WordTokenizer();

// Stop words list (you can expand this as needed)
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

/**
 * Tokenizes a given text and removes stop words and short words.
 * @param {string} text - The input text to tokenize.
 * @returns {string[]} - An array of filtered tokens.
 */
function tokenizeAndFilter(text) {
  const tokens = tokenizer.tokenize(text.toLowerCase());
  return tokens.filter((word) => !stopWords.has(word) && word.length > 2);
}

module.exports = {
  tokenizeAndFilter,
};
