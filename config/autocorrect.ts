import { Caption } from "@remotion/captions";

const autocorrectWord = (word: Caption): Caption => {
  // Replace a single word with another one
  if (word.text === " github") {
    return {
      ...word,
      text: word.text.replace("github", " GitHub"),
    };
  }

  // Replace a pattern with a specific word
  if (word.text.match(/ remotion\.$/)) {
    return {
      ...word,
      text: word.text.replace(/ remotion.$/, " Remotion."),
    };
  }
  // Add your own function to remap specific words.

  return word;
};

export const autocorrectWords = (words: Caption[]): Caption[] => {
  return words.map(autocorrectWord);
};
