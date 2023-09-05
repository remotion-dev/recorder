import React, { useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { ChapterType } from "./generate";

const CHAPTER_HEIGHT = 80;
const CHAPTER_VERTICAL_MARGIN = 4;

export const Chapter: React.FC<{
  chapter: ChapterType;
  activeIndex: number;
}> = ({ chapter, activeIndex }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isPrevious = chapter.index === activeIndex - 1;
  const isCurrent = chapter.index === activeIndex;

  const animateIn =
    activeIndex === 0
      ? 1
      : spring({
          frame,
          fps,
          config: { damping: 200 },
          durationInFrames: 10,
          delay: 10,
        });

  const translateY = interpolate(
    animateIn,
    [0, 1],
    [CHAPTER_HEIGHT + CHAPTER_VERTICAL_MARGIN * 2, 0]
  );

  const wipePercentage = interpolate(animateIn, [0, 1], [0, 100]);
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
