import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { Word } from "../sub-types";

const style: React.CSSProperties = {
  whiteSpace: "pre-wrap",
  display: "inline-block",
};
export const useTime = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  return time;
};

export const WordComp: React.FC<{
  word: Word;
}> = ({ word }) => {
  const time = useTime();

  const opacity = word.start <= time ? 1 : 0.3;

  return <div style={{ ...style, opacity }}>{word.word}</div>;
};
