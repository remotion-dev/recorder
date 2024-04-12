import type { Word } from "../../../config/autocorrect";

export const splitWordIntoMonospaceSegment = (word: Word): Word[] => {
  const result: Word[] = [];

  const regex = /`([^`]+)`/g; // regex pattern to find text enclosed in backticks
  let lastIndex = 0;

  let match;
  while ((match = regex.exec(word.text)) !== null) {
    if (match.index > lastIndex) {
      result.push({ ...word, text: word.text.slice(lastIndex, match.index) });
    }

    result.push({ ...word, text: match[1] as string, monospace: true });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < word.text.length) {
    result.push({ ...word, text: word.text.slice(lastIndex) });
  }

  return result;
};
