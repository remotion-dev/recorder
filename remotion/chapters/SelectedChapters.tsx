import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { safeSpace } from "../layout/get-layout";
import type { ChapterType } from "./generate";
import {
  CHAPTER_HEIGHT,
  CHAPTER_VERTICAL_MARGIN,
  WideLayoutChapter,
} from "./WideLayoutChapter";

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

  const height =
    (CHAPTER_HEIGHT + CHAPTER_VERTICAL_MARGIN * 2) * shownChapters.length -
    CHAPTER_VERTICAL_MARGIN * 2;

  const styles: React.CSSProperties = useMemo(() => {
    return {
      display: "flex",
      paddingLeft: safeSpace("wide"),
      paddingTop: safeSpace("wide"),
    };
  }, []);

  return (
    <AbsoluteFill
      style={{
        alignItems: "flex-start",
        transform: `translateX(${translateX}px)`,
        ...styles,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          height,
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
              isFirst={i === 0}
              isLast={i === shownChapters.length - 1}
              fadeIn={i === shownChapters.length - 1 && shouldFadeLastIn}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
