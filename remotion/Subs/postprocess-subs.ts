import { fillTextBox } from "@remotion/layout-utils";
import type { CanvasLayout } from "../configuration";
import { safeSpace } from "../layout/get-layout";
import { splitWordIntoMonospaceSegment } from "../layout/make-monospace-word";
import { hasMonoSpaceInIt } from "../layout/monospace";
import { wordsTogether } from "../layout/words-together";
import type { Segment, SubTypes, Word } from "../sub-types";
import { remapWord } from "./remap-words";
import type { SubtitleType } from "./Segment";
import { getBorderWidthForSubtitles } from "./Segment";
import {
  monospaceFont,
  monospaceFontWeight,
  regularFont,
  regularFontWeight,
} from "./Word";

const cutWords = ({
  segment,
  boxWidth,
  maxLines,
  fontSize,
}: {
  segment: Segment;
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

  if (wordsToUse / segment.words.length > 0.9) {
    // Prevent a few hanging words at the end
    bestCut = segment.words.length - 5;
  }

  for (let i = 1; i < 4; i++) {
    const index = bestCut - i;
    const word = (segment.words[index] as Word).word.trim();
    if (word.endsWith(",") || word.endsWith(".")) {
      bestCut = index + 1;
      break;
    }
  }

  while (
    hasMonoSpaceInIt(segment.words[bestCut - 1] as Word) ||
    (segment.words[bestCut - 1] as Word).word.trim() === ""
  ) {
    bestCut--;
  }

  const firstHalf = segment.words.slice(0, bestCut);
  const secondHalf = segment.words.slice(bestCut);

  return [
    {
      ...segment,
      start: (firstHalf[0] as Word).start,
      end: (firstHalf[firstHalf.length - 1] as Word).end,
      words: firstHalf,
    },
    ...cutWords({
      segment: {
        ...segment,
        start: (secondHalf[0] as Word).start,
        end: (secondHalf[secondHalf.length - 1] as Word).end,
        words: secondHalf,
      },
      boxWidth,
      maxLines,
      fontSize,
    }),
  ];
};

export const ensureMaxWords = ({
  subTypes,
  maxLines,
  boxWidth,
  fontSize,
}: {
  subTypes: SubTypes;
  maxLines: number;
  boxWidth: number;
  fontSize: number;
}): SubTypes => {
  if (subTypes.segments.length === 0) {
    return subTypes;
  }

  const firstSegment = subTypes.segments[0] as Segment;
  const lastSegment = subTypes.segments[
    subTypes.segments.length - 1
  ] as Segment;

  const masterSegment: Segment = {
    id: firstSegment.id,
    start: firstSegment.start,
    end: lastSegment.end,
    words: subTypes.segments.flatMap((s) => s.words),
  };

  return {
    ...subTypes,
    segments: cutWords({
      segment: masterSegment,
      boxWidth,
      maxLines,
      fontSize,
    }),
  };
};

export const getHorizontalPaddingForSubtitles = (
  subtitleType: SubtitleType,
  canvasLayout: CanvasLayout,
) => {
  if (subtitleType === "boxed") {
    return safeSpace(canvasLayout);
  }

  return 0;
};

export const postprocessSubtitles = ({
  subTypes,
  boxWidth,
  maxLines,
  fontSize,
  canvasLayout,
  subtitleType,
}: {
  subTypes: SubTypes;
  boxWidth: number;
  maxLines: number;
  fontSize: number;
  canvasLayout: CanvasLayout;
  subtitleType: SubtitleType;
}): SubTypes => {
  const mappedSubTypes: SubTypes = {
    ...subTypes,
    segments: subTypes.segments.map((segment) => {
      return {
        ...segment,
        words: wordsTogether(segment.words.map((w) => remapWord(w))),
      };
    }),
  };

  const maxWords = ensureMaxWords({
    subTypes: mappedSubTypes,
    boxWidth:
      boxWidth -
      getHorizontalPaddingForSubtitles(subtitleType, canvasLayout) * 2 -
      getBorderWidthForSubtitles(subtitleType) * 2,
    maxLines,
    fontSize,
  });

  return {
    ...maxWords,
    segments: maxWords.segments.map((segment) => {
      return {
        ...segment,
        words: segment.words
          .map((word) => splitWordIntoMonospaceSegment(word))
          .flat(1),
      };
    }),
  };
};

declare global {
  interface Array<T> {
    findLastIndex(
      predicate: (value: T, index: number, obj: T[]) => unknown,
    ): number;
  }
}
