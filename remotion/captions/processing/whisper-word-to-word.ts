import type { Word } from "../../../config/autocorrect";
import type { WhisperWord } from "../types";
import { filterOutEmptyTokens } from "./filter-out-empty-tokens";
import { getTokenToTimestamp } from "./get-timestamp-from-token";

export const whisperWordToWord = (
  word: WhisperWord,
  nextWord: WhisperWord | null,
): Word => {
  const noneEmptyTokens = word.tokens;
  const firstTimestamp = getTokenToTimestamp(noneEmptyTokens[0]) as number;

  const nextWordTokens = filterOutEmptyTokens(nextWord?.tokens ?? []);
  const currentWordTokens = filterOutEmptyTokens(word.tokens);

  const atMostLastTimestamp = getTokenToTimestamp(
    currentWordTokens[currentWordTokens.length - 1],
  );

  const wordForLastTimestamp =
    nextWordTokens[0] ?? currentWordTokens[currentWordTokens.length - 1];

  const lastTimestamp = getTokenToTimestamp(wordForLastTimestamp);

  return {
    text: word.text,
    firstTimestamp,
    lastTimestamp: lastTimestamp
      ? Math.min(
          atMostLastTimestamp ? atMostLastTimestamp + 500 : Infinity,
          lastTimestamp,
        )
      : null,
  };
};
