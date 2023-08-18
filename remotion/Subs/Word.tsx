import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { Word } from "../sub-types";

const style: React.CSSProperties = {
  whiteSpace: "pre-wrap",
  display: "inline-block",
};
export const useTime = (trimStart: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = (frame + trimStart) / fps;

  return time;
};

export const WordComp: React.FC<{
  word: Word;
  trimStart: number;
}> = ({ word, trimStart }) => {
  const time = useTime(trimStart);

  const opacity = word.start <= time ? 1 : 0.3;

  const monospace =
    word.word.trimStart().startsWith("`") && word.word.endsWith("`");

  const withoutBackticks = word.word.replace(/`/g, "");

  return (
    <div
      style={{
        ...style,
        opacity,
        color: monospace ? "#0b84f3" : "black",
        fontWeight: monospace ? 400 : 500,
      }}
    >
      {withoutBackticks}
    </div>
  );
};
