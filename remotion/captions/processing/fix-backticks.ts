import { Caption } from "@remotion/captions";

export const fixBackticks = (_words: Caption[]): Caption[] => {
  const newWords: Caption[] = [];

  const words = _words.map((word) => {
    return {
      ...word,
      text: word.text.replaceAll(/`\s/g, " `"),
    };
  });

  for (let i = 0; i < words.length; i++) {
    const word = words[i] as Caption;
    const previousWord = words[i - 1] ?? null;

    if (word.text.startsWith(". ")) {
      const lastAddedWord = newWords[newWords.length - 1] as Caption;
      lastAddedWord.text += ".";
      word.text = word.text.slice(1);
    }

    if (!word.text.startsWith(" ") && previousWord) {
      const lastAddedWord = newWords[newWords.length - 1] as Caption;
      lastAddedWord.text += word.text;
      lastAddedWord.endMs = word.endMs;
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
