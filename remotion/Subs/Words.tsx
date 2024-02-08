import React from "react";
import type { Theme } from "../configuration";
import type { Segment, Word } from "../sub-types";
import { WordComp } from "./Word";

export const Words: React.FC<{
  segment: Segment;
  trimStart: number;
  theme: Theme;
  onOpenSubEditor: (word: Word) => void;
  startFrame: number;
}> = ({ onOpenSubEditor, segment, startFrame, theme, trimStart }) => {
  return (
    <>
      {segment.words.map((word, index) => {
        return (
          <WordComp
            // eslint-disable-next-line react/no-array-index-key
            key={word.start + word.word + index}
            isLast={index === segment.words.length - 1}
            trimStart={trimStart}
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
