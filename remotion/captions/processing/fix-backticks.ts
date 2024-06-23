import type { Word } from "../../../config/autocorrect";

export const fixBackticks = (_words: Word[]): Word[] => {
  const newWords: Word[] = [];

  const words = _words.map((word) => {
    return {
      ...word,
      text: word.text.replaceAll(/`\s/g, " `"),
    };
  });

  for (let i = 0; i < words.length; i++) {
    const word = words[i] as Word;
    const previousWord = words[i - 1] ?? null;

    if (word.text.startsWith(". ")) {
      const lastAddedWord = newWords[newWords.length - 1] as Word;
      lastAddedWord.text += ".";
      word.text = word.text.slice(1);
    }

    if (!word.text.startsWith(" ") && previousWord) {
      const lastAddedWord = newWords[newWords.length - 1] as Word;
      lastAddedWord.text += word.text;
      lastAddedWord.lastTimestamp = word.lastTimestamp;
    } else {
      newWords.push(word);
    }
  }

  return newWords.map((w) => {
    return {
      ...w,
      text:
        // Remove double backticks: ` n``px`` rem``otion`` render`
        w.text.replaceAll(/``/g, ""),
    };
  });
};
