// eslint-disable-next-line @typescript-eslint/triple-slash-reference

import { expect, test } from "bun:test";
import type { Word } from "../config/autocorrect";
import { wordsTogether } from "../remotion/captions/processing/words-together";

const example: Word[] = [
  {
    word: " `bun`",
    lastTimestamp: 5.94,
    firstTimestamp: 0,
  },
  {
    word: " `run`",
    lastTimestamp: 6.54,
    firstTimestamp: 0,
  },
  {
    word: " `dev`",
    lastTimestamp: 6.96,
    firstTimestamp: 0,
  },
  {
    word: ". It",
    lastTimestamp: 8.36,
    firstTimestamp: 0,
  },
  {
    word: " looks",
    lastTimestamp: 8.62,
    firstTimestamp: 0,
  },
];

test("join words correctly", () => {
  const words = wordsTogether(example);
  expect(words).toEqual([
    {
      lastTimestamp: 5.94,
      word: " `bun`",
      firstTimestamp: 0,
    },
    {
      lastTimestamp: 6.54,
      word: " `run`",
      firstTimestamp: 0,
    },
    {
      lastTimestamp: 6.96,
      word: " `dev`.",
      firstTimestamp: 0,
    },
    {
      lastTimestamp: 8.36,
      word: " It",
      firstTimestamp: 0,
    },
    {
      lastTimestamp: 8.62,
      word: " looks",
      firstTimestamp: 0,
    },
  ]);
});
