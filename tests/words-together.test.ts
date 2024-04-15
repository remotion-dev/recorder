// eslint-disable-next-line @typescript-eslint/triple-slash-reference

import { expect, test } from "bun:test";
import type { Word } from "../config/autocorrect";
import { wordsTogether } from "../remotion/captions/processing/words-together";

const example: Word[] = [
  {
    text: " `bun`",
    lastTimestamp: 5.94,
    firstTimestamp: 0,
  },
  {
    text: " `run`",
    lastTimestamp: 6.54,
    firstTimestamp: 0,
  },
  {
    text: " `dev`",
    lastTimestamp: 6.96,
    firstTimestamp: 0,
  },
  {
    text: ". It",
    lastTimestamp: 8.36,
    firstTimestamp: 0,
  },
  {
    text: " looks",
    lastTimestamp: 8.62,
    firstTimestamp: 0,
  },
];

test("join words correctly", () => {
  const words = wordsTogether(example);
  expect(words).toEqual([
    {
      lastTimestamp: 5.94,
      text: " `bun`",
      firstTimestamp: 0,
    },
    {
      lastTimestamp: 6.54,
      text: " `run`",
      firstTimestamp: 0,
    },
    {
      lastTimestamp: 6.96,
      text: " `dev`.",
      firstTimestamp: 0,
    },
    {
      lastTimestamp: 8.36,
      text: " It",
      firstTimestamp: 0,
    },
    {
      lastTimestamp: 8.62,
      text: " looks",
      firstTimestamp: 0,
    },
  ]);
});
