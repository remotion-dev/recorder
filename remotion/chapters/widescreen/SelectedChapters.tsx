import { interpolateStyles, translate } from "@remotion/animation-utils";
import React, { useMemo } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import type { VideoSceneAndMetadata } from "../../../config/scenes";
import type { Theme } from "../../../config/themes";
import { isWebCamRight } from "../../animations/webcam-transitions";
import type {
  InTransition,
  OutTransition,
} from "../../animations/widescreen-chapter-transitions";
import {
  makeInTransition,
  makeOutTransition,
} from "../../animations/widescreen-chapter-transitions";
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
  scene: VideoSceneAndMetadata;
  previousScene: VideoSceneAndMetadata | null;
  nextScene: VideoSceneAndMetadata | null;
  enterProgress: number;
  exitProgress: number;
  theme: Theme;
  chapters: ChapterType[];
}> = ({
  inTransition,
  outTransition,
  chapters,
  scene,
  nextScene,
  previousScene,
  enterProgress,
  exitProgress,
  theme,
}) => {
  const chapterIndex = chapters.findIndex((c) => c.title === scene.chapter);

  const shownChapters =
    chapterIndex === 0
      ? chapters.slice(0, 3)
      : chapters.slice(
          Math.max(0, chapterIndex - 1),
          Math.min(chapters.length, chapterIndex + 2),
        );

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

  // Should slide from the previous chapter?
  const enterWithSlideFromBottom = useMemo(() => {
    // Only if there is a previous scene
    if (!previousScene) {
      return false;
    }

    // Only if it is a video scene
    if (previousScene.type !== "video-scene") {
      return false;
    }

    // Only if the webcam is in the same place
    if (previousScene.finalWebcamPosition !== scene.finalWebcamPosition) {
      return false;
    }

    // Only if it is not the first or second chapter (highlight slides from top to middle)
    if (!chapters[chapterIndex - 2]) {
      return false;
    }

    // Only if the previous scene has a display video
    if (!previousScene.layout.displayLayout) {
      return false;
    }

    // Not if it is the last chapter (highlight slides from middle to bottom)
    const isLastChapter = !chapters[chapterIndex + 1];
    if (isLastChapter) {
      return false;
    }

    return previousScene.chapter !== scene.chapter;
  }, [
    chapterIndex,
    chapters,
    previousScene,
    scene.chapter,
    scene.finalWebcamPosition,
  ]);

  // Should slide to the next chapter?
  const exitChapterWithSlideToTop = useMemo(() => {
    // Only if there is a next scene
    if (!nextScene) {
      return false;
    }

    // Only if it is a video scene
    if (nextScene.type !== "video-scene") {
      return false;
    }

    // Only if the webcam is in the same place
    if (nextScene.finalWebcamPosition !== scene.finalWebcamPosition) {
      return false;
    }

    // Only if the next scene has a display video
    if (!nextScene.layout.displayLayout) {
      return false;
    }

    // Only if it is not the first chapter (highlight slides from top to middle)
    const isFirstChapter = !chapters[chapterIndex - 1];

    if (isFirstChapter) {
      return false;
    }

    // Not if it is the last chapter or the second last (highlight slides from middle to bottom)
    const isLastOrSecondLastChapter = !chapters[chapterIndex + 2];

    if (isLastOrSecondLastChapter) {
      return false;
    }

    // Only if it is a different chapter
    return nextScene.chapter !== scene.chapter;
  }, [
    chapterIndex,
    chapters,
    nextScene,
    scene.chapter,
    scene.finalWebcamPosition,
  ]);

  // Should the chapter have it's highlight animated in the beginning?
  const shouldSlideHighlight = useMemo(() => {
    // Only if it comes from a previous scene
    if (!previousScene) {
      return false;
    }

    // Only if it was a video scene
    if (previousScene.type !== "video-scene") {
      return false;
    }

    // Only if the chapter was not the same
    if (previousScene.chapter === scene.chapter) {
      return false;
    }

    // Only if the webcam is in the same place
    if (previousScene.finalWebcamPosition !== scene.finalWebcamPosition) {
      return false;
    }

    // Only if the previous scene has a display video
    if (!previousScene.layout.displayLayout) {
      return false;
    }

    return true;
  }, [previousScene, scene.chapter, scene.finalWebcamPosition]);

  if (scene.layout.displayLayout === null) {
    return null;
  }

  const chapter = chapters[chapterIndex];
  if (!chapter) {
    return null;
  }

  const activeIndex = chapter.index;

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
        {shownChapters.map((chap, i) => {
          return (
            <div key={chap.id}>
              <WideLayoutChapter
                activeIndex={activeIndex}
                chapter={chap}
                enterWithSlide={enterWithSlideFromBottom}
                slideHighlight={shouldSlideHighlight}
                fadeOut={i === 0 && exitChapterWithSlideToTop}
                isFirst={i === 0}
                theme={theme}
                isLast={i === shownChapters.length - 1}
                fadeIn={
                  i === shownChapters.length - 1 && enterWithSlideFromBottom
                }
                rightAligned={rightAligned}
                enterProgress={enterProgress}
                exitProgress={exitProgress}
                exitWithSlide={exitChapterWithSlideToTop}
              />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
