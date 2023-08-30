import type { SubTypes, Word } from "../sub-types";
import { truthy } from "../truthy";

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

      word.word = word.word.replace(" Algorra", " Algora");
      word.word = word.word.replace(" remotion.", " Remotion.");
      word.word = word.word.replace(" ReMotion", " Remotion");
      word.word = word.word.replace(" Monorepo", " monorepo");
      word.word = word.word.replace(" rust.", " Rust.");

      newWords.push(word);
    }
  }

  return newWords;
};

const maxWordsPerSegment = 15;

const ensureMaxWords = (subTypes: SubTypes): SubTypes => {
  return {
    ...subTypes,
    segments: subTypes.segments
      .map((segment) => {
        const { words } = segment;

        if (words.length > maxWordsPerSegment) {
          const middle = Math.round(words.length / 2);
          const firstHalf = words.slice(0, middle);
          const secondHalf = words.slice(middle);
          return [
            {
              ...segment,
              start: firstHalf[0].start,
              end: firstHalf[firstHalf.length - 1].end,
              words: firstHalf,
            },
            {
              ...segment,
              start: secondHalf[0].start,
              end: secondHalf[secondHalf.length - 1].end,
              words: secondHalf,
            },
          ];
        }

        return [segment];
      })
      .filter(truthy)
      .flat(1),
  };
};

export const postprocessSubtitles = (subTypes: SubTypes): SubTypes => {
  return ensureMaxWords({
    ...subTypes,
    segments: subTypes.segments.map((segment) => {
      const { words } = segment;

      return {
        ...segment,
        words: wordsTogether(words),
      };
    }),
  });
};
