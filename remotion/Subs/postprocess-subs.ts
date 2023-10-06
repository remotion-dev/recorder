import { splitWordIntoMonospaceSegment } from "../layout/make-monospace-word";
import { fillTextBox } from "../layout/measure/fill-layout";
import type { Segment, SubTypes, Word } from "../sub-types";
import { remapWord } from "./remap-words";
import {
  monospaceFont,
  monospaceFontWeight,
  regularFont,
  regularFontWeight,
} from "./Word";

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
      newWords.push(word);
    }
  }

  return newWords;
};

const cutWords = ({
  segment,
  maxCharsPerScene,
  boxWidth,
  maxLines,
  fontSize,
}: {
  segment: Segment;
  maxCharsPerScene: number;
  boxWidth: number;
  maxLines: number;
  fontSize: number;
}): Segment[] => {
  const { add } = fillTextBox({ maxBoxWidth: boxWidth, maxLines });
  let wordsToUse = 0;

  for (const word of segment.words) {
    const { exceedsBox } = add({
      text: word.word,
      fontFamily: word.monospace ? monospaceFont : regularFont,
      fontWeight: word.monospace ? monospaceFontWeight : regularFontWeight,
      fontSize,
    });

    if (exceedsBox) {
      break;
    } else {
      wordsToUse++;
    }
  }

  if (wordsToUse === segment.words.length) {
    return [segment];
  }

  let bestCut = wordsToUse;
  for (let i = 1; i < 4; i++) {
    const index = bestCut - i;
    const word = segment.words[index].word.trim();
    if (word.endsWith(",") || word.endsWith(".")) {
      bestCut = index + 1;
      break;
    }
  }

  while (
    segment.words[bestCut - 1].monospace ||
    segment.words[bestCut - 1].word.trim() === ""
  ) {
    bestCut--;
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
    ...cutWords({
      segment: {
        ...segment,
        start: secondHalf[0].start,
        end: secondHalf[secondHalf.length - 1].end,
        words: secondHalf,
      },
      maxCharsPerScene,
      boxWidth,
      maxLines,
      fontSize,
    }),
  ];
};

export const ensureMaxWords = ({
  subTypes,
  maxCharsPerScene,
  maxLines,
  boxWidth,
  fontSize,
}: {
  subTypes: SubTypes;
  maxCharsPerScene: number;
  maxLines: number;
  boxWidth: number;
  fontSize: number;
}): SubTypes => {
  const masterSegment: Segment = {
    id: subTypes.segments[0].id,
    start: subTypes.segments[0].start,
    end: subTypes.segments[subTypes.segments.length - 1].end,
    words: subTypes.segments.flatMap((s) => s.words),
  };

  return {
    ...subTypes,
    segments: cutWords({
      segment: masterSegment,
      maxCharsPerScene,
      boxWidth,
      maxLines,
      fontSize,
    }),
  };
};

export const postprocessSubtitles = (
  subTypes: SubTypes,
  boxWidth: number,
  maxLines: number,
  fontSize: number,
): SubTypes => {
  const mappedSubTypes: SubTypes = {
    ...subTypes,
    segments: subTypes.segments.map((segment) => {
      return {
        ...segment,
        words: wordsTogether(
          segment.words
            .map((word) => splitWordIntoMonospaceSegment(word))
            .flat(1)
            .map((w) => remapWord(w)),
        ),
      };
    }),
  };

  return ensureMaxWords({
    subTypes: mappedSubTypes,
    maxCharsPerScene: 100,
    boxWidth,
    maxLines,
    fontSize,
  });
};

export {};

declare global {
  interface Array<T> {
    findLastIndex(
      predicate: (value: T, index: number, obj: T[]) => unknown,
    ): number;
  }
}
