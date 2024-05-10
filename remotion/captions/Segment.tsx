import React from "react";
import { Sequence, useVideoConfig } from "remotion";
import type { Word } from "../../config/autocorrect";
import type { CanvasLayout, Dimensions } from "../../config/layout";
import type { Theme } from "../../config/themes";
import { FadeSentence } from "./FadeSentence";
import type { Segment } from "./types";
import { BelowVideoSubtitles } from "./Variants/BelowVideoSubtitles";
import { OverlayedCenterSubtitles } from "./Variants/OverlayedCenterSubtitles";
import { LINE_HEIGHT, SquareSubtitles } from "./Variants/SquareSubtitles";

const getStartOfSegment = (segment: Segment) => {
  if (segment.words.length === 0) {
    return 0;
  }

  return (segment.words[0] as Word).firstTimestamp;
};

const getEndOfSegment = (segment: Segment) => {
  if (segment.words.length === 0) {
    return 0;
  }

  return (segment.words[segment.words.length - 1] as Word).lastTimestamp;
};

export type SubtitleType = "below-video" | "overlayed-center" | "square";

export const getSubtitlesType = ({
  canvasLayout,
  displayLayout,
}: {
  canvasLayout: CanvasLayout;
  displayLayout: Dimensions | null;
}): SubtitleType => {
  if (displayLayout === null) {
    if (canvasLayout === "square") {
      return "square";
    }

    return "overlayed-center";
  }

  if (canvasLayout === "square") {
    return "square";
  }

  return "below-video";
};

export const getSubtitlesFontSize = (
  subtitleType: SubtitleType,
  displayLayout: Dimensions | null,
) => {
  if (subtitleType === "square") {
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

export const getSubtitlesLines = ({
  subtitleType,
  boxHeight,
  fontSize,
}: {
  subtitleType: SubtitleType;
  boxHeight: number;
  fontSize: number;
}) => {
  if (subtitleType === "square") {
    const boxPadding = 50;

    const nrOfLines = Math.floor(
      (boxHeight - boxPadding) / (fontSize * LINE_HEIGHT),
    );
    return nrOfLines;
  }

  return 1;
};

export const getSubsAlign = ({
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
      maxLines: 1,
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
    };
  }

  return {
    justifyContent: "center",
  };
};

export const getBorderWidthForSubtitles = (subtitleType: SubtitleType) => {
  if (subtitleType === "square") {
    return 3;
  }

  return 0;
};

export const CaptionSentence: React.FC<{
  segment: Segment;
  isFirst: boolean;
  isLast: boolean;
  trimStart: number;
  canvasLayout: CanvasLayout;
  subtitleType: SubtitleType;
  theme: Theme;
  fontSize: number;
  lines: number;
}> = ({
  segment,
  trimStart,
  canvasLayout,
  subtitleType,
  isFirst,
  isLast,
  theme,
  fontSize,
  lines,
}) => {
  const { fps } = useVideoConfig();
  const normalStartFrame = (getStartOfSegment(segment) / 1000) * fps;
  // If first caption of a segment, show it a bit earlier to avoid flicker
  // of caption showing only shortly after the video
  const startFrame = isFirst ? normalStartFrame - fps : normalStartFrame;
  const endSegment = getEndOfSegment(segment);
  const normalEndFrame = endSegment === null ? null : (endSegment / 1000) * fps;
  const endFrame =
    normalEndFrame === null
      ? null
      : isLast
        ? normalEndFrame + fps
        : normalEndFrame;

  return (
    <Sequence
      showInTimeline={false}
      from={startFrame - trimStart}
      durationInFrames={endFrame === null ? undefined : endFrame - startFrame}
      layout="none"
    >
      <FadeSentence>
        {subtitleType === "square" ? (
          <SquareSubtitles
            canvasLayout={canvasLayout}
            segment={segment}
            startFrame={startFrame}
            theme={theme}
            fontSize={fontSize}
            lines={lines}
          />
        ) : subtitleType === "below-video" ? (
          <BelowVideoSubtitles
            canvasLayout={canvasLayout}
            segment={segment}
            startFrame={startFrame}
            theme={theme}
            fontSize={fontSize}
            lines={lines}
          />
        ) : (
          <OverlayedCenterSubtitles
            canvasLayout={canvasLayout}
            segment={segment}
            startFrame={startFrame}
          />
        )}
      </FadeSentence>
    </Sequence>
  );
};
