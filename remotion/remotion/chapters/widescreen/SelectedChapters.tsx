import { interpolateStyles, translate } from "@remotion/animation-utils";
import React, { useMemo } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { isWebCamRight } from "../../animations/webcam-transitions";
import type {
  InTransition,
  OutTransition,
} from "../../animations/widescreen-chapter-transitions";
import {
  makeInTransition,
  makeOutTransition,
} from "../../animations/widescreen-chapter-transitions";
import type { VideoSceneAndMetadata } from "../../configuration";
import type { ChapterType } from "../make-chapters";
import { getWidescreenChapterStyle } from "./layout";
import {
  CHAPTER_HEIGHT,
  CHAPTER_VERTICAL_MARGIN,
  WideLayoutChapter,
} from "./WideLayoutChapter";

export const SelectedChapters: React.FC<{
  inTransition: InTransition;
  outTransition: OutTransition;
  shownChapters: ChapterType[];
  scene: VideoSceneAndMetadata;
  previousScene: VideoSceneAndMetadata | null;
  nextScene: VideoSceneAndMetadata | null;
  activeIndex: number;
  enterWithSlideFromBottom: boolean;
  exitWithSlideToTop: boolean;
  shouldSlideHighlight: boolean;
  enterProgress: number;
  exitProgress: number;
}> = ({
  inTransition,
  outTransition,
  shownChapters,
  activeIndex,
  enterWithSlideFromBottom,
  scene,
  shouldSlideHighlight,
  nextScene,
  previousScene,
  enterProgress,
  exitProgress,
  exitWithSlideToTop,
}) => {
  const { width, height } = useVideoConfig();

  const { x: xIn, y: yIn } = makeInTransition({
    height,
    inTransition,
    progress: enterProgress,
    width,
  });

  const { x: xOut, y: yOut } = makeOutTransition({
    height,
    outTransition,
    progress: exitProgress,
    width,
  });

  const translateX = xIn + xOut;
  const translateY = yIn + yOut;

  const tableOfContentHeight =
    (CHAPTER_HEIGHT + CHAPTER_VERTICAL_MARGIN * 2) * shownChapters.length -
    CHAPTER_VERTICAL_MARGIN * 2;

  const { finalWebcamPosition } = scene;

  const rightAligned = isWebCamRight(finalWebcamPosition);

  const styles = useMemo((): React.CSSProperties => {
    const currentStyle = getWidescreenChapterStyle(scene, tableOfContentHeight);

    const previousChapterStyle = previousScene
      ? getWidescreenChapterStyle(previousScene, tableOfContentHeight)
      : null;

    const nextChapterStyle = nextScene
      ? getWidescreenChapterStyle(nextScene, tableOfContentHeight)
      : null;

    return interpolateStyles(
      enterProgress + exitProgress,
      [0, 1, 2],
      [
        inTransition === "none"
          ? previousChapterStyle ?? currentStyle
          : currentStyle,
        currentStyle,
        outTransition === "none"
          ? nextChapterStyle ?? currentStyle
          : currentStyle,
      ],
    );
  }, [
    scene,
    tableOfContentHeight,
    previousScene,
    nextScene,
    enterProgress,
    exitProgress,
    inTransition,
    outTransition,
  ]);

  if (scene.layout.displayLayout === null) {
    return null;
  }

  return (
    <AbsoluteFill
      style={{
        transform: translate(translateX, translateY),
      }}
    >
      <AbsoluteFill
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
                enterWithSlide={enterWithSlideFromBottom}
                slideHighlight={shouldSlideHighlight}
                fadeOut={i === 0 && exitWithSlideToTop}
                isFirst={i === 0}
                isLast={i === shownChapters.length - 1}
                fadeIn={
                  i === shownChapters.length - 1 && enterWithSlideFromBottom
                }
                rightAligned={rightAligned}
                enterProgress={enterProgress}
                exitProgress={exitProgress}
                exitWithSlide={exitWithSlideToTop}
              />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
