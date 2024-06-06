import React from "react";
import type { CanvasLayout } from "../../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import type { Theme } from "../../../config/themes";
import { getShouldTransitionIn } from "../../animations/transitions";
import { NoCaptionsPlaceholder } from "../../captions/NoCaptionsPlaceholder";
import { Subs } from "../../captions/Subs";
import { CaptionOverlay } from "../../captions/editor/CaptionOverlay";
import { LandscapeChapters } from "../../chapters/landscape/LandscapeChapters";
import type { ChapterType } from "../../chapters/make-chapters";
import { SquareChapter } from "../../chapters/square/SquareChapter";
import { WaitForFonts } from "../../helpers/WaitForFonts";
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
  const startFrom = sceneAndMetadata.startFrame;
  const endAt = sceneAndMetadata.endFrame;

  if (sceneAndMetadata.type !== "video-scene") {
    throw new Error("Not a camera scene");
  }

  const didTransitionIn = getShouldTransitionIn({
    previousSceneAndMetadata: previousScene,
    sceneAndMetadata: sceneAndMetadata,
    canvasLayout,
  });

  return (
    <>
      {sceneAndMetadata.cameras.display ? (
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
      <Webcam
        bRolls={
          sceneAndMetadata.cameras.display !== null
            ? []
            : sceneAndMetadata.bRolls
        }
        currentScene={sceneAndMetadata}
        endAt={endAt}
        enterProgress={enterProgress}
        exitProgress={exitProgress}
        startFrom={startFrom}
        canvasLayout={canvasLayout}
        nextScene={nextScene}
        previousScene={previousScene}
        bRollLayout={sceneAndMetadata.layout.bRollLayout}
        bRollEnterDirection={sceneAndMetadata.layout.bRollEnterDirection}
        bRollType={sceneAndMetadata.layout.bRollType}
      />
      {sceneAndMetadata.cameras.captions ? (
        <WaitForFonts>
          <CaptionOverlay
            file={sceneAndMetadata.cameras.captions}
            theme={theme}
            trimStart={startFrom}
          >
            <Subs
              canvasLayout={canvasLayout}
              trimStart={startFrom}
              enterProgress={enterProgress}
              exitProgress={exitProgress}
              scene={sceneAndMetadata}
              nextScene={nextScene}
              previousScene={previousScene}
              theme={theme}
            />
          </CaptionOverlay>
        </WaitForFonts>
      ) : (
        <NoCaptionsPlaceholder
          layout={sceneAndMetadata.layout.subtitleLayout}
          theme={theme}
        />
      )}
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
    </>
  );
};
