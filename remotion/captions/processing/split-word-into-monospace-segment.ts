import type { Word } from "../types";

export const splitWordIntoMonospaceSegment = (word: Word): Word[] => {
  const result: Word[] = [];

  const regex = /`([^`]+)`/g; // regex pattern to find text enclosed in backticks
  let lastIndex = 0;

  let match;
  while ((match = regex.exec(word.word)) !== null) {
    if (match.index > lastIndex) {
      result.push({ ...word, word: word.word.slice(lastIndex, match.index) });
    }

    result.push({ ...word, word: match[1] as string, monospace: true });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < word.word.length) {
    result.push({ ...word, word: word.word.slice(lastIndex) });
  }

  return result;
};
