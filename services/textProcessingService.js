const natural = require("natural");
const getPartOfSpeech  = require('./posTagger'); // Assuming you have a function to get part of speech

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
  const paragraphs = text.split(/\r?\n/);

  return paragraphs.map(paragraph => {
    if (paragraph.startsWith('### ')) {
      return `<h2>${paragraph.slice(4)}</h2>`;
    } else if (paragraph.startsWith('## ')) {
      return `<h1>${paragraph.slice(3)}</h1>`;
    } else {
      let wrappedParagraph = paragraph;

      // Wrap keywords in <span>
      keywords.forEach(({ word, theme }) => {
        const regex = new RegExp(`\\b${word}\\b`, "gi");
        wrappedParagraph = wrappedParagraph.replace(regex, `<span>${word}</span>`);
      });

      // Wrap nouns in <b> and pronouns in <i>
      wrappedParagraph = wrappedParagraph.replace(/\b\w+\b/g, (match) => {
        if (!/<span[^>]*>/.test(match)) { // Avoid wrapping words already in <span>
          const pos = getPartOfSpeech(match);
          if (pos === "noun") {
            return `<b>${match}</b>`;
          } else if (pos === "pronoun") {
            return `<i>${match}</i>`;
          }
        }
        return match;
      });

      return `<p>${wrappedParagraph}</p>`;
    }
  }).join("\n");
};
