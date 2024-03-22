import React, { useMemo } from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { CanvasLayout } from "../../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import type { Theme } from "../../../config/themes";
import { TRANSITION_DURATION } from "../../../config/transitions";
import {
  getChapterInTransition,
  getChapterOutTransition,
} from "../../animations/widescreen-chapter-transitions";
import type { ChapterType } from "../../chapters/make-chapters";
import { SquareChapter } from "../../chapters/square/SquareChapter";
import { SelectedChapters } from "../../chapters/widescreen/SelectedChapters";
import { Subs } from "../../Subs/Subs";
import { Webcam } from "../../Webcam";
import { Screen } from "./Screen";
import { SoundEffects } from "./SoundEffects";

export const CameraScene: React.FC<{
  shouldEnter: boolean;
  shouldExit: boolean;
  canvasLayout: CanvasLayout;
  sceneAndMetadata: VideoSceneAndMetadata;
  nextScene: SceneAndMetadata | null;
  previousScene: SceneAndMetadata | null;
  theme: Theme;
  chapters: ChapterType[];
}> = ({
  shouldEnter,
  shouldExit,
  sceneAndMetadata,
  canvasLayout,
  nextScene,
  previousScene,
  theme,
  chapters,
}) => {
  const { scene } = sceneAndMetadata;

  const startFrom = scene.trimStart ?? 0;
  const endAt = scene.duration ? startFrom + scene.duration : undefined;

  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const enter = (() => {
    if (shouldEnter) {
      const spr = spring({
        fps,
        frame,
        durationInFrames: TRANSITION_DURATION,
        config: {
          damping: 200,
        },
      });
      return spr;
    }

    return 1;
  })();

  const exit = (() => {
    if (shouldExit) {
      const spr = spring({
        fps,
        frame,
        durationInFrames: TRANSITION_DURATION,
        config: {
          damping: 200,
        },
        delay: durationInFrames - TRANSITION_DURATION,
      });
      return spr;
    }

    return 0;
  })();

  if (sceneAndMetadata.type !== "video-scene") {
    throw new Error("Not a camera scene");
  }

  const chapterIndex = chapters.findIndex(
    (c) => c.title === sceneAndMetadata.chapter,
  );
  const chapter = chapters[chapterIndex];

  const shownChapters =
    chapterIndex === 0
      ? chapters.slice(0, 3)
      : chapters.slice(
          Math.max(0, chapterIndex - 1),
          Math.min(chapters.length, chapterIndex + 2),
        );

  // Should slide from the previous chapter?
  const enterChapterWithSlideFromBottom = useMemo(() => {
    // Only if there is a previous scene
    if (!previousScene) {
      return false;
    }

    // Only if it is a video scene
    if (previousScene.type !== "video-scene") {
      return false;
    }

    // Only if the webcam is in the same place
    if (
      previousScene.finalWebcamPosition !== sceneAndMetadata.finalWebcamPosition
    ) {
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

    return previousScene.chapter !== sceneAndMetadata.chapter;
  }, [
    chapterIndex,
    chapters,
    previousScene,
    sceneAndMetadata.chapter,
    sceneAndMetadata.finalWebcamPosition,
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
    if (
      nextScene.finalWebcamPosition !== sceneAndMetadata.finalWebcamPosition
    ) {
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
    return nextScene.chapter !== sceneAndMetadata.chapter;
  }, [
    chapterIndex,
    chapters,
    nextScene,
    sceneAndMetadata.chapter,
    sceneAndMetadata.finalWebcamPosition,
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
    if (previousScene.chapter === sceneAndMetadata.chapter) {
      return false;
    }

    // Only if the webcam is in the same place
    if (
      previousScene.finalWebcamPosition !== sceneAndMetadata.finalWebcamPosition
    ) {
      return false;
    }

    // Only if the previous scene has a display video
    if (!previousScene.layout.displayLayout) {
      return false;
    }

    return true;
  }, [
    previousScene,
    sceneAndMetadata.chapter,
    sceneAndMetadata.finalWebcamPosition,
  ]);

  return (
    <>
      <AbsoluteFill>
        {sceneAndMetadata.layout.displayLayout &&
        sceneAndMetadata.pair.display ? (
          <Screen
            scene={sceneAndMetadata}
            enter={enter}
            exit={exit}
            nextScene={nextScene}
            previousScene={previousScene}
            startFrom={startFrom}
            endAt={endAt}
            canvasLayout={canvasLayout}
          />
        ) : null}
        {chapter && canvasLayout === "landscape" ? (
          <SelectedChapters
            inTransition={getChapterInTransition({
              currentScene: sceneAndMetadata,
              previousScene,
            })}
            outTransition={getChapterOutTransition({
              currentScene: sceneAndMetadata,
              nextScene,
            })}
            activeIndex={chapter.index}
            scene={sceneAndMetadata}
            nextScene={nextScene?.type === "video-scene" ? nextScene : null}
            previousScene={
              previousScene?.type === "video-scene" ? previousScene : null
            }
            enterWithSlideFromBottom={enterChapterWithSlideFromBottom}
            exitWithSlideToTop={exitChapterWithSlideToTop}
            shouldSlideHighlight={shouldSlideHighlight}
            shownChapters={shownChapters}
            enterProgress={enter}
            exitProgress={exit}
          />
        ) : null}
        <Webcam
          currentScene={sceneAndMetadata}
          endAt={endAt}
          enterProgress={enter}
          exitProgress={exit}
          startFrom={startFrom}
          webcamLayout={sceneAndMetadata.layout.webcamLayout}
          canvasLayout={canvasLayout}
          nextScene={nextScene}
          previousScene={previousScene}
        />
      </AbsoluteFill>
      {sceneAndMetadata.pair.sub ? (
        <Subs
          canvasLayout={canvasLayout}
          trimStart={startFrom}
          file={sceneAndMetadata.pair.sub}
          enter={enter}
          exit={exit}
          scene={sceneAndMetadata}
          nextScene={nextScene}
          previousScene={previousScene}
          theme={theme}
        />
      ) : null}
      {sceneAndMetadata.scene.newChapter && canvasLayout === "square" ? (
        <SquareChapter
          webcamPosition={sceneAndMetadata.finalWebcamPosition}
          title={sceneAndMetadata.scene.newChapter}
        />
      ) : null}
      <SoundEffects
        previousScene={previousScene}
        sceneAndMetadata={sceneAndMetadata}
        shouldEnter={shouldEnter}
      />
    </>
  );
};
