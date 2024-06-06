import React, { useContext } from "react";
import type { WhisperCppOutput } from "../types";

export type CaptionsContextType = {
  whisperOutput: WhisperCppOutput | null;
  setWhisperOutput: (word: WhisperCppOutput | null) => void;
};

const context = React.createContext<CaptionsContextType>({
  whisperOutput: null,
  setWhisperOutput: () => {
    throw new Error("React Context not initialized");
  },
});

export const useCaptions = (): WhisperCppOutput => {
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
