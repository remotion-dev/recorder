import React from "react";
import { AbsoluteFill } from "remotion";
import type { Segment } from "../sub-types";
import { useTime, WordComp } from "./Word";
import { loadFont } from "@remotion/google-fonts/Inter";
import { getBottomSafeSpace } from "../layout/get-safe-space";
import type {
  CanvasLayout,
  Dimensions,
  WebcamPosition,
} from "../configuration";
import type { Layout } from "../layout/get-layout";
import { tallLayoutVerticalSafeSpace } from "../layout/get-layout";
import { safeSpace } from "../layout/get-layout";

loadFont();

const getFontSize = (canvasLayout: CanvasLayout) => {
  if (canvasLayout === "square") {
    return 46;
  }

  if (canvasLayout === "tall") {
    return 70;
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

  if (canvasLayout === "square") {
    return {
      height: webcamLayout.height,
      top: webcamLayout.y,
      left:
        webcamPosition === "bottom-left" || webcamPosition === "top-left"
          ? webcamLayout.width + safeSpace * 2
          : safeSpace,
      width: canvasSize.width - webcamLayout.width - safeSpace * 3,
      justifyContent: "center",
    };
  }

  const remainingHeight =
    canvasSize.height -
    (webcamLayout.height +
      (displayLayout?.height ?? 0) +
      safeSpace * 2 +
      tallLayoutVerticalSafeSpace * 2);

  return {
    height: remainingHeight,
    top:
      (displayLayout?.height ?? 0) +
      safeSpace +
      Number(tallLayoutVerticalSafeSpace),
    justifyContent: "center",
  };
};

const inlineSubsLayout = (canvasLayout: CanvasLayout): React.CSSProperties => {
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

  if (time > segment.end && !isLast) {
    return null;
  }

  return (
    <AbsoluteFill
      style={{
        top: "auto",
        fontSize: getFontSize(canvasLayout),
        display: "flex",
        lineHeight: 1.2,
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
            backgroundColor: "white",
            lineHeight: 1,
            display: "inline-block",
            boxDecorationBreak: "clone",
            WebkitBoxDecorationBreak: "clone",
            borderRadius: 5,
            ...inlineSubsLayout(canvasLayout),
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
