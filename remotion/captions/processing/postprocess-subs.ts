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
import { type Segment, type SubTypes, type WhisperOutput } from "../types";
import { hasMonoSpaceInIt } from "./has-monospace-in-word";
import { removeBlankTokens } from "./remove-blank-tokens";
import { splitWordIntoMonospaceSegment } from "./split-word-into-monospace-segment";
import { whisperWordToWord } from "./whisper-word-to-word";
import { wordsTogether } from "./words-together";

type WordBalanceStrategy = "fill-box-if-possible" | "equal-width";

const balanceWords = ({
  words,
  wordsFitted,
  boxWidth,
  fontSize,
  maxLines,
  wordBalanceStrategy,
}: {
  words: Word[];
  wordsFitted: number;
  boxWidth: number;
  maxLines: number;
  fontSize: number;
  wordBalanceStrategy: WordBalanceStrategy;
}) => {
  let bestCut =
    wordBalanceStrategy === "fill-box-if-possible"
      ? wordsFitted
      : Math.round(words.length / 2);

  if (wordsFitted / words.length > 0.9) {
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
    (bestCut > 1 && hasMonoSpaceInIt(words[bestCut - 1] as Word)) ||
    (words[bestCut - 1] as Word).text.trim() === ""
  ) {
    bestCut--;
  }

  const firstHalf = words.slice(0, bestCut);
  const secondHalf = words.slice(bestCut);

  return [
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    ...cutWords({
      words: firstHalf,
      boxWidth,
      maxLines,
      fontSize,
      wordBalanceStrategy,
    }),
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    ...cutWords({
      words: secondHalf,
      boxWidth,
      maxLines,
      fontSize,
      wordBalanceStrategy,
    }),
  ];
};

const cutWords = ({
  words,
  boxWidth,
  maxLines,
  fontSize,
  wordBalanceStrategy,
}: {
  words: Word[];
  boxWidth: number;
  maxLines: number;
  fontSize: number;
  wordBalanceStrategy: WordBalanceStrategy;
}): Segment[] => {
  const { add } = fillTextBox({ maxBoxWidth: boxWidth, maxLines });
  let wordsFitted = 0;

  for (const word of words) {
    const { exceedsBox } = add({
      text: word.text,
      fontFamily: word.monospace ? MONOSPACE_FONT_FAMILY : REGULAR_FONT_FAMILY,
      fontWeight: word.monospace ? MONOSPACE_FONT_WEIGHT : REGULAR_FONT_WEIGHT,
      fontSize,
      validateFontIsLoaded: true,
    });

    if (exceedsBox) {
      break;
    } else {
      wordsFitted++;
    }
  }

  if (wordsFitted === words.length) {
    return [{ words }];
  }

  return balanceWords({
    words,
    boxWidth,
    fontSize,
    maxLines,
    wordsFitted,
    wordBalanceStrategy,
  });
};

const FILLER_WORDS = ["[PAUSE]", "[BLANK_AUDIO]", "[Silence]"];

const removeWhisperBlankWords = (original: Word[]): Word[] => {
  let firstIdx = 0;
  let concatentatedWord = "";
  let inBlank = false;

  const words = [...original];
  words.forEach((word, index) => {
    const wordCopy = { ...word };
    wordCopy.text = wordCopy.text.trim();
    if (wordCopy.text.includes("[")) {
      inBlank = true;
      firstIdx = index;
    }

    if (inBlank && FILLER_WORDS.find((w) => w.includes(wordCopy.text))) {
      concatentatedWord += wordCopy.text;
    }

    if (inBlank && wordCopy.text.includes("]")) {
      concatentatedWord += wordCopy.text;
      if (FILLER_WORDS.find((w) => concatentatedWord.includes(w))) {
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
    return 60;
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
  const blankTokensRemoved = removeBlankTokens(subTypes.transcription);
  const words = blankTokensRemoved.map((w, i) => {
    return whisperWordToWord(w, blankTokensRemoved[i + 1] ?? null);
  });

  const wordBalanceStrategy =
    subtitleType === "square" ? "fill-box-if-possible" : "equal-width";

  const removeBlankAudioAndPause = removeWhisperBlankWords(words);
  const removeBlankTokensAgain = removeBlankAudioAndPause.filter(
    (w) => w.text.trim() !== "",
  );

  const correctedWords = autocorrectWords(removeBlankTokensAgain);

  const movedBackTickToWord = correctedWords.map((word) => {
    return {
      ...word,
      text: word.text.replaceAll(/`\s/g, " `"),
    };
  });

  const allWords = wordsTogether(movedBackTickToWord);

  const preFilteredWords = allWords;
  const segments = cutWords({
    words: preFilteredWords,
    boxWidth:
      boxWidth -
      getHorizontalPaddingForSubtitles(subtitleType, canvasLayout) * 2 -
      getBorderWidthForSubtitles(subtitleType) * 2,
    maxLines,
    fontSize,
    wordBalanceStrategy,
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
