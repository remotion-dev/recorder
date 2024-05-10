import React from "react";
import type { Theme } from "../../config/themes";
import type { Segment } from "./types";
import { WordComp } from "./Word";

export const Words: React.FC<{
  segment: Segment;
  theme: Theme;
  startFrame: number;
}> = ({ segment, startFrame, theme }) => {
  return (
    <>
      {segment.words.map((word, index) => {
        return (
          <WordComp
            key={word.firstTimestamp + word.text + index}
            isLast={index === segment.words.length - 1}
            word={word}
            theme={theme}
            startFrame={startFrame}
          />
        );
      })}
    </>
  );
};
