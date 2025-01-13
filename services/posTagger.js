const nlp = require('compromise');

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

module.exports = getPartOfSpeech;

