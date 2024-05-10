import type { Token } from "../types";

export const filterOutEmptyTokens = (tokens: Token[]) => {
  return tokens.filter((t) => !(t.t_dtw === -1 && t.offsets.from !== 0));
};
