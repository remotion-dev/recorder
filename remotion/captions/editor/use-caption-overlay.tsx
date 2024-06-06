import React, { useContext, useMemo } from "react";
import type { Word } from "../../../config/autocorrect";

type CaptionOverlayContext = {
  open: Word | false;
  setOpen: React.Dispatch<React.SetStateAction<Word | false>>;
};

const context = React.createContext<CaptionOverlayContext>({
  open: false,
  setOpen: () => {
    throw new Error("React Context not initialized");
  },
});

export const useCaptionOverlay = (): {
  isOpen: Word | false;
  setOpen: React.Dispatch<React.SetStateAction<Word | false>>;
} => {
  const ctx = useContext(context);

  return useMemo(
    () => ({ isOpen: ctx.open, setOpen: ctx.setOpen }),
    [ctx.open, ctx.setOpen],
  );
};

export const CaptionOverlayProvider: React.FC<{
  children: React.ReactNode;
  state: CaptionOverlayContext;
}> = ({ children, state }) => {
  return <context.Provider value={state}>{children}</context.Provider>;
};
