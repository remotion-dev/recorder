import React, { useMemo } from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { transitionDuration } from "../configuration";
import { safeSpace } from "../layout/get-layout";
import type { ChapterType } from "./make-chapters";
import type { ChapterScene } from "./narrow-down";
import type { InTransition, OutTransition } from "./transition";
import { makeInTransition, makeOutTransition } from "./transition";
import {
  CHAPTER_HEIGHT,
  CHAPTER_VERTICAL_MARGIN,
  WideLayoutChapter,
} from "./WideLayoutChapter";

export const SelectedChapters: React.FC<{
  inTransition: InTransition;
  outTransition: OutTransition;
  shownChapters: ChapterType[];
  chapterScene: ChapterScene;
  activeIndex: number;
  shouldFadeFirstOut: boolean;
  shouldSlideY: boolean;
  shouldSlideHighlight: boolean;
}> = ({
  inTransition,
  outTransition,
  shownChapters,
  activeIndex,
  shouldFadeFirstOut,
  shouldSlideY,
  chapterScene,
  shouldSlideHighlight,
}) => {
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const jumpIn =
    inTransition === "none"
      ? 1
      : spring({
          fps,
          frame,
          config: {
            damping: 200,
          },
          durationInFrames: transitionDuration,
        });

  const jumpOut =
    outTransition === "none"
      ? 1
      : spring({
          fps,
          frame,
          config: {
            damping: 200,
          },
          durationInFrames: transitionDuration,
          delay: durationInFrames - transitionDuration,
        });

  const { x: xIn, y: yIn } = makeInTransition({
    height,
    inTransition,
    progress: jumpIn,
    width,
  });

  const { x: xOut, y: yOut } = makeOutTransition({
    height,
    outTransition,
    progress: jumpOut,
    width,
  });

  const translateX = xIn + xOut;
  const translateY = yIn + yOut;

  const tableOfContentHeight =
    (CHAPTER_HEIGHT + CHAPTER_VERTICAL_MARGIN * 2) * shownChapters.length -
    CHAPTER_VERTICAL_MARGIN * 2;

  const { webcamInformation } = chapterScene;

  const rightAligned =
    webcamInformation.webcamPosition === "top-right" ||
    webcamInformation.webcamPosition === "bottom-right";

  const styles = useMemo((): React.CSSProperties => {
    const { layout, webcamPosition } = webcamInformation;

    const topAligned =
      webcamPosition === "top-left" || webcamPosition === "top-right";

    const style: React.CSSProperties = {
      ...(rightAligned
        ? {
            paddingRight: safeSpace("wide"),
            alignSelf: "flex-end",
            alignItems: "flex-end",
          }
        : { paddingLeft: safeSpace("wide") }),
      ...(topAligned
        ? {
            paddingTop: safeSpace("wide") * 2 + layout.webcamLayout.height,
          }
        : {
            paddingTop:
              layout.webcamLayout.y - tableOfContentHeight - safeSpace("wide"),
          }),
    };

    return style;
  }, [tableOfContentHeight, rightAligned, webcamInformation]);

  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${translateX}px) translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: tableOfContentHeight,
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
                slideY={shouldSlideY}
                slideHighlight={shouldSlideHighlight}
                fadeOut={i === 0 && shouldFadeFirstOut}
                isFirst={i === 0}
                isLast={i === shownChapters.length - 1}
                fadeIn={i === shownChapters.length - 1 && shouldSlideY}
                rightAligned={rightAligned}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
