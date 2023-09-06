import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { WideLayoutChapter } from "./Chapter";
import type { ChapterType } from "./generate";

export const SelectedChapters: React.FC<{
  shouldJumpIn: boolean;
  shouldJumpOut: boolean;
  shownChapters: ChapterType[];
  activeIndex: number;
  shouldFadeFirstOut: boolean;
  shouldFadeLastIn: boolean;
  slideY: boolean;
}> = ({
  shouldJumpIn,
  shouldJumpOut,
  shownChapters,
  activeIndex,
  shouldFadeFirstOut,
  shouldFadeLastIn,
  slideY,
}) => {
  const { fps, width, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const jumpIn = shouldJumpIn
    ? spring({
        fps,
        frame,
        config: {
          damping: 200,
        },
        durationInFrames: 10,
      })
    : 1;

  const jumpOut = shouldJumpOut
    ? spring({
        fps,
        frame,
        config: {
          damping: 200,
        },
        durationInFrames: 10,
        delay: durationInFrames - 10,
      })
    : 0;

  const translateX = interpolate(jumpIn - jumpOut, [0, 1], [-width, 0]);

  return (
    <AbsoluteFill
      style={{
        alignItems: "flex-start",
        padding: 25,
        transform: `translateX(${translateX}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {shownChapters.map((chapter, i) => {
          return (
            <WideLayoutChapter
              key={chapter.id}
              activeIndex={activeIndex}
              chapter={chapter}
              slideY={slideY}
              slideHighlight={activeIndex > 0}
              fadeOut={i === 0 && shouldFadeFirstOut}
              fadeIn={i === shownChapters.length - 1 && shouldFadeLastIn}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
