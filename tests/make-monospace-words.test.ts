// eslint-disable-next-line @typescript-eslint/triple-slash-reference

import { expect, test } from "bun:test";
import { splitWordIntoMonospaceSegment } from "../remotion/captions/split-word-into-monospace-segment";
import type { Word } from "../remotion/captions/types";

test("Should split up into monospace words", () => {
  const word: Word = {
    start: 10,
    end: 100,
    word: "This is a `monospace` word",
    monospace: false,
  };

  expect(splitWordIntoMonospaceSegment(word)).toEqual([
    {
      start: 10,
      end: 100,
      word: "This is a ",
      monospace: false,
    },
    {
      start: 10,
      end: 100,
      word: "monospace",
      monospace: true,
    },
    {
      start: 10,
      end: 100,
      word: " word",
      monospace: false,
    },
  ]);
});
