import React from "react";
import type { Word } from "../../config/autocorrect";
import type { Theme } from "../../config/themes";
import type { Segment } from "./types";
import { WordComp } from "./Word";

export const Words: React.FC<{
  segment: Segment;
  theme: Theme;
  onOpenSubEditor: (word: Word) => void;
  startFrame: number;
}> = ({ onOpenSubEditor, segment, startFrame, theme }) => {
  return (
    <>
      {segment.words.map((word, index) => {
        return (
          <WordComp
            // eslint-disable-next-line react/no-array-index-key
            key={word.firstTimestamp + word.text + index}
            isLast={index === segment.words.length - 1}
            word={word}
            theme={theme}
            onOpenSubEditor={onOpenSubEditor}
            startFrame={startFrame}
          />
        );
      })}
    </>
  );
};
