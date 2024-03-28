import { expect, test } from "bun:test";
import type { Word } from "../config/autocorrect";
import { removeWhisperBlankWords } from "../remotion/captions/processing/postprocess-subs";

const example: Word[] = [
  {
    word: "",
    firstTimestamp: 0,
    lastTimestamp: 0,
  },
  {
    word: " Test.",
    firstTimestamp: 0,
    lastTimestamp: 1580,
  },
  {
    word: " Hello.",
    firstTimestamp: 1580,
    lastTimestamp: 3240,
  },
  {
    word: " Hello.",
    firstTimestamp: 3240,
    lastTimestamp: 3710,
  },
  {
    word: " Test.",
    firstTimestamp: 3710,
    lastTimestamp: 4000,
  },
  {
    word: " [BLANK_AUDIO]",
    firstTimestamp: 4000,
    lastTimestamp: 10000,
  },
];

test("filter out [BLANK_AUDIO]", () => {
  const words = removeWhisperBlankWords(example);
  expect(words).toEqual([
    {
      word: "",
      firstTimestamp: 0,
      lastTimestamp: 0,
    },
    {
      word: " Test.",
      firstTimestamp: 0,
      lastTimestamp: 1580,
    },
    {
      word: " Hello.",
      firstTimestamp: 1580,
      lastTimestamp: 3240,
    },
    {
      word: " Hello.",
      firstTimestamp: 3240,
      lastTimestamp: 3710,
    },
    {
      word: " Test.",
      firstTimestamp: 3710,
      lastTimestamp: 4000,
    },
    {
      word: "",
      firstTimestamp: 4000,
      lastTimestamp: 10000,
    },
  ]);
});

const pauseExample = [
  {
    word: "",
    firstTimestamp: 0,
    lastTimestamp: 0,
  },
  {
    word: " Test.",
    firstTimestamp: 0,
    lastTimestamp: 1580,
  },
  {
    word: "[PAUSE]",
    firstTimestamp: 1580,
    lastTimestamp: 3240,
  },
];

test("filter out [PAUSE]", () => {
  const words = removeWhisperBlankWords(pauseExample);
  expect(words).toEqual([
    {
      word: "",
      firstTimestamp: 0,
      lastTimestamp: 0,
    },
    {
      word: " Test.",
      firstTimestamp: 0,
      lastTimestamp: 1580,
    },
    {
      word: "",
      firstTimestamp: 1580,
      lastTimestamp: 3240,
    },
  ]);
});

const splittedBlankAudio = [
  {
    word: "[",
    firstTimestamp: 0,
    lastTimestamp: 0,
  },
  {
    word: "BLA",
    firstTimestamp: 0,
    lastTimestamp: 1580,
  },
  {
    word: "NK",
    firstTimestamp: 1580,
    lastTimestamp: 3240,
  },
  {
    word: "_",
    firstTimestamp: 3240,
    lastTimestamp: 3710,
  },
  {
    word: "AUDIO",
    firstTimestamp: 3710,
    lastTimestamp: 4000,
  },
  {
    word: "]",
    firstTimestamp: 4000,
    lastTimestamp: 10000,
  },
];

test("filter out splitted [BLANK_AUDIO]", () => {
  const words = removeWhisperBlankWords(splittedBlankAudio);
  expect(words).toEqual([
    {
      word: "",
      firstTimestamp: 0,
      lastTimestamp: 0,
    },
    {
      word: "",
      firstTimestamp: 0,
      lastTimestamp: 1580,
    },
    {
      word: "",
      firstTimestamp: 1580,
      lastTimestamp: 3240,
    },
    {
      word: "",
      firstTimestamp: 3240,
      lastTimestamp: 3710,
    },
    {
      word: "",
      firstTimestamp: 3710,
      lastTimestamp: 4000,
    },
    {
      word: "",
      firstTimestamp: 4000,
      lastTimestamp: 10000,
    },
  ]);
});

const splittedPause = [
  {
    word: "[P",
    firstTimestamp: 0,
    lastTimestamp: 0,
  },
  {
    word: "AUS",
    firstTimestamp: 0,
    lastTimestamp: 1580,
  },
  {
    word: "E]",
    firstTimestamp: 1580,
    lastTimestamp: 3240,
  },
];

test("filter out splitted [PAUSE]", () => {
  const words = removeWhisperBlankWords(splittedPause);
  expect(words).toEqual([
    {
      word: "",
      firstTimestamp: 0,
      lastTimestamp: 0,
    },
    {
      word: "",
      firstTimestamp: 0,
      lastTimestamp: 1580,
    },
    {
      word: "",
      firstTimestamp: 1580,
      lastTimestamp: 3240,
    },
  ]);
});

const splittedBlankAudioWithSpaces = [
  {
    word: "  [",
    firstTimestamp: 0,
    lastTimestamp: 0,
  },
  {
    word: "BLA  ",
    firstTimestamp: 0,
    lastTimestamp: 1580,
  },
  {
    word: "NK ",
    firstTimestamp: 1580,
    lastTimestamp: 3240,
  },
  {
    word: "_",
    firstTimestamp: 3240,
    lastTimestamp: 3710,
  },
  {
    word: " AUDIO",
    firstTimestamp: 3710,
    lastTimestamp: 4000,
  },
  {
    word: " ]",
    firstTimestamp: 4000,
    lastTimestamp: 10000,
  },
];

test("filter out splitted [BLANK_AUDIO] with spaces", () => {
  const words = removeWhisperBlankWords(splittedBlankAudioWithSpaces);
  expect(words).toEqual([
    {
      word: "",
      firstTimestamp: 0,
      lastTimestamp: 0,
    },
    {
      word: "",
      firstTimestamp: 0,
      lastTimestamp: 1580,
    },
    {
      word: "",
      firstTimestamp: 1580,
      lastTimestamp: 3240,
    },
    {
      word: "",
      firstTimestamp: 3240,
      lastTimestamp: 3710,
    },
    {
      word: "",
      firstTimestamp: 3710,
      lastTimestamp: 4000,
    },
    {
      word: "",
      firstTimestamp: 4000,
      lastTimestamp: 10000,
    },
  ]);
});

const wordsWrappedInBrackets = [
  {
    word: "[Some]",
    firstTimestamp: 0,
    lastTimestamp: 0,
  },
  {
    word: "[Random]",
    firstTimestamp: 0,
    lastTimestamp: 1580,
  },
  {
    word: "[Words]",
    firstTimestamp: 1580,
    lastTimestamp: 3240,
  },
  {
    word: "[In]",
    firstTimestamp: 3240,
    lastTimestamp: 3710,
  },
  {
    word: "[Square]",
    firstTimestamp: 3710,
    lastTimestamp: 4000,
  },
  {
    word: "[braces]",
    firstTimestamp: 4000,
    lastTimestamp: 10000,
  },
];

test("should not filter out other words warpped in []", () => {
  const words = removeWhisperBlankWords(wordsWrappedInBrackets);
  expect(words).toEqual([
    {
      word: "[Some]",
      firstTimestamp: 0,
      lastTimestamp: 0,
    },
    {
      word: "[Random]",
      firstTimestamp: 0,
      lastTimestamp: 1580,
    },
    {
      word: "[Words]",
      firstTimestamp: 1580,
      lastTimestamp: 3240,
    },
    {
      word: "[In]",
      firstTimestamp: 3240,
      lastTimestamp: 3710,
    },
    {
      word: "[Square]",
      firstTimestamp: 3710,
      lastTimestamp: 4000,
    },
    {
      word: "[braces]",
      firstTimestamp: 4000,
      lastTimestamp: 10000,
    },
  ]);
});
