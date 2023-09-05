import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { ChapterType } from "./generate";

const CHAPTER_HEIGHT = 80;
const CHAPTER_VERTICAL_MARGIN = 4;

export const Chapter: React.FC<{
  chapter: ChapterType;
  startFrom: number;
  activeIndex: number;
}> = ({ chapter, startFrom, activeIndex }) => {
  const frame = useCurrentFrame();
  const absoluteFrame = frame + startFrom;
  const { fps } = useVideoConfig();

  const isCurrent =
    absoluteFrame >= chapter.start && absoluteFrame <= chapter.end;

  const animateIn =
    activeIndex === 0
      ? 1
      : spring({
          frame,
          fps,
          config: { damping: 200 },
          durationInFrames: 20,
          delay: 20,
        });

  const translateY = interpolate(
    animateIn,
    [0, 1],
    [CHAPTER_HEIGHT + CHAPTER_VERTICAL_MARGIN * 2, 0]
  );

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
          backgroundColor: isCurrent ? "#0b84f3" : "white",
          padding: "0px 20px",
          fontSize: 36,
          fontFamily: "GT Planar",
          fontWeight: "500",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: isCurrent ? "white" : "black",
        }}
      >
        {chapter.title}
      </div>
    </div>
  );
};
