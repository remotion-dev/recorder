import type { Word } from "../../../config/autocorrect";

export const hasMonoSpaceInIt = (word: Word) => {
  if (word.text.split("").filter((char) => char === "`").length >= 2) {
    return true;
  }

  return false;
};
