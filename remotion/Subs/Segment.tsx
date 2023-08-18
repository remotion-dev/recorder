import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import type { Segment } from "../sub-types";
import { useTime, WordComp } from "./Word";

const getFontSize = (height: number) => {
  if (height < 1000) {
    return 36;
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
        textAlign: "center",
        fontSize: getFontSize(height),
        fontFamily: "GT Planar",
        fontWeight: 500,
        display: "flex",
        // @ts-expect-error not yet available
        textWrap: "balance",
        lineHeight: 1.1,
        height: 100,
        bottom: 20,
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 50,
        paddingRight: 50,
      }}
    >
      <div>
        {segment.words.map((word) => {
          return (
            <WordComp key={word.start} trimStart={trimStart} word={word} />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
