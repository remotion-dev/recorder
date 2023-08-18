import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import type { Segment } from "../sub-types";
import { useTime, WordComp } from "./Word";

const getFontSize = (height: number) => {
  if (height < 1000) {
    return 28;
  }

  return 36;
};

export const SegmentComp: React.FC<{
  segment: Segment;
  isLast: boolean;
  trimStart: number;
}> = ({ segment, isLast, trimStart }) => {
  const { height } = useVideoConfig();
  const time = useTime(trimStart);

  if (time < segment.start) {
    return null;
  }

  if (time > segment.end && !isLast) {
    return null;
  }

  return (
    <AbsoluteFill
      style={{
        top: "auto",
        height: "auto",
        textAlign: "center",
        fontSize: getFontSize(height),
        paddingBottom: 50,
        fontFamily: "GT Planar",
        fontWeight: 500,
        display: "block",
      }}
    >
      {segment.words.map((word) => {
        return <WordComp key={word.start} trimStart={trimStart} word={word} />;
      })}
    </AbsoluteFill>
  );
};
