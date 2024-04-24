import React from "react";
import { AbsoluteFill } from "remotion";
import type { CanvasLayout } from "../../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import type { Theme } from "../../../config/themes";
import { getShouldTransitionIn } from "../../animations/transitions";
import { Subs } from "../../captions/Subs";
import { LandscapeChapters } from "../../chapters/landscape/SelectedChapters";
import type { ChapterType } from "../../chapters/make-chapters";
import { SquareChapter } from "../../chapters/square/SquareChapter";
import { Display } from "./Display";
import { Webcam } from "./Webcam";

export const CameraScene: React.FC<{
  enterProgress: number;
  exitProgress: number;
  canvasLayout: CanvasLayout;
  sceneAndMetadata: VideoSceneAndMetadata;
  nextScene: SceneAndMetadata | null;
  previousScene: SceneAndMetadata | null;
  theme: Theme;
  chapters: ChapterType[];
  willTransitionToNextScene: boolean;
}> = ({
  enterProgress,
  exitProgress,
  sceneAndMetadata,
  canvasLayout,
  nextScene,
  previousScene,
  theme,
  chapters,
}) => {
  const startFrom = sceneAndMetadata.startFrame;
  const endAt = sceneAndMetadata.endFrame;

  if (sceneAndMetadata.type !== "video-scene") {
    throw new Error("Not a camera scene");
  }

  return (
    <>
      <AbsoluteFill>
        {sceneAndMetadata.pair.display ? (
          <Display
            scene={sceneAndMetadata}
            enterProgress={enterProgress}
            exitProgress={exitProgress}
            nextScene={nextScene}
            previousScene={previousScene}
            startFrom={startFrom}
            endAt={endAt}
            canvasLayout={canvasLayout}
            bRollLayout={sceneAndMetadata.layout.bRollLayout}
            bRollEnterDirection={sceneAndMetadata.layout.bRollEnterDirection}
          />
        ) : null}
        {
          // TODO: Chapters are disabled if a webcam position is center
          canvasLayout === "landscape" &&
          sceneAndMetadata.finalWebcamPosition !== "center" &&
          !(
            nextScene?.type === "video-scene" &&
            nextScene.finalWebcamPosition === "center"
          ) &&
          !(
            previousScene?.type === "video-scene" &&
            previousScene.finalWebcamPosition === "center"
          ) ? (
            <LandscapeChapters
              scene={sceneAndMetadata}
              nextVideoScene={
                nextScene?.type === "video-scene" ? nextScene : null
              }
              previousVideoScene={
                previousScene?.type === "video-scene" ? previousScene : null
              }
              enterProgress={enterProgress}
              exitProgress={exitProgress}
              theme={theme}
              chapters={chapters}
            />
          ) : null
        }
        <Webcam
          bRolls={sceneAndMetadata.pair.display ? [] : sceneAndMetadata.bRolls}
          currentScene={sceneAndMetadata}
          endAt={endAt}
          enterProgress={enterProgress}
          exitProgress={exitProgress}
          startFrom={startFrom}
          webcamLayout={sceneAndMetadata.layout.webcamLayout}
          canvasLayout={canvasLayout}
          nextScene={nextScene}
          previousScene={previousScene}
          bRollLayout={sceneAndMetadata.layout.bRollLayout}
          bRollEnterDirection={sceneAndMetadata.layout.bRollEnterDirection}
          bRollType={sceneAndMetadata.layout.bRollType}
        />
      </AbsoluteFill>
      {sceneAndMetadata.pair.subs ? (
        <Subs
          canvasLayout={canvasLayout}
          trimStart={startFrom}
          file={sceneAndMetadata.pair.subs}
          enterProgress={enterProgress}
          exitProgress={exitProgress}
          scene={sceneAndMetadata}
          nextScene={nextScene}
          previousScene={previousScene}
          theme={theme}
        />
      ) : null}
      {sceneAndMetadata.scene.newChapter && canvasLayout === "square" ? (
        <SquareChapter
          title={sceneAndMetadata.scene.newChapter}
          displayLayout={sceneAndMetadata.layout.displayLayout}
          webcamLayout={sceneAndMetadata.layout.webcamLayout}
          didTransitionIn={getShouldTransitionIn({
            previousScene,
            scene: sceneAndMetadata,
            canvasLayout,
          })}
        />
      ) : null}
    </>
  );
};
