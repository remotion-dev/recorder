export type Word = {
  word: string;
  firstTimestamp: number;
  lastTimestamp: number | null;
  monospace?: boolean;
};

const autocorrectWord = (word: Word): Word => {
  // Replace a single word with another one
  if (word.word === " github") {
    return {
      ...word,
      word: word.word.replace("github", " GitHub"),
    };
  }

  // Replace a pattern with a specific word
  if (word.word.match(/ remotion\.$/)) {
    return {
      ...word,
      word: word.word.replace(/ remotion.$/, " Remotion."),
    };
  }
  // Add your own function to remap specific words.

  return word;
};

export const autocorrectWords = (words: Word[]): Word[] => {
  return words.map(autocorrectWord);
};
