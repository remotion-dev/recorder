// eslint-disable-next-line @typescript-eslint/triple-slash-reference

import { expect, test } from "bun:test";
import { wordsTogether } from "../remotion/captions/words-together";

const example = [
  {
    word: " `bun`",
    start: 5.42,
    end: 5.94,
  },
  {
    word: " `run`",
    start: 5.94,
    end: 6.54,
  },
  {
    word: " `dev`",
    start: 6.54,
    end: 6.96,
  },
  {
    word: ". It",
    start: 7.76,
    end: 8.36,
  },
  {
    word: " looks",
    start: 8.36,
    end: 8.62,
  },
];

test("join words correctly", () => {
  const words = wordsTogether(example);
  expect(words).toEqual([
    {
      end: 5.94,
      start: 5.42,
      word: " `bun`",
    },
    {
      end: 6.54,
      start: 5.94,
      word: " `run`",
    },
    {
      start: 6.54,
      end: 6.96,
      word: " `dev`.",
    },
    {
      end: 8.36,
      start: 7.76,
      word: " It",
    },
    {
      end: 8.62,
      start: 8.36,
      word: " looks",
    },
  ]);
});
