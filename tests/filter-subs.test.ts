import { expect, test } from "bun:test";
import type { Word } from "../config/autocorrect";
import { removeWhisperBlankWords } from "../remotion/captions/processing/postprocess-subs";

const example: Word[] = [
  {
    text: "",
    firstTimestamp: 0,
    lastTimestamp: 0,
  },
  {
    text: " Test.",
    firstTimestamp: 0,
    lastTimestamp: 1580,
  },
  {
    text: " Hello.",
    firstTimestamp: 1580,
    lastTimestamp: 3240,
  },
  {
    text: " Hello.",
    firstTimestamp: 3240,
    lastTimestamp: 3710,
  },
  {
    text: " Test.",
    firstTimestamp: 3710,
    lastTimestamp: 4000,
  },
  {
    text: " [BLANK_AUDIO]",
    firstTimestamp: 4000,
    lastTimestamp: 10000,
  },
];

test("filter out [BLANK_AUDIO]", () => {
  const words = removeWhisperBlankWords(example);
  expect(words).toEqual([
    {
      text: "",
      firstTimestamp: 0,
      lastTimestamp: 0,
    },
    {
      text: " Test.",
      firstTimestamp: 0,
      lastTimestamp: 1580,
    },
    {
      text: " Hello.",
      firstTimestamp: 1580,
      lastTimestamp: 3240,
    },
    {
      text: " Hello.",
      firstTimestamp: 3240,
      lastTimestamp: 3710,
    },
    {
      text: " Test.",
      firstTimestamp: 3710,
      lastTimestamp: 4000,
    },
    {
      text: "",
      firstTimestamp: 4000,
      lastTimestamp: 10000,
    },
  ]);
});

const pauseExample = [
  {
    text: "",
    firstTimestamp: 0,
    lastTimestamp: 0,
  },
  {
    text: " Test.",
    firstTimestamp: 0,
    lastTimestamp: 1580,
  },
  {
    text: "[PAUSE]",
    firstTimestamp: 1580,
    lastTimestamp: 3240,
  },
];

test("filter out [PAUSE]", () => {
  const words = removeWhisperBlankWords(pauseExample);
  expect(words).toEqual([
    {
      text: "",
      firstTimestamp: 0,
      lastTimestamp: 0,
    },
    {
      text: " Test.",
      firstTimestamp: 0,
      lastTimestamp: 1580,
    },
    {
      text: "",
      firstTimestamp: 1580,
      lastTimestamp: 3240,
    },
  ]);
});

const splittedBlankAudio = [
  {
    text: "[",
    firstTimestamp: 0,
    lastTimestamp: 0,
  },
  {
    text: "BLA",
    firstTimestamp: 0,
    lastTimestamp: 1580,
  },
  {
    text: "NK",
    firstTimestamp: 1580,
    lastTimestamp: 3240,
  },
  {
    text: "_",
    firstTimestamp: 3240,
    lastTimestamp: 3710,
  },
  {
    text: "AUDIO",
    firstTimestamp: 3710,
    lastTimestamp: 4000,
  },
  {
    text: "]",
    firstTimestamp: 4000,
    lastTimestamp: 10000,
  },
];

test("filter out splitted [BLANK_AUDIO]", () => {
  const words = removeWhisperBlankWords(splittedBlankAudio);
  expect(words).toEqual([
    {
      text: "",
      firstTimestamp: 0,
      lastTimestamp: 0,
    },
    {
      text: "",
      firstTimestamp: 0,
      lastTimestamp: 1580,
    },
    {
      text: "",
      firstTimestamp: 1580,
      lastTimestamp: 3240,
    },
    {
      text: "",
      firstTimestamp: 3240,
      lastTimestamp: 3710,
    },
    {
      text: "",
      firstTimestamp: 3710,
      lastTimestamp: 4000,
    },
    {
      text: "",
      firstTimestamp: 4000,
      lastTimestamp: 10000,
    },
  ]);
});

