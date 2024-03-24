export type Word = {
  word: string;
  start: number;
  end: number;
  monospace?: boolean;
};

export const autocorrectWord = (word: Word): Word => {
  if (word.word === " github") {
    return {
      ...word,
      word: " GitHub",
    };
  }

  if (word.word === " BUN") {
    return {
      ...word,
      word: " Bun",
    };
  }

  if (word.word === " javascript") {
    return {
      ...word,
      word: " JavaScript",
    };
  }

  if (word.word.includes(" Algorra")) {
    return {
      ...word,
      word: word.word.replace(" Algorra", " Algora"),
    };
  }

  if (word.word.match(/ remotion\.$/)) {
    return {
      ...word,
      word: word.word.replace(/ remotion.$/, " Remotion."),
    };
  }

  return {
    ...word,
    word: word.word
      .replace(" ReMotion", " Remotion")
      .replace(" Monorepo", " monorepo")
      .replace(" rust.", " Rust."),
  };
};
