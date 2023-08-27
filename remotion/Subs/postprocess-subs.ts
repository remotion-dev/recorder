import type { SubTypes, Word } from "../sub-types";

const wordsTogether = (words: Word[]) => {
  const newWords: Word[] = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const previousWord = words[i - 1] ?? null;

    if (!word.word.startsWith(" ") && previousWord) {
      const lastAddedWord = newWords[newWords.length - 1];
      lastAddedWord.word += word.word;
      lastAddedWord.end = word.end;
    } else {
      if (word.word === " remotion") {
        word.word = " Remotion";
      }

      if (word.word === " github") {
        word.word = " GitHub";
      }

      newWords.push(word);
    }
  }

  return newWords;
};

export const postprocessSubtitles = (subTypes: SubTypes): SubTypes => {
  return {
    ...subTypes,
    segments: subTypes.segments.map((segment) => {
      const { words } = segment;

      return {
        ...segment,
        words: wordsTogether(words),
      };
    }),
  };
};
