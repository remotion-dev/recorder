import React from "react";
import { AbsoluteFill } from "remotion";
import type { Segment } from "../sub-types";
import { useTime, WordComp } from "./Word";

export const SegmentComp: React.FC<{
  segment: Segment;
  isLast: boolean;
}> = ({ segment, isLast }) => {
  const time = useTime();

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
        fontSize: 28,
        paddingBottom: 50,
        fontFamily: "GT Planar",
        fontWeight: 500,
        display: "block",
      }}
    >
      {segment.words.map((word) => {
        return <WordComp key={word.start} word={word} />;
      })}
    </AbsoluteFill>
  );
};
