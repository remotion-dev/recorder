import type { Word } from "../sub-types";

export const wordsTogether = (words: Word[]) => {
  const newWords: Word[] = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i] as Word;
    const previousWord = words[i - 1] ?? null;

    if (word.word.startsWith(". ")) {
      const lastAddedWord = newWords[newWords.length - 1] as Word;
      lastAddedWord.word += ".";
      word.word = word.word.slice(1);
    }

    if (!word.word.startsWith(" ") && previousWord) {
      const lastAddedWord = newWords[newWords.length - 1] as Word;
      lastAddedWord.word += word.word;
      lastAddedWord.end = word.end;
    } else {
      newWords.push(word);
    }
  }

  return newWords.map((w) => {
    return {
      ...w,
      word: w.word.replaceAll(/``/g, ""),
    };
  });
};
