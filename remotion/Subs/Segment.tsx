import { loadFont } from "@remotion/google-fonts/Inter";
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { COLORS } from "../colors";
import type {
  CanvasLayout,
  Dimensions,
  Theme,
  WebcamPosition,
} from "../configuration";
import type { Layout } from "../layout/get-layout";
import { borderRadius, safeSpace } from "../layout/get-layout";
import { getBottomSafeSpace } from "../layout/get-safe-space";
import type { Segment, Word } from "../sub-types";
import { getHorizontalPaddingForSubtitles } from "./postprocess-subs";
import {
  useSequenceDuration,
  useTime,
  WordComp,
  WORD_HIGHLIGHT_BORDER_RADIUS,
} from "./Word";

loadFont();

export const getStartOfSegment = (segment: Segment) => {
  if (segment.words.length === 0) {
    return 0;
  }

  return (segment.words[0] as Word).start;
};

export const getEndOfSegment = (segment: Segment) => {
  if (segment.words.length === 0) {
    return 0;
  }

  return (segment.words[segment.words.length - 1] as Word).end;
};

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

  if (canvasLayout === "square" || canvasLayout === "portrait") {
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
    return 56;
  }

  return 48;
};

export const getSubtitlesLines = (subtitleType: SubtitleType) => {
  if (subtitleType === "boxed") {
    return 4;
  }

  return 1;
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
      opacity: 1,
    };
  }

  if (canvasLayout === "landscape") {
    const height = getBottomSafeSpace(canvasLayout);
    return {
      height,
      x: canvasSize.width / 6,
      y: canvasSize.height - height,
      width: (canvasSize.width / 3) * 2,
      borderRadius: 0,
      opacity: 1,
    };
  }

  if (displayLayout === null) {
    const isTopAligned =
      webcamPosition === "top-left" || webcamPosition === "top-right";

    return {
      height:
        canvasSize.height - webcamLayout.height - safeSpace(canvasLayout) * 3,
      y: isTopAligned
        ? webcamLayout.height + safeSpace(canvasLayout) * 2
        : safeSpace(canvasLayout),
      x: safeSpace(canvasLayout),
      width: canvasSize.width - safeSpace(canvasLayout) * 2,
      borderRadius,
      opacity: 1,
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
    borderRadius,
    opacity: 1,
  };
};

const getSubsLayout = ({
  canvasLayout,
  subtitleType,
}: {
  canvasLayout: CanvasLayout;
  subtitleType: SubtitleType;
}): React.CSSProperties => {
  if (subtitleType === "overlayed-center") {
    return {
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
    };
  }

  if (canvasLayout === "landscape") {
    return {
      maxLines: 2,
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
    };
  }

  return {
    justifyContent: "center",
  };
};

const inlineSubsLayout = ({
  subtitleType,
  canvasLayout,
}: {
  subtitleType: SubtitleType;
  canvasLayout: CanvasLayout;
}): React.CSSProperties => {
  const padding = getHorizontalPaddingForSubtitles(subtitleType, canvasLayout);

  if (subtitleType === "overlayed-center") {
    return {
      paddingLeft: padding,
      paddingRight: padding,
      paddingTop: padding,
      paddingBottom: padding,
      borderRadius: WORD_HIGHLIGHT_BORDER_RADIUS + padding,
    };
  }

  return {
    paddingLeft: padding,
    paddingRight: padding,
  };
};

const LINE_HEIGHT = 1.2;

const getOpacity = ({
  segment,
  time,
  isLast,
  duration,
  isFirst,
}: {
  segment: Segment;
  time: number;
  isLast: boolean;
  isFirst: boolean;
  duration: number;
}) => {
  const end = isLast ? duration : getEndOfSegment(segment);

  const start = Math.min(
    getStartOfSegment(segment) + 0.2,
    end - 0.1 - 0.000000001,
  );

  const fadeIn = interpolate(time, [start - 0.2, start], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (isLast) {
    return fadeIn;
  }

  const fadeOut = interpolate(time, [end - 0.1, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (isFirst) {
    return 1 - fadeOut;
  }

  return fadeIn - fadeOut;
};

export const getBorderWidthForSubtitles = (subtitleType: SubtitleType) => {
  if (subtitleType === "boxed") {
    return 3;
  }

  return 0;
};

export const SegmentComp: React.FC<{
  segment: Segment;
  isLast: boolean;
  isFirst: boolean;
  trimStart: number;
  canvasLayout: CanvasLayout;
  subsBox: Layout;
  subtitleType: SubtitleType;
  displayLayout: Layout | null;
  theme: Theme;
}> = ({
  segment,
  isLast,
  trimStart,
  canvasLayout,
  subsBox,
  subtitleType,
  displayLayout,
  isFirst,
  theme,
}) => {
  const time = useTime(trimStart);
  const duration = useSequenceDuration(trimStart);

  const opacity =
    getOpacity({ duration, isLast, segment, time, isFirst }) * subsBox.opacity;

  const outer: React.CSSProperties = {
    fontSize: getSubtitlesFontSize(subtitleType, displayLayout),
    display: "flex",
    lineHeight: LINE_HEIGHT,
    border: `${getBorderWidthForSubtitles(subtitleType)}px solid ${
      COLORS[theme].BORDER_COLOR
    }`,
    backgroundColor:
      subtitleType === "boxed" ? COLORS[theme].SUBTITLES_BACKGROUND : undefined,
    left: subsBox.x,
    top: subsBox.y,
    width: subsBox.width,
    height: subsBox.height,
    borderRadius: subsBox.borderRadius,
    opacity: subtitleType === "boxed" ? 1 : opacity,
    ...getSubsLayout({
      canvasLayout,
      subtitleType,
    }),
  };

  if (time < getStartOfSegment(segment)) {
    return null;
  }

  if (time >= getEndOfSegment(segment) && !isLast) {
    return <AbsoluteFill style={outer} />;
  }

  return (
    <AbsoluteFill style={outer}>
      <div
        style={{
          height:
            getSubtitlesLines(subtitleType) *
            getSubtitlesFontSize(subtitleType, displayLayout) *
            LINE_HEIGHT,
          marginTop: subtitleType === "boxed" ? -5 : 0,
          opacity: subtitleType === "boxed" ? opacity : 1,
        }}
      >
        <span
          style={{
            lineHeight: LINE_HEIGHT,
            display: "inline-block",
            boxDecorationBreak: "clone",
            WebkitBoxDecorationBreak: "clone",
            backgroundColor:
              subtitleType === "overlayed-center"
                ? COLORS[theme].SUBTITLES_BACKGROUND
                : undefined,
            ...inlineSubsLayout({ subtitleType, canvasLayout }),
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
                theme={theme}
              />
            );
          })}
        </span>
      </div>
    </AbsoluteFill>
  );
};
