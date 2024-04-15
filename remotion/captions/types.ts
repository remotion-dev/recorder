import type { Word } from "../../config/autocorrect";

type Token = {
  t_dtw: number;
  offsets: {
    from: number;
    end: number;
  };
};

export type WhisperWord = {
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
    return token.offsets.from;
  }

  return token.t_dtw * 10;
};

const filterOutEmptyTokens = (tokens: Token[]) => {
  return tokens.filter((t) => !(t.t_dtw === -1 && t.offsets.from !== 0));
};

export const whisperWordToWord = (
  word: WhisperWord,
  nextWord: WhisperWord | null,
): Word => {
  const noneEmptyTokens = word.tokens;
  const firstTimestamp = getTokenToTimestamp(noneEmptyTokens[0]) as number;

  return {
    text: word.text,
    firstTimestamp,
    lastTimestamp:
      getTokenToTimestamp(filterOutEmptyTokens(nextWord?.tokens ?? [])[0]) ??
      (getTokenToTimestamp(word.tokens[word.tokens.length - 1]) as number),
  };
};
