import type { Word } from "../sub-types";

export const hasMonoSpaceInIt = (word: Word) => {
  if (word.word.split("").filter((char) => char === "`").length >= 2) {
    return true;
  }

  return false;
};

export const removeMonospace = (word: Word) => {
  return {
    ...word,
    word: word.word.replace(/`/g, ""),
  };
};
