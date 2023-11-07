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
import { useSequenceDuration, useTime, WordComp } from "./Word";

loadFont();

export type SubtitleType = "below-video" | "overlayed-center" | "boxed";

export const getSubtitlesType = ({
  canvasLayout,
  displayLayout,
}: {
  canvasLayout: CanvasLayout;
  displayLayout: Layout | null;
}): SubtitleType => {
  if (displayLayout === null) {
    if (canvasLayout === "square") {
      return "boxed";
    }

    return "overlayed-center";
  }

  if (canvasLayout === "square" || canvasLayout === "tall") {
    return "boxed";
  }

  return "below-video";
};

export const getSubtitlesFontSize = (
  subtitleType: SubtitleType,
  displayLayout: Layout | null,
) => {
  if (subtitleType === "boxed") {
    if (displayLayout === null) {
      return 64;
    }

    return 56;
  }

  if (subtitleType === "overlayed-center") {
    return 48;
  }

  return 40;
};

export const getSubtitlesLines = (subtitleType: SubtitleType) => {
  if (subtitleType === "boxed") {
    return 4;
  }

  return 2;
};

export const getSubsBox = ({
  subtitleType,
  canvasLayout,
  canvasSize,
  webcamLayout,
  webcamPosition,
  displayLayout,
}: {
  subtitleType: SubtitleType;
  canvasLayout: CanvasLayout;
  canvasSize: Dimensions;
  webcamLayout: Layout;
  webcamPosition: WebcamPosition;
  displayLayout: Layout | null;
}): Layout => {
  if (subtitleType === "overlayed-center") {
    const height = getBottomSafeSpace("square") * 2;
    return {
      height,
      y: canvasSize.height - getBottomSafeSpace("square") * 3 - height,
      borderRadius: 0,
      width: (canvasSize.width / 3) * 2,
      x: canvasSize.width / 6,
    };
  }

  if (canvasLayout === "wide") {
    const height = getBottomSafeSpace(canvasLayout);
    return {
      height,
      x: canvasSize.width / 6,
      y: canvasSize.height - height,
      width: (canvasSize.width / 3) * 2,
      borderRadius: 0,
    };
  }

  if (displayLayout === null) {
    const isTopAligned =
      webcamPosition === "top-left" || webcamPosition === "top-right";

    return {
      height: webcamLayout.height,
      y: isTopAligned
        ? webcamLayout.height + safeSpace(canvasLayout) * 2
        : safeSpace(canvasLayout),
      x: safeSpace(canvasLayout),
      width: canvasSize.width - safeSpace(canvasLayout) * 3,
      borderRadius: 0,
    };
  }

  return {
    height: webcamLayout.height,
    y: webcamLayout.y,
    x:
      webcamPosition === "bottom-left" || webcamPosition === "top-left"
        ? webcamLayout.width + safeSpace(canvasLayout) * 2
        : safeSpace(canvasLayout),
    width: canvasSize.width - webcamLayout.width - safeSpace(canvasLayout) * 3,
    borderRadius: 0,
  };
};

const getSubsLayout = ({
  canvasLayout,
  subsBox,
  subtitleType,
  displayLayout,
}: {
  canvasLayout: CanvasLayout;
  subsBox: Layout;
  subtitleType: SubtitleType;
  displayLayout: Layout | null;
}): React.CSSProperties => {
  if (subtitleType === "overlayed-center") {
    return {
      left: subsBox.x,
      top: subsBox.y,
      width: subsBox.width,
      height: subsBox.height,
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
    };
  }

  if (canvasLayout === "wide") {
    return {
      left: subsBox.x,
      top: subsBox.y,
      width: subsBox.width,
      height: subsBox.height,
      maxLines: 2,
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
    };
  }

  return {
    left: subsBox.x,
    top: subsBox.y,
    width: subsBox.width,
    height: subsBox.height,
    paddingTop: displayLayout === null ? 0 : safeSpace(canvasLayout),
  };
};

const inlineSubsLayout = ({
  canvasLayout,
  subtitleType,
}: {
  canvasLayout: CanvasLayout;
  subtitleType: SubtitleType;
}): React.CSSProperties => {
  if (subtitleType === "overlayed-center") {
    return {
      borderRadius: borderRadius - safeSpace("tall") / 4,
    };
  }

  if (canvasLayout === "wide") {
    return {};
  }

  return {};
};

export const SegmentComp: React.FC<{
  segment: Segment;
  isLast: boolean;
  trimStart: number;
  canvasLayout: CanvasLayout;
  subsBox: Layout;
  subtitleType: SubtitleType;
  displayLayout: Layout | null;
}> = ({
  segment,
  isLast,
  trimStart,
  canvasLayout,
  subsBox,
  subtitleType,
  displayLayout,
}) => {
  const time = useTime(trimStart);
  const duration = useSequenceDuration(trimStart);

  if (time < segment.start) {
    return null;
  }

  if (time >= segment.end && !isLast) {
    return null;
  }

  const end = isLast ? duration : segment.end;

  const fadeOutAt = end - 0.1;

  const start = Math.min(segment.start + 0.2, fadeOutAt - 0.000000001);

  const opacity = interpolate(
    time,
    [start - 0.2, Math.min(start), fadeOutAt, fadeOutAt + 0.1],
    [0, 1, 1, 0],
  );

  return (
    <AbsoluteFill
      style={{
        top: "auto",
        fontSize: getSubtitlesFontSize(subtitleType, displayLayout),
        display: "flex",
        lineHeight: 1.2,
        opacity,
        // @ts-expect-error
        textWrap: "balance",
        ...getSubsLayout({
          canvasLayout,
          subsBox,
          subtitleType,
          displayLayout,
        }),
      }}
    >
      <div>
        <span
          style={{
            textShadow:
              subtitleType === "overlayed-center"
                ? "0px 0px 30px rgba(0, 0, 0, 0.5)"
                : undefined,
            lineHeight: 1.2,
            display: "inline-block",
            boxDecorationBreak: "clone",
            WebkitBoxDecorationBreak: "clone",
            ...inlineSubsLayout({ canvasLayout, subtitleType }),
          }}
        >
          {segment.words.map((word, index) => {
            return (
              <WordComp
                // eslint-disable-next-line react/no-array-index-key
                key={word.start + word.word + index}
                isLast={index === segment.words.length - 1}
                trimStart={trimStart}
                word={word}
                subtitleLayout={subtitleType}
              />
            );
          })}
        </span>
      </div>
    </AbsoluteFill>
  );
};
