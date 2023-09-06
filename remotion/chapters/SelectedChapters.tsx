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

  const styles = useMemo((): React.CSSProperties => {
    const selectedChapter = shownChapters.find((c) => c.index === activeIndex);
    if (!selectedChapter) {
      throw new Error("Could not find selected chapter");
    }

    // TODO: Find correct position
    const pos = selectedChapter.webcamPositions.find(
      (p) =>
        p.start - selectedChapter.start <= frame &&
        p.end - selectedChapter.start > frame
    );
    if (!pos) {
      throw new Error("Could not find position");
    }

    const { layout, webcamPosition } = pos;
    console.log(webcamPosition);
    if (webcamPosition === "top-left") {
      return {
        display: "flex",
        paddingLeft: safeSpace("wide"),
        paddingTop: safeSpace("wide") * 2 + layout.webcamLayout.height,
        flex: 1,
      };
    }

    if (webcamPosition === "top-right") {
      return {
        display: "flex",
        paddingRight: safeSpace("wide"),
        alignSelf: "flex-end",
        flex: 1,
        paddingTop: safeSpace("wide") * 2 + layout.webcamLayout.height,
      };
    }

    if (webcamPosition === "bottom-left") {
      return {
        display: "flex",
        paddingRight: safeSpace("wide"),
        flex: 1,
        paddingTop: layout.webcamLayout.y - height - safeSpace("wide"),
        paddingLeft: safeSpace("wide"),
      };
    }

    if (webcamPosition === "bottom-right") {
      return {
        display: "flex",
        paddingRight: safeSpace("wide"),
        flex: 1,
        alignSelf: "flex-end",
        paddingTop: layout.webcamLayout.y - height - safeSpace("wide"),
      };
    }

    throw new Error(
      'chapters for "wide" layout must have a webcam position, not center'
    );
  }, [activeIndex, frame, height, shownChapters]);

  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${translateX}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height,
          ...styles,
        }}
      >
        {shownChapters.map((chapter, i) => {
          return (
            <div key={chapter.id}>
              <WideLayoutChapter
                activeIndex={activeIndex}
                chapter={chapter}
                slideY={slideY}
                slideHighlight={activeIndex > 0}
                fadeOut={i === 0 && shouldFadeFirstOut}
                isFirst={i === 0}
                isLast={i === shownChapters.length - 1}
                fadeIn={i === shownChapters.length - 1 && shouldFadeLastIn}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
