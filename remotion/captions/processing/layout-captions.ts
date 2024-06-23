import { fillTextBox } from "@remotion/layout-utils";
import { Word } from "../../../config/autocorrect";
import {
  MONOSPACE_FONT_FAMILY,
  MONOSPACE_FONT_WEIGHT,
  REGULAR_FONT_FAMILY,
  REGULAR_FONT_WEIGHT,
} from "../../../config/fonts";
import { getSafeSpace } from "../../../config/layout";
import { getBorderWidthForSubtitles } from "../boxed/components/CaptionSentence";
import { CaptionPage, LayoutedCaptions } from "../types";
import { hasMonoSpaceInIt } from "./has-monospace-in-word";
import { splitWordIntoMonospaceSegment } from "./split-word-into-monospace-segment";

const balanceWords = ({
  words,
  wordsFitted,
  boxWidth,
  fontSize,
  maxLines,
}: {
  words: Word[];
  wordsFitted: number;
  boxWidth: number;
  maxLines: number;
  fontSize: number;
}) => {
  let bestCut = wordsFitted;

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
    }),
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
  });
};

export const getHorizontalPaddingForSubtitles = () => {
  return getSafeSpace("square");
};

export const layoutCaptions = ({
  words,
  boxWidth,
  fontSize,
  maxLines,
}: {
  words: Word[];
  boxWidth: number;
  maxLines: number;
  fontSize: number;
}): LayoutedCaptions => {
  const segments = cutWords({
    words,
    boxWidth:
      boxWidth -
      getHorizontalPaddingForSubtitles() * 2 -
      getBorderWidthForSubtitles() * 2,
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
