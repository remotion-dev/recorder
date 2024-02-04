import React from "react";
import {
  AbsoluteFill,
  Audio,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  isGrowingFromMiniature,
  isShrinkingToMiniature,
} from "../animations/camera-scene-transitions";
import { SquareChapter } from "../chapters/SquareChapter";
import type {
  CanvasLayout,
  SceneAndMetadata,
  Theme,
  VideoSceneAndMetadata,
} from "../configuration";
import { transitionDuration } from "../configuration";
import { Subs } from "../Subs/Subs";
import { WebcamVideo } from "../WebcamVideo";
import { DisplayVideo } from "./DisplayVideo";

const AudioEffects: React.FC<{
  previousScene: SceneAndMetadata | null;
  sceneAndMetadata: VideoSceneAndMetadata;
  shouldEnter: boolean;
}> = ({ previousScene, sceneAndMetadata, shouldEnter }) => {
  if (!shouldEnter) {
    return null;
  }

  if (
    previousScene &&
    isShrinkingToMiniature({
      firstScene: previousScene,
      secondScene: sceneAndMetadata,
    })
  ) {
    return <Audio src={staticFile("sounds/shrink.m4a")} volume={0.2} />;
  }

  if (
    previousScene &&
    isGrowingFromMiniature({
      firstScene: previousScene,
      secondScene: sceneAndMetadata,
    })
  ) {
    return <Audio src={staticFile("sounds/grow.m4a")} volume={0.2} />;
  }

  return <Audio src={staticFile("sounds/whipwhoosh.mp3")} volume={0.1} />;
};

export const CameraScene: React.FC<{
  shouldEnter: boolean;
  shouldExit: boolean;
  canvasLayout: CanvasLayout;
  sceneAndMetadata: VideoSceneAndMetadata;
  nextScene: SceneAndMetadata | null;
  previousScene: SceneAndMetadata | null;
  theme: Theme;
}> = ({
  shouldEnter,
  shouldExit,
  sceneAndMetadata,
  canvasLayout,
  nextScene,
  previousScene,
  theme,
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
        durationInFrames: transitionDuration,
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
        durationInFrames: transitionDuration,
        config: {
          damping: 200,
        },
        delay: durationInFrames - transitionDuration,
      });
      return spr;
    }

    return 0;
  })();

  if (sceneAndMetadata.type !== "video-scene") {
    throw new Error("Not a camera scene");
  }

  return (
    <>
      <AbsoluteFill>
        {sceneAndMetadata.layout.displayLayout &&
        sceneAndMetadata.pair.display ? (
          <DisplayVideo
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
        <WebcamVideo
          currentScene={sceneAndMetadata}
          endAt={endAt}
          enter={enter}
          exit={exit}
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
      <AudioEffects
        previousScene={previousScene}
        sceneAndMetadata={sceneAndMetadata}
        shouldEnter={shouldEnter}
      />
    </>
  );
};
