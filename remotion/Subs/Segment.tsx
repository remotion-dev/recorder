import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import type { Segment } from "../sub-types";
import { useTime, WordComp } from "./Word";
import { loadFont } from "@remotion/google-fonts/Inter";
import { getBottomSafeSpace } from "../layout/get-safe-space";
import type { CanvasSize } from "../configuration";

loadFont();

const getFontSize = (height: number) => {
  if (height < 1000) {
    return 40;
  }

  return 40;
};

export const SegmentComp: React.FC<{
  segment: Segment;
  isLast: boolean;
  trimStart: number;
  canvasSize: CanvasSize;
}> = ({ segment, isLast, trimStart, canvasSize }) => {
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
        display: "flex",
        // @ts-expect-error not yet available
        textWrap: "balance",
        height: getBottomSafeSpace(canvasSize),
        lineHeight: 1.2,
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 40,
        paddingRight: 40,
      }}
    >
      <div
        style={{
          display: "inline",
        }}
      >
        <span
          style={{
            background: "white",
            lineHeight: 1,
            display: "inline",
            boxDecorationBreak: "clone",
            WebkitBoxDecorationBreak: "clone",
            paddingLeft: 20,
            paddingRight: 20,
            borderRadius: 5,
          }}
        >
          {segment.words.map((word) => {
            return (
              <WordComp key={word.start} trimStart={trimStart} word={word} />
            );
          })}
        </span>
      </div>
    </AbsoluteFill>
  );
};
