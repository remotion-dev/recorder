import type { WhisperWord } from "../types";

const removeBlankSubTokens = (
  token: WhisperWord["tokens"],
): WhisperWord["tokens"] => {
  return token.filter((t) => !t.text.match(/_TT_/));
};

export const removeBlankTokens = (tokens: WhisperWord[]): WhisperWord[] => {
  return tokens
    .filter((t) => t.text.trim() !== "")
    .filter((t) => {
      return !t.text.match(/TT_(\d+)/);
    })
    .map((t) => {
      return {
        ...t,
        tokens: removeBlankSubTokens(t.tokens),
      };
    });
};
