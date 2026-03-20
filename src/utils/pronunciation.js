import pronunciationHints from '../data/pronunciationHints.json';

const EXACT_HINTS = pronunciationHints.map((hint, index) => ({
  ...hint,
  index,
  regex: new RegExp(hint.pattern, 'gi'),
}));

export function normalizePronunciationText(text) {
  if (!text) return text;

  return EXACT_HINTS.reduce((current, hint) => {
    return current.replace(hint.regex, hint.replacement);
  }, text);
}