import type { Word } from "../sub-types";

export const wordsTogether = (words: Word[]) => {
  const newWords: Word[] = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const previousWord = words[i - 1] ?? null;

    if (word.word.startsWith(". ")) {
      const lastAddedWord = newWords[newWords.length - 1];
      lastAddedWord.word += ".";
      word.word = word.word.slice(1);
    }

    if (!word.word.startsWith(" ") && previousWord) {
      const lastAddedWord = newWords[newWords.length - 1];
      lastAddedWord.word += word.word;
      lastAddedWord.end = word.end;
      if (word.monospace) {
        lastAddedWord.monospace = true;
      }
    } else {
      newWords.push(word);
    }
  }

  return newWords;
};
