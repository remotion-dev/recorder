import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { safeSpace } from "../layout/get-layout";
import type {
  ChapterType,
  WebcamInformtion as WebcamInformation,
} from "./generate";
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

  const webcamInformation = useMemo((): WebcamInformation => {
    const selectedChapter = shownChapters.find((c) => c.index === activeIndex);
    if (!selectedChapter) {
      throw new Error("Could not find selected chapter");
    }

    const pos = selectedChapter.webcamPositions.find(
      (p) =>
        p.start - selectedChapter.start <= frame &&
        p.end - selectedChapter.start > frame
    );
    if (!pos) {
      throw new Error("Could not find position");
    }

    return pos;
  }, [activeIndex, frame, shownChapters]);

  const styles = useMemo((): React.CSSProperties => {
    const { layout, webcamPosition } = webcamInformation;

    if (webcamPosition === "center") {
      throw new Error("no subs in center layout");
    }

    const rightAligned =
      webcamPosition === "top-right" || webcamPosition === "bottom-right";
    const topAligned =
      webcamPosition === "top-left" || webcamPosition === "top-right";

    const style = {
      ...(rightAligned
        ? { paddingRight: safeSpace("wide"), alignSelf: "flex-end" }
        : { paddingLeft: safeSpace("wide") }),
      ...(topAligned
        ? {
            paddingTop: safeSpace("wide") * 2 + layout.webcamLayout.height,
          }
        : {
            paddingTop: layout.webcamLayout.y - height - safeSpace("wide"),
          }),
    };

    return style;
  }, [height, webcamInformation]);

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
          flex: 1,
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
