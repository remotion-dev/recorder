import React, { useContext } from "react";
import type { WhisperOutput } from "../types";

export type CaptionsContextType = {
  whisperOutput: WhisperOutput | null;
  setWhisperOutput: (word: WhisperOutput | null) => void;
};

const context = React.createContext<CaptionsContextType>({
  whisperOutput: null,
  setWhisperOutput: () => {
    throw new Error("React Context not initialized");
  },
});

export const useCaptions = (): WhisperOutput => {
  const ctx = useContext(context);

  if (!ctx.whisperOutput) {
    throw new Error("Should not render without a whisperOutput");
  }

  return ctx.whisperOutput;
};

export const CaptionsProvider: React.FC<{
  children: React.ReactNode;
  state: CaptionsContextType;
}> = ({ children, state }) => {
  return <context.Provider value={state}>{children}</context.Provider>;
};
