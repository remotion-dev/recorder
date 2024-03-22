import type { Word } from "../types";

export const hasMonoSpaceInIt = (word: Word) => {
  if (word.word.split("").filter((char) => char === "`").length >= 2) {
    return true;
  }

  return false;
};
