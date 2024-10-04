import { Caption } from "@remotion/captions";

export const splitWordIntoMonospaceSegment = (word: Caption): Caption[] => {
  const result: Caption[] = [];

  const regex = /`([^`]+)`/g; // regex pattern to find text enclosed in backticks
  let lastIndex = 0;

  let match;
  while ((match = regex.exec(word.text)) !== null) {
    if (match.index > lastIndex) {
      result.push({ ...word, text: word.text.slice(lastIndex, match.index) });
    }

    result.push({
      ...word,
      text: `${("`" + match[1]) as string}\``,
    });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < word.text.length) {
    result.push({ ...word, text: word.text.slice(lastIndex) });
  }

  return result;
};

export const isCaptionMonospace = (caption: Caption) => {
  return caption.text.startsWith("`") && caption.text.endsWith("`");
};
