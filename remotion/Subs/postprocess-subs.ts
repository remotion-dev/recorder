import { fillTextBox } from "@remotion/layout-utils";
import type { CanvasLayout } from "../configuration";
import { safeSpace } from "../layout/get-layout";
import { splitWordIntoMonospaceSegment } from "../layout/make-monospace-word";
import { hasMonoSpaceInIt } from "../layout/monospace";
import { wordsTogether } from "../layout/words-together";
import {
  whisperWordToWord,
  type Segment,
  type SubTypes,
  type WhisperOutput,
  type Word,
} from "../sub-types";
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
  words,
  boxWidth,
  maxLines,
  fontSize,
}: {
  words: Word[];
  boxWidth: number;
  maxLines: number;
  fontSize: number;
}): Segment[] => {
  const { add } = fillTextBox({ maxBoxWidth: boxWidth, maxLines });
  let wordsToUse = 0;

  for (const word of words) {
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

  if (wordsToUse === words.length) {
    return [{ words }];
  }

  let bestCut = wordsToUse;

  if (wordsToUse / words.length > 0.9) {
    // Prevent a few hanging words at the end
    bestCut = words.length - 5;
  }

  for (let i = 1; i < 4; i++) {
    const index = bestCut - i;
    const word = (words[index] as Word).word.trim();
    if (word.endsWith(",") || word.endsWith(".")) {
      bestCut = index + 1;
      break;
    }
  }

  while (
    hasMonoSpaceInIt(words[bestCut - 1] as Word) ||
    (words[bestCut - 1] as Word).word.trim() === ""
  ) {
    bestCut--;
  }

  if (
    words
      .map((w) => w.word)
      .join("")
      .includes("Material")
  ) {
    bestCut = 7;
  }

  const firstHalf = words.slice(0, bestCut);
  const secondHalf = words.slice(bestCut);

  return [
    { words: firstHalf },
    ...cutWords({
      words: secondHalf,
      boxWidth,
      maxLines,
      fontSize,
    }),
  ];
};

export const removeWhisperBlankWords = (original: Word[]): Word[] => {
  let firstIdx = 0;
  let concatentatedWord = "";
  let inBlank = false;
  const blankAudio = "[BLANK_AUDIO]";
  const pause = "[PAUSE]";

  const words = [...original];

  words.forEach((word, index) => {
    const wordCopy = { ...word };
    wordCopy.word = wordCopy.word.trim();
    if (wordCopy.word.includes("[")) {
      inBlank = true;
      firstIdx = index;
    }

    if (
      inBlank &&
      (blankAudio.includes(wordCopy.word) || pause.includes(wordCopy.word))
    ) {
      concatentatedWord += wordCopy.word;
    }

    if (inBlank && wordCopy.word.includes("]")) {
      concatentatedWord += wordCopy.word;
      if (
        concatentatedWord.includes(blankAudio) ||
        concatentatedWord.includes(pause)
      ) {
        for (let i = firstIdx; i <= index; i++) {
          const currentWord = words[i];
          if (currentWord?.word !== undefined) {
            words[i] = {
              ...currentWord,
              word: "",
            };
          }
        }
      }
    }
  });

  return words;
};

export const getHorizontalPaddingForSubtitles = (
  subtitleType: SubtitleType,
  canvasLayout: CanvasLayout,
) => {
  if (subtitleType === "boxed") {
    return safeSpace(canvasLayout);
  }

  if (subtitleType === "overlayed-center") {
    return 20;
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
  subTypes: WhisperOutput;
  boxWidth: number;
  maxLines: number;
  fontSize: number;
  canvasLayout: CanvasLayout;
  subtitleType: SubtitleType;
}): SubTypes => {
  const allWords = wordsTogether(
    subTypes.transcription.map(whisperWordToWord).map(remapWord),
  );
  const preFilteredWords = removeWhisperBlankWords(allWords);
  const segments = cutWords({
    words: preFilteredWords,
    boxWidth:
      boxWidth -
      getHorizontalPaddingForSubtitles(subtitleType, canvasLayout) * 2 -
      getBorderWidthForSubtitles(subtitleType) * 2,
    maxLines,
    fontSize,
  });

  return {
    ...segments,
    segments: segments.map((segment) => {
      return {
        ...segment,
        words: segment.words
          .map((word) => {
            return splitWordIntoMonospaceSegment(word);
          })
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
