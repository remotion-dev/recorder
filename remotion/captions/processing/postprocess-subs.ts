import { fillTextBox } from "@remotion/layout-utils";
import type { Word } from "../../../config/autocorrect";
import { autocorrectWords } from "../../../config/autocorrect";
import {
  MONOSPACE_FONT_FAMILY,
  MONOSPACE_FONT_WEIGHT,
  REGULAR_FONT_FAMILY,
  REGULAR_FONT_WEIGHT,
} from "../../../config/fonts";
import type { CanvasLayout } from "../../../config/layout";
import { getSafeSpace } from "../../../config/layout";
import type { SubtitleType } from "../Segment";
import { getBorderWidthForSubtitles } from "../Segment";
import {
  whisperWordToWord,
  type Segment,
  type SubTypes,
  type WhisperOutput,
} from "../types";
import { hasMonoSpaceInIt } from "./has-monospace-in-word";
import { splitWordIntoMonospaceSegment } from "./split-word-into-monospace-segment";
import { wordsTogether } from "./words-together";

const balanceWords = ({
  words,
  wordsToUse,
  boxWidth,
  fontSize,
  maxLines,
}: {
  words: Word[];
  wordsToUse: number;
  boxWidth: number;
  maxLines: number;
  fontSize: number;
}) => {
  let bestCut = wordsToUse;

  if (wordsToUse / words.length > 0.9) {
    // Prevent a few hanging words at the end
    bestCut = words.length - 5;
  }

  for (let i = 1; i < 4; i++) {
    const index = bestCut - i;
    const word = (words[index] as Word).text.trim();
    if (word.endsWith(",") || word.endsWith(".")) {
      bestCut = index + 1;
      break;
    }
  }

  while (
    hasMonoSpaceInIt(words[bestCut - 1] as Word) ||
    (words[bestCut - 1] as Word).text.trim() === ""
  ) {
    bestCut--;
  }

  const firstHalf = words.slice(0, bestCut);
  const secondHalf = words.slice(bestCut);

  return [
    { words: firstHalf },
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    ...cutWords({
      words: secondHalf,
      boxWidth,
      maxLines,
      fontSize,
    }),
  ];
};

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
      text: word.text,
      fontFamily: word.monospace ? MONOSPACE_FONT_FAMILY : REGULAR_FONT_FAMILY,
      fontWeight: word.monospace ? MONOSPACE_FONT_WEIGHT : REGULAR_FONT_WEIGHT,
      fontSize,
      // TODO: Fixed in Remotion 4.0.142, it can be set to true
      validateFontIsLoaded: word.text.trim() !== "",
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

  return balanceWords({
    words,
    boxWidth,
    fontSize,
    maxLines,
    wordsToUse,
  });
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
    wordCopy.text = wordCopy.text.trim();
    if (wordCopy.text.includes("[")) {
      inBlank = true;
      firstIdx = index;
    }

    if (
      inBlank &&
      (blankAudio.includes(wordCopy.text) || pause.includes(wordCopy.text))
    ) {
      concatentatedWord += wordCopy.text;
    }

    if (inBlank && wordCopy.text.includes("]")) {
      concatentatedWord += wordCopy.text;
      if (
        concatentatedWord.includes(blankAudio) ||
        concatentatedWord.includes(pause)
      ) {
        for (let i = firstIdx; i <= index; i++) {
          const currentWord = words[i];
          if (currentWord?.text !== undefined) {
            words[i] = {
              ...currentWord,
              text: "",
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
  if (subtitleType === "square") {
    return getSafeSpace(canvasLayout);
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
  const words = subTypes.transcription.map((w, i) => {
    return whisperWordToWord(w, subTypes.transcription[i + 1] ?? null);
  });
  const correctedWords = autocorrectWords(words);

  const allWords = wordsTogether(
    correctedWords.map((word) => {
      return {
        ...word,
        word: word.text.replaceAll(/`\s/g, " `"),
      };
    }),
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
