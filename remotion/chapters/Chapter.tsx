import React, { useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { ChapterType } from "./generate";

const CHAPTER_HEIGHT = 80;
const CHAPTER_VERTICAL_MARGIN = 4;

export const WideLayoutChapter: React.FC<{
  chapter: ChapterType;
  activeIndex: number;
  slideHighlight: boolean;
  slideY: boolean;
  fadeOut: boolean;
  fadeIn: boolean;
}> = ({ chapter, activeIndex, slideY, slideHighlight, fadeOut, fadeIn }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const isPrevious = chapter.index === activeIndex - 1;
  const isCurrent = chapter.index === activeIndex;

  const animation = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 10,
    delay: 10,
  });

  const slide = slideHighlight ? animation : 1;
  const translateY = slideY
    ? interpolate(
        animation,
        [0, 1],
        [CHAPTER_HEIGHT + CHAPTER_VERTICAL_MARGIN * 2, 0]
      )
    : 0;

  const wipePercentage = interpolate(slide, [0, 1], [0, 100]);
  const previousMaskImage = `linear-gradient(to bottom, transparent ${wipePercentage}%, black ${wipePercentage}%)`;
  const maskImage = `linear-gradient(to bottom, black ${wipePercentage}%, transparent ${wipePercentage}%)`;

  const textStyle: React.CSSProperties = useMemo(() => {
    return {
      padding: "0px 20px",
      fontSize: 36,
      fontFamily: "GT Planar",
      fontWeight: "500",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      right: 0,
    };
  }, []);

  const opacity = useMemo(() => {
    if (fadeOut) {
      return interpolate(
        frame,
        [durationInFrames - 5, durationInFrames],
        [1, 0]
      );
    }

    if (fadeIn) {
      return interpolate(frame, [0, 5], [0, 1]);
    }

    return 1;
  }, [durationInFrames, fadeIn, fadeOut, frame]);

  return (
    <div
      style={{
        display: "inline-flex",
        borderRadius: 20,
        border: "5px solid black",
        marginTop: CHAPTER_VERTICAL_MARGIN,
        marginBottom: CHAPTER_VERTICAL_MARGIN,
        overflow: "hidden",
        height: CHAPTER_HEIGHT,
        justifyContent: "center",
        alignItems: "center",
        transform: `translateY(${translateY}px)`,
        opacity,
      }}
    >
      <div
        style={{
          backgroundColor: "black",
          color: "white",
          padding: "12px 0px",
          fontSize: 32,
          fontFamily: "GT Planar",
          width: 65,
          textAlign: "center",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        {chapter.index + 1}
      </div>
      <div
        style={{
          ...textStyle,
          backgroundColor: "white",
          padding: "0px 20px",
          color: "black",
        }}
      >
        {chapter.title}
      </div>
      {isCurrent ? (
        <div
          style={{
            ...textStyle,
            backgroundColor: "#0b84f3",
            color: "white",
            WebkitMaskImage: maskImage,
            maskImage,
            position: "absolute",
          }}
        >
          {chapter.title}
        </div>
      ) : null}
      {isPrevious ? (
        <div
          style={{
            ...textStyle,
            backgroundColor: "#0b84f3",
            color: "white",
            WebkitMaskImage: previousMaskImage,
            maskImage: previousMaskImage,
            position: "absolute",
          }}
        >
          {chapter.title}
        </div>
      ) : null}
    </div>
  );
};
