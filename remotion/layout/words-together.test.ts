// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../node_modules/bun-types/types.d.ts" />

import { expect, test } from "bun:test";
import { wordsTogether } from "./words-together";

const example = [
  {
    word: " `bun`",
    start: 5.42,
    end: 5.94,
    probability: 0.20170751214027405,
  },
  {
    word: " `run`",
    start: 5.94,
    end: 6.54,
    probability: 0.570287823677063,
  },
  {
    word: " `dev`",
    start: 6.54,
    end: 6.96,
    probability: 0.27501168847084045,
  },
  {
    word: ". It",
    start: 7.76,
    end: 8.36,
    probability: 0.9788318872451782,
  },
  {
    word: " looks",
    start: 8.36,
    end: 8.62,
    probability: 0.9966997504234314,
  },
];

test("join words correctly", () => {
  const words = wordsTogether(example);
  expect(words).toEqual([
    {
      end: 5.94,
      probability: 0.20170751214027405,
      start: 5.42,
      word: " `bun`",
    },
    {
      end: 6.54,
      probability: 0.570287823677063,
      start: 5.94,
      word: " `run`",
    },
    {
      start: 6.54,
      end: 6.96,
      probability: 0.27501168847084045,
      word: " `dev`.",
    },
    {
      end: 8.36,
      probability: 0.9788318872451782,
      start: 7.76,
      word: " It",
    },
    {
      end: 8.62,
      probability: 0.9966997504234314,
      start: 8.36,
      word: " looks",
    },
  ]);
});
