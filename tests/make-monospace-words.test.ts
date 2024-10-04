// eslint-disable-next-line @typescript-eslint/triple-slash-reference

import { Caption } from "@remotion/captions";
import { expect, test } from "bun:test";
import { splitWordIntoMonospaceSegment } from "../remotion/captions/processing/split-word-into-monospace-segment";

test("Should split up into monospace words", () => {
  const word: Caption = {
    text: "This is a `monospace` word",
    startMs: 0,
    endMs: 0,
    confidence: null,
    timestampMs: 0,
  };

  expect(splitWordIntoMonospaceSegment(word)).toEqual([
    {
      text: "This is a ",
      startMs: 0,
      confidence: null,
      endMs: 0,
      timestampMs: 0,
    },
    {
      text: "`monospace`",
      startMs: 0,
      endMs: 0,
      confidence: null,
      timestampMs: 0,
    },
    {
      text: " word",
      startMs: 0,
      endMs: 0,
      confidence: null,
      timestampMs: 0,
    },
  ]);
});
