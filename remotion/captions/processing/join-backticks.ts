import { Word } from "../../../config/autocorrect";

export const joinBackticks = (words: Word[]): Word[] => {
  const newWords: Word[] = [];
  for (let i = 0; i < words.length; i++) {
    const previousWord = newWords[i - 1] ?? null;
    const newWord = words[i] as Word;

    const previousWordEndsInMonospace = previousWord?.text.endsWith("`");

    if (previousWord && previousWordEndsInMonospace) {
      if (newWord.text.startsWith("`")) {
        previousWord.text = previousWord.text.substring(
          0,
          previousWord.text.length - 1,
        );
        newWord.text = newWord.text.slice(1);
      }

      if (newWord.text.startsWith(" `")) {
        previousWord.text = previousWord.text.substring(
          0,
          previousWord.text.length - 1,
        );
        newWord.text = " " + newWord.text.slice(2);
      }
    }

    newWords.push(newWord);
  }

  return newWords;
};
