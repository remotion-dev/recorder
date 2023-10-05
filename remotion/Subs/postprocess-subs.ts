import type { Segment, SubTypes, Word } from "../sub-types";
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
      if (word.word === " github") {
        word.word = " GitHub";
      }

      if (word.word === " BUN") {
        word.word = " Bun";
      }

      if (word.word === " javascript") {
        word.word = " JavaScript";
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

const cutWords = (segment: Segment, maxCharsPerScene: number): Segment[] => {
  const chars = segment.words.map((w) => w.word).join(" ").length;

  if (chars <= maxCharsPerScene) {
    return [segment];
  }

  const middle = Math.round(segment.words.length / 2);
  let bestCut = middle;
  for (let i = 1; i < 4; i++) {
    const index = middle - i;
    const word = segment.words[index].word.trim();
    if (word.endsWith(",") || word.endsWith(".")) {
      bestCut = index + 1;
      break;
    }
  }

  const firstHalf = segment.words.slice(0, bestCut);
  const secondHalf = segment.words.slice(bestCut);

  return [
    {
      ...segment,
      start: firstHalf[0].start,
      end: firstHalf[firstHalf.length - 1].end,
      words: firstHalf,
    },
    ...cutWords(
      {
        ...segment,
        start: secondHalf[0].start,
        end: secondHalf[secondHalf.length - 1].end,
        words: secondHalf,
      },
      maxCharsPerScene,
    ),
  ];
};

export const ensureMaxWords = ({
  subTypes,
  maxCharsPerScene,
}: {
  subTypes: SubTypes;
  maxCharsPerScene: number;
}): SubTypes => {
  return {
    ...subTypes,
    segments: subTypes.segments
      .map((segment) => {
        return cutWords(segment, maxCharsPerScene);
      })
      .filter(truthy)
      .flat(1),
  };
};

export const postprocessSubtitles = (subTypes: SubTypes): SubTypes => {
  const mappedSubTypes: SubTypes = {
    ...subTypes,
    segments: subTypes.segments.map((segment) => {
      return {
        ...segment,
        words: wordsTogether(segment.words),
      };
    }),
  };

  return ensureMaxWords({
    subTypes: mappedSubTypes,
    maxCharsPerScene: 100,
  });
};
