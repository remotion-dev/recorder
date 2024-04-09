// eslint-disable-next-line @typescript-eslint/triple-slash-reference

import { expect, test } from "bun:test";
import type { Word } from "../config/autocorrect";
import { splitWordIntoMonospaceSegment } from "../remotion/captions/processing/split-word-into-monospace-segment";

test("Should split up into monospace words", () => {
  const word: Word = {
    word: "This is a `monospace` word",
    monospace: false,
    firstTimestamp: 0,
    lastTimestamp: 0,
  };

  expect(splitWordIntoMonospaceSegment(word)).toEqual([
    {
      word: "This is a ",
      monospace: false,
      firstTimestamp: 0,
      lastTimestamp: 0,
    },
    {
      word: "monospace",
      monospace: true,
      firstTimestamp: 0,
      lastTimestamp: 0,
    },
    {
      word: " word",
      monospace: false,
      firstTimestamp: 0,
      lastTimestamp: 0,
    },
  ]);
});
