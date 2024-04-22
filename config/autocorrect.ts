export type Word = {
  text: string;
  firstTimestamp: number;
  lastTimestamp: number | null;
  monospace?: boolean;
};

const autocorrectWord = (word: Word): Word => {
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

export const autocorrectWords = (words: Word[]): Word[] => {
  return words.map(autocorrectWord);
};
