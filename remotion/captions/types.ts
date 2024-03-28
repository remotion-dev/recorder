import type { Word } from "../../config/autocorrect";

type Token = {
  t_dtw: number;
};

export type WhisperWord = {
  offsets: {
    from: number;
    to: number;
  };
  tokens: Token[];
  text: string;
};

export type WhisperOutput = {
  transcription: WhisperWord[];
  result: {
    language: string;
  };
};

export type SubTypes = {
  segments: Segment[];
};

export type Segment = {
  words: Word[];
};

const getTokenToTimestamp = (token: Token | undefined): number | null => {
  if (!token) {
    return null;
  }

  if (token.t_dtw === -1) {
    return null;
  }

  return token.t_dtw * 10;
};

const filterOutEmptyTokens = (tokens: Token[]) => {
  return tokens.filter((t) => t.t_dtw !== -1);
};

export const whisperWordToWord = (
  word: WhisperWord,
  nextWord: WhisperWord | null,
): Word => {
  return {
    word: word.text,
    firstTimestamp: getTokenToTimestamp(
      filterOutEmptyTokens(word.tokens)[0],
    ) as number,
    lastTimestamp:
      getTokenToTimestamp(filterOutEmptyTokens(nextWord?.tokens ?? [])[0]) ??
      (getTokenToTimestamp(word.tokens[word.tokens.length - 1]) as number),
  };
};
