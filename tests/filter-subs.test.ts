import { expect, test } from "bun:test";
import { removeWhisperBlankWords } from "../remotion/captions/postprocess-subs";

const example = [
  {
    word: "",
    start: 0,
    end: 0,
  },
  {
    word: " Test.",
    start: 0,
    end: 1580,
  },
  {
    word: " Hello.",
    start: 1580,
    end: 3240,
  },
  {
    word: " Hello.",
    start: 3240,
    end: 3710,
  },
  {
    word: " Test.",
    start: 3710,
    end: 4000,
  },
  {
    word: " [BLANK_AUDIO]",
    start: 4000,
    end: 10000,
  },
];

test("filter out [BLANK_AUDIO]", () => {
  const words = removeWhisperBlankWords(example);
  expect(words).toEqual([
    {
      word: "",
      start: 0,
      end: 0,
    },
    {
      word: " Test.",
      start: 0,
      end: 1580,
    },
    {
      word: " Hello.",
      start: 1580,
      end: 3240,
    },
    {
      word: " Hello.",
      start: 3240,
      end: 3710,
    },
    {
      word: " Test.",
      start: 3710,
      end: 4000,
    },
    {
      word: "",
      start: 4000,
      end: 10000,
    },
  ]);
});

const pauseExample = [
  {
    word: "",
    start: 0,
    end: 0,
  },
  {
    word: " Test.",
    start: 0,
    end: 1580,
  },
  {
    word: "[PAUSE]",
    start: 1580,
    end: 3240,
  },
];

test("filter out [PAUSE]", () => {
  const words = removeWhisperBlankWords(pauseExample);
  expect(words).toEqual([
    {
      word: "",
      start: 0,
      end: 0,
    },
    {
      word: " Test.",
      start: 0,
      end: 1580,
    },
    {
      word: "",
      start: 1580,
      end: 3240,
    },
  ]);
});

const splittedBlankAudio = [
  {
    word: "[",
    start: 0,
    end: 0,
  },
  {
    word: "BLA",
    start: 0,
    end: 1580,
  },
  {
    word: "NK",
    start: 1580,
    end: 3240,
  },
  {
    word: "_",
    start: 3240,
    end: 3710,
  },
  {
    word: "AUDIO",
    start: 3710,
    end: 4000,
  },
  {
    word: "]",
    start: 4000,
    end: 10000,
  },
];

test("filter out splitted [BLANK_AUDIO]", () => {
  const words = removeWhisperBlankWords(splittedBlankAudio);
  expect(words).toEqual([
    {
      word: "",
      start: 0,
      end: 0,
    },
    {
      word: "",
      start: 0,
      end: 1580,
    },
    {
      word: "",
      start: 1580,
      end: 3240,
    },
    {
      word: "",
      start: 3240,
      end: 3710,
    },
    {
      word: "",
      start: 3710,
      end: 4000,
    },
    {
      word: "",
      start: 4000,
      end: 10000,
    },
  ]);
});

const splittedPause = [
  {
    word: "[P",
    start: 0,
    end: 0,
  },
  {
    word: "AUS",
    start: 0,
    end: 1580,
  },
  {
    word: "E]",
    start: 1580,
    end: 3240,
  },
];

test("filter out splitted [PAUSE]", () => {
  const words = removeWhisperBlankWords(splittedPause);
  expect(words).toEqual([
    {
      word: "",
      start: 0,
      end: 0,
    },
    {
      word: "",
      start: 0,
      end: 1580,
    },
    {
      word: "",
      start: 1580,
      end: 3240,
    },
  ]);
});

const splittedBlankAudioWithSpaces = [
  {
    word: "  [",
    start: 0,
    end: 0,
  },
  {
    word: "BLA  ",
    start: 0,
    end: 1580,
  },
  {
    word: "NK ",
    start: 1580,
    end: 3240,
  },
  {
    word: "_",
    start: 3240,
    end: 3710,
  },
  {
    word: " AUDIO",
    start: 3710,
    end: 4000,
  },
  {
    word: " ]",
    start: 4000,
    end: 10000,
  },
];

test("filter out splitted [BLANK_AUDIO] with spaces", () => {
  const words = removeWhisperBlankWords(splittedBlankAudioWithSpaces);
  expect(words).toEqual([
    {
      word: "",
      start: 0,
      end: 0,
    },
    {
      word: "",
      start: 0,
      end: 1580,
    },
    {
      word: "",
      start: 1580,
      end: 3240,
    },
    {
      word: "",
      start: 3240,
      end: 3710,
    },
    {
      word: "",
      start: 3710,
      end: 4000,
    },
    {
      word: "",
      start: 4000,
      end: 10000,
    },
  ]);
});

const wordsWrappedInBrackets = [
  {
    word: "[Some]",
    start: 0,
    end: 0,
  },
  {
    word: "[Random]",
    start: 0,
    end: 1580,
  },
  {
    word: "[Words]",
    start: 1580,
    end: 3240,
  },
  {
    word: "[In]",
    start: 3240,
    end: 3710,
  },
  {
    word: "[Square]",
    start: 3710,
    end: 4000,
  },
  {
    word: "[braces]",
    start: 4000,
    end: 10000,
  },
];

test("should not filter out other words warpped in []", () => {
  const words = removeWhisperBlankWords(wordsWrappedInBrackets);
  expect(words).toEqual([
    {
      word: "[Some]",
      start: 0,
      end: 0,
    },
    {
      word: "[Random]",
      start: 0,
      end: 1580,
    },
    {
      word: "[Words]",
      start: 1580,
      end: 3240,
    },
    {
      word: "[In]",
      start: 3240,
      end: 3710,
    },
    {
      word: "[Square]",
      start: 3710,
      end: 4000,
    },
    {
      word: "[braces]",
      start: 4000,
      end: 10000,
    },
  ]);
});
