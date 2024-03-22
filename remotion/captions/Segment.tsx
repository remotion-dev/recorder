import React from "react";
import { Sequence, useVideoConfig } from "remotion";
import type { CanvasLayout, Dimensions } from "../../config/layout";
import type {} from "../../config/scenes";
import type { Theme } from "../../config/themes";
import type { Layout } from "../layout/layout-types";
import { FadeSentence } from "./FadeSentence";
import type { Segment, Word } from "./types";
import { BelowVideoSubtitles } from "./Variants/BelowVideoSubtitles";
import { BoxedSubtitles } from "./Variants/BoxedSubtitles";
import { OverlayedCenterSubtitles } from "./Variants/OverlayedCenterSubtitles";

const getStartOfSegment = (segment: Segment) => {
  if (segment.words.length === 0) {
    return 0;
  }

  return (segment.words[0] as Word).start;
};

const getEndOfSegment = (segment: Segment) => {
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
  displayLayout: Dimensions | null;
}): SubtitleType => {
  if (displayLayout === null) {
    if (canvasLayout === "square") {
      return "boxed";
    }

    return "overlayed-center";
  }

  if (canvasLayout === "square") {
    return "boxed";
  }

  return "below-video";
};

export const getSubtitlesFontSize = (
  subtitleType: SubtitleType,
  displayLayout: Dimensions | null,
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

export const getBorderWidthForSubtitles = (subtitleType: SubtitleType) => {
  if (subtitleType === "boxed") {
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
  displayLayout: Layout | null;
  theme: Theme;
  onOpenSubEditor: (word: Word) => void;
}> = ({
  segment,
  trimStart,
  canvasLayout,
  subtitleType,
  displayLayout,
  isFirst,
  isLast,
  theme,
  onOpenSubEditor,
}) => {
  const { fps } = useVideoConfig();

  const normalStartFrame = (getStartOfSegment(segment) / 1000) * fps;

  // If first caption of a segment, show it a bit earlier to avoid flicker
  // of caption showing only shortly after the video
  const startFrame = isFirst ? normalStartFrame - fps : normalStartFrame;
  const normalEndFrame = (getEndOfSegment(segment) / 1000) * fps;
  const endFrame = isLast ? normalEndFrame + fps : normalEndFrame;

  return (
    <Sequence
      showInTimeline={false}
      from={startFrame - trimStart}
      durationInFrames={endFrame - startFrame}
      layout="none"
    >
      <FadeSentence>
        {subtitleType === "boxed" ? (
          <BoxedSubtitles
            canvasLayout={canvasLayout}
            displayLayout={displayLayout}
            onOpenSubEditor={onOpenSubEditor}
            segment={segment}
            startFrame={startFrame}
            theme={theme}
          />
        ) : subtitleType === "below-video" ? (
          <BelowVideoSubtitles
            canvasLayout={canvasLayout}
            displayLayout={displayLayout}
            onOpenSubEditor={onOpenSubEditor}
            segment={segment}
            startFrame={startFrame}
            theme={theme}
          />
        ) : (
          <OverlayedCenterSubtitles
            canvasLayout={canvasLayout}
            onOpenSubEditor={onOpenSubEditor}
            segment={segment}
            startFrame={startFrame}
            theme={theme}
          />
        )}
      </FadeSentence>
    </Sequence>
  );
};
