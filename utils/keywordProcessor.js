const { tokenizeAndFilter } = require('./utils/tokenizer');

function extractHeavyKeywords(text, themes) {
  const words = tokenizeAndFilter(text);
  // Rest of the logic for theme matching...
}
