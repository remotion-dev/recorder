import React, { useMemo } from "react";
import type { CanvasLayout } from "../../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import type { Theme } from "../../../config/themes";
import { getShouldTransitionIn } from "../../animations/transitions";
import { hasDisplay } from "../../calculate-metadata/has-display";
import { BoxedCaptions } from "../../captions/boxed/BoxedCaptions";
import { SrtPreviewAndEditor } from "../../captions/srt/SrtPreviewAndEditor/SrtPreviewAndEditor";
import { LandscapeChapters } from "../../chapters/landscape/LandscapeChapters";
import type { ChapterType } from "../../chapters/make-chapters";
import { SquareChapter } from "../../chapters/square/SquareChapter";
import { Display } from "./Display";
import { Webcam } from "./Webcam";

export const VideoScene: React.FC<{
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
  const startFrame = sceneAndMetadata.startFrame;
  const endAt = sceneAndMetadata.endFrame;

  if (sceneAndMetadata.type !== "video-scene") {
    throw new Error("Not a camera scene");
  }

  const didTransitionIn = getShouldTransitionIn({
    previousSceneAndMetadata: previousScene,
    sceneAndMetadata: sceneAndMetadata,
    canvasLayout,
  });

  const bRollsOnTopOfWebcam = useMemo(() => {
    if (hasDisplay(sceneAndMetadata.cameras)) {
      return [];
    }
    return sceneAndMetadata.bRolls;
  }, [sceneAndMetadata.bRolls, sceneAndMetadata.cameras]);

  return (
    <>
      {hasDisplay(sceneAndMetadata.cameras) ? (
        <Display
          scene={sceneAndMetadata}
          enterProgress={enterProgress}
          exitProgress={exitProgress}
          nextScene={nextScene}
          previousScene={previousScene}
          startFrame={startFrame}
          endAt={endAt}
          canvasLayout={canvasLayout}
        />
      ) : null}
      <Webcam
        bRolls={bRollsOnTopOfWebcam}
        currentScene={sceneAndMetadata}
        endAt={endAt}
        enterProgress={enterProgress}
        exitProgress={exitProgress}
        startFrame={startFrame}
        canvasLayout={canvasLayout}
        nextScene={nextScene}
        previousScene={previousScene}
      />
      {canvasLayout === "square" ? (
        <BoxedCaptions
          enterProgress={enterProgress}
          exitProgress={exitProgress}
          nextScene={nextScene}
          previousScene={previousScene}
          sceneAndMetadata={sceneAndMetadata}
          startFrame={startFrame}
          theme={theme}
        />
      ) : null}
      {sceneAndMetadata.scene.newChapter && canvasLayout === "square" ? (
        <SquareChapter
          title={sceneAndMetadata.scene.newChapter}
          displayLayout={sceneAndMetadata.layout.displayLayout}
          webcamLayout={sceneAndMetadata.layout.webcamLayout}
          didTransitionIn={didTransitionIn}
        />
      ) : null}
      {sceneAndMetadata.scene.newChapter && canvasLayout === "landscape" ? (
        <LandscapeChapters
          scene={sceneAndMetadata}
          theme={theme}
          chapters={chapters}
          didTransitionIn={didTransitionIn}
        />
      ) : null}
      {canvasLayout === "landscape" && sceneAndMetadata.cameras.captions ? (
        <SrtPreviewAndEditor
          captions={sceneAndMetadata.cameras.captions}
          startFrame={startFrame}
          theme={theme}
        ></SrtPreviewAndEditor>
      ) : null}
    </>
  );
};
