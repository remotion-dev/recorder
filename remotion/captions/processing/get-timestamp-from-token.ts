import type { Token } from "../types";

export const getTokenToTimestamp = (
  token: Token | undefined,
): number | null => {
  if (!token) {
    return null;
  }

  if (token.t_dtw === -1) {
    return token.offsets.from;
  }

  return token.t_dtw * 10;
};