const splittedPause = [
  {
    text: "[P",
    firstTimestamp: 0,
    lastTimestamp: 0,
  },
  {
    text: "AUS",
    firstTimestamp: 0,
    lastTimestamp: 1580,
  },
  {
    text: "E]",
    firstTimestamp: 1580,
    lastTimestamp: 3240,
  },
];

test("filter out splitted [PAUSE]", () => {
  const words = removeWhisperBlankWords(splittedPause);
  expect(words).toEqual([
    {
      text: "",
      firstTimestamp: 0,
      lastTimestamp: 0,
    },
    {
      text: "",
      firstTimestamp: 0,
      lastTimestamp: 1580,
    },
    {
      text: "",
      firstTimestamp: 1580,
      lastTimestamp: 3240,
    },
  ]);
});

const splittedBlankAudioWithSpaces = [
  {
    text: "  [",
    firstTimestamp: 0,
    lastTimestamp: 0,
  },
  {
    text: "BLA  ",
    firstTimestamp: 0,
    lastTimestamp: 1580,
  },
  {
    text: "NK ",
    firstTimestamp: 1580,
    lastTimestamp: 3240,
  },
  {
    text: "_",
    firstTimestamp: 3240,
    lastTimestamp: 3710,
  },
  {
    text: " AUDIO",
    firstTimestamp: 3710,
    lastTimestamp: 4000,
  },
  {
    text: " ]",
    firstTimestamp: 4000,
    lastTimestamp: 10000,
  },
];

test("filter out splitted [BLANK_AUDIO] with spaces", () => {
  const words = removeWhisperBlankWords(splittedBlankAudioWithSpaces);
  expect(words).toEqual([
    {
      text: "",
      firstTimestamp: 0,
      lastTimestamp: 0,
    },
    {
      text: "",
      firstTimestamp: 0,
      lastTimestamp: 1580,
    },
    {
      text: "",
      firstTimestamp: 1580,
      lastTimestamp: 3240,
    },
    {
      text: "",
      firstTimestamp: 3240,
      lastTimestamp: 3710,
    },
    {
      text: "",
      firstTimestamp: 3710,
      lastTimestamp: 4000,
    },
    {
      text: "",
      firstTimestamp: 4000,
      lastTimestamp: 10000,
    },
  ]);
});

const wordsWrappedInBrackets = [
  {
    text: "[Some]",
    firstTimestamp: 0,
    lastTimestamp: 0,
  },
  {
    text: "[Random]",
    firstTimestamp: 0,
    lastTimestamp: 1580,
  },
  {
    text: "[Words]",
    firstTimestamp: 1580,
    lastTimestamp: 3240,
  },
  {
    text: "[In]",
    firstTimestamp: 3240,
    lastTimestamp: 3710,
  },
  {
    text: "[Square]",
    firstTimestamp: 3710,
    lastTimestamp: 4000,
  },
  {
    text: "[braces]",
    firstTimestamp: 4000,
    lastTimestamp: 10000,
  },
];

test("should not filter out other words warpped in []", () => {
  const words = removeWhisperBlankWords(wordsWrappedInBrackets);
  expect(words).toEqual([
    {
      text: "[Some]",
      firstTimestamp: 0,
      lastTimestamp: 0,
    },
    {
      text: "[Random]",
      firstTimestamp: 0,
      lastTimestamp: 1580,
    },
    {
      text: "[Words]",
      firstTimestamp: 1580,
      lastTimestamp: 3240,
    },
    {
      text: "[In]",
      firstTimestamp: 3240,
      lastTimestamp: 3710,
    },
    {
      text: "[Square]",
      firstTimestamp: 3710,
      lastTimestamp: 4000,
    },
    {
      text: "[braces]",
      firstTimestamp: 4000,
      lastTimestamp: 10000,
    },
  ]);
});
