import { fillTextBox } from "@remotion/layout-utils";
import { Word } from "../../../config/autocorrect";
import {
  MONOSPACE_FONT_FAMILY,
  MONOSPACE_FONT_WEIGHT,
  REGULAR_FONT_FAMILY,
  REGULAR_FONT_WEIGHT,
} from "../../../config/fonts";
import { CanvasLayout, getSafeSpace } from "../../../config/layout";
import { SubtitleType, getBorderWidthForSubtitles } from "../Segment";
import { CaptionPage, LayoutedCaptions } from "../types";
import { hasMonoSpaceInIt } from "./has-monospace-in-word";
import { splitWordIntoMonospaceSegment } from "./split-word-into-monospace-segment";

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
}): CaptionPage[] => {
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

export const layoutCaptions = ({
  words,
  subtitleType,
  boxWidth,
  fontSize,
  maxLines,
  canvasLayout,
}: {
  words: Word[];
  subtitleType: SubtitleType;
  boxWidth: number;
  maxLines: number;
  fontSize: number;
  canvasLayout: CanvasLayout;
}): LayoutedCaptions => {
  const wordBalanceStrategy =
    subtitleType === "square" ? "fill-box-if-possible" : "equal-width";

  const segments = cutWords({
    words,
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
