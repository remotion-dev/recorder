import { loadFont } from "@remotion/google-fonts/Inter";
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import type {
  CanvasLayout,
  Dimensions,
  WebcamPosition,
} from "../configuration";
import type { Layout } from "../layout/get-layout";
import { borderRadius, safeSpace } from "../layout/get-layout";
import { getBottomSafeSpace } from "../layout/get-safe-space";
import type { Segment } from "../sub-types";
import { useTime, WordComp } from "./Word";

loadFont();

const getFontSize = (canvasLayout: CanvasLayout) => {
  if (canvasLayout === "square" || canvasLayout === "tall") {
    return 56;
  }

  return 40;
};

const getSubsLayout = ({
  canvasLayout,
  webcamLayout,
  webcamPosition,
  canvasSize,
  displayLayout,
}: {
  canvasLayout: CanvasLayout;
  webcamLayout: Layout;
  displayLayout: Layout | null;
  webcamPosition: WebcamPosition;
  canvasSize: Dimensions;
}): React.CSSProperties => {
  if (displayLayout === null) {
    return {
      height: getBottomSafeSpace("square") * 2,
      bottom: getBottomSafeSpace("square") * 3,
      // @ts-expect-error not yet available
      textWrap: "balance",
      textAlign: "center",
      paddingLeft: safeSpace(canvasLayout) * 2,
      paddingRight: safeSpace(canvasLayout) * 2,
      justifyContent: "center",
      alignItems: "center",
    };
  }

  if (canvasLayout === "wide") {
    return {
      height: getBottomSafeSpace(canvasLayout),
      // @ts-expect-error not yet available
      textWrap: "balance",
      textAlign: "center",
      paddingLeft: 40,
      paddingRight: 40,
      justifyContent: "center",
      alignItems: "center",
    };
  }

  return {
    height: webcamLayout.height,
    top: webcamLayout.y,
    left:
      webcamPosition === "bottom-left" || webcamPosition === "top-left"
        ? webcamLayout.width + safeSpace(canvasLayout) * 2
        : safeSpace(canvasLayout),
    width: canvasSize.width - webcamLayout.width - safeSpace(canvasLayout) * 3,
    paddingTop: safeSpace(canvasLayout),
  };
};

const inlineSubsLayout = (
  canvasLayout: CanvasLayout,
  displayLayout: Layout | null,
): React.CSSProperties => {
  if (displayLayout === null) {
    return {
      paddingLeft: 20,
      paddingRight: 20,
      borderRadius: borderRadius - safeSpace("tall") / 4,
    };
  }

  if (canvasLayout === "wide") {
    return { paddingLeft: 20, paddingRight: 20 };
  }

  return {};
};

export const SegmentComp: React.FC<{
  segment: Segment;
  isLast: boolean;
  trimStart: number;
  canvasLayout: CanvasLayout;
  webcamPosition: WebcamPosition;
  webcamLayout: Layout;
  canvasSize: Dimensions;
  displayLayout: Layout | null;
}> = ({
  segment,
  isLast,
  trimStart,
  canvasLayout,
  webcamLayout,
  webcamPosition,
  canvasSize,
  displayLayout,
}) => {
  const time = useTime(trimStart);

  if (time < segment.start) {
    return null;
  }

  if (time >= segment.end && !isLast) {
    return null;
  }

  const opacity = interpolate(
    time,
    [segment.start, segment.start + 0.2, segment.end - 0.1, segment.end],
    [0, 1, 1, 0],
  );

  return (
    <AbsoluteFill
      style={{
        top: "auto",
        fontSize: getFontSize(canvasLayout),
        display: "flex",
        lineHeight: 1.2,
        opacity,
        ...getSubsLayout({
          canvasLayout,
          webcamLayout,
          webcamPosition,
          canvasSize,
          displayLayout,
        }),
      }}
    >
      <div>
        <span
          style={{
            backgroundColor:
              displayLayout === null ? "rgba(0, 0, 0, 0.15)" : "white",
            lineHeight: 1.2,
            display: "inline-block",
            boxDecorationBreak: "clone",
            WebkitBoxDecorationBreak: "clone",
            backdropFilter: displayLayout === null ? "blur(5px)" : undefined,
            ...inlineSubsLayout(canvasLayout, displayLayout),
          }}
        >
          {segment.words.map((word, index) => {
            return (
              <WordComp
                key={word.start}
                isLast={index === segment.words.length - 1}
                trimStart={trimStart}
                word={word}
                displayLayout={displayLayout}
              />
            );
          })}
        </span>
      </div>
    </AbsoluteFill>
  );
};
