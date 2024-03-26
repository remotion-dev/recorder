import React from "react";
import { AbsoluteFill } from "remotion";
import type { CanvasLayout } from "../../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import type { Theme } from "../../../config/themes";
import {
  getChapterInTransition,
  getChapterOutTransition,
} from "../../animations/widescreen-chapter-transitions";
import { Subs } from "../../captions/Subs";
import type { ChapterType } from "../../chapters/make-chapters";
import { SquareChapter } from "../../chapters/square/SquareChapter";
import { SelectedChapters } from "../../chapters/widescreen/SelectedChapters";
import { Screen } from "./Screen";
import { SoundEffects } from "./SoundEffects";
import { Webcam } from "./Webcam";

export const CameraScene: React.FC<{
  enter: number;
  exit: number;
  canvasLayout: CanvasLayout;
  sceneAndMetadata: VideoSceneAndMetadata;
  nextScene: SceneAndMetadata | null;
  previousScene: SceneAndMetadata | null;
  theme: Theme;
  chapters: ChapterType[];
}> = ({
  enter,
  exit,
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

  if (sceneAndMetadata.type !== "video-scene") {
    throw new Error("Not a camera scene");
  }

  return (
    <>
      <AbsoluteFill>
        {sceneAndMetadata.pair.display ? (
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
        {canvasLayout === "landscape" ? (
          <SelectedChapters
            inTransition={getChapterInTransition({
              currentScene: sceneAndMetadata,
              previousScene,
            })}
            outTransition={getChapterOutTransition({
              currentScene: sceneAndMetadata,
              nextScene,
            })}
            scene={sceneAndMetadata}
            nextScene={nextScene?.type === "video-scene" ? nextScene : null}
            previousScene={
              previousScene?.type === "video-scene" ? previousScene : null
            }
            enterProgress={enter}
            exitProgress={exit}
            theme={theme}
            chapters={chapters}
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
      {sceneAndMetadata.pair.subs ? (
        <Subs
          canvasLayout={canvasLayout}
          trimStart={startFrom}
          file={sceneAndMetadata.pair.subs}
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
          theme={theme}
        />
      ) : null}
      <SoundEffects
        previousScene={previousScene}
        sceneAndMetadata={sceneAndMetadata}
      />
    </>
  );
};
