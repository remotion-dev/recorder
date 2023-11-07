import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SquareChapter } from "../chapters/SquareChapter";
import type { CanvasLayout, SceneAndMetadata } from "../configuration";
import { transitionDuration } from "../configuration";
import { Subs } from "../Subs/Subs";
import { WebcamVideo } from "../WebcamVideo";
import { DisplayVideo } from "./DisplayVideo";

const Inner: React.FC<{
  startFrom: number;
  endAt: number | undefined;
  shouldEnter: boolean;
  shouldExit: boolean;
  canvasLayout: CanvasLayout;
  scene: SceneAndMetadata;
  nextScene: SceneAndMetadata | null;
  previousScene: SceneAndMetadata | null;
}> = ({
  endAt,
  shouldEnter,
  shouldExit,
  startFrom,
  scene,
  canvasLayout,
  nextScene,
  previousScene,
}) => {
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

  if (scene.type !== "video-scene") {
    throw new Error("Not a camera scene");
  }

  return (
    <>
      <AbsoluteFill>
        {scene.layout.displayLayout && scene.pair.display ? (
          <DisplayVideo
            scene={scene}
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
          currentScene={scene}
          endAt={endAt}
          enter={enter}
          exit={exit}
          startFrom={startFrom}
          webcamLayout={scene.layout.webcamLayout}
          canvasLayout={canvasLayout}
          nextScene={nextScene}
          previousScene={previousScene}
        />
      </AbsoluteFill>
      {scene.pair.sub ? (
        <Subs
          canvasLayout={canvasLayout}
          trimStart={startFrom}
          file={scene.pair.sub}
          enter={enter}
          exit={exit}
          scene={scene}
          nextScene={nextScene}
          previousScene={previousScene}
        />
      ) : null}
      {scene.scene.newChapter && canvasLayout === "square" ? (
        <SquareChapter
          webcamPosition={scene.finalWebcamPosition}
          title={scene.scene.newChapter}
        />
      ) : null}
      {shouldEnter ? (
        <Audio src={staticFile("sounds/whipwhoosh.mp3")} volume={0.1} />
      ) : null}
    </>
  );
};

export const CameraScene: React.FC<{
  sceneAndMetadata: SceneAndMetadata;
  start: number;
  index: number;
  shouldEnter: boolean;
  shouldExit: boolean;
  canvasLayout: CanvasLayout;
  nextScene: SceneAndMetadata | null;
  previousScene: SceneAndMetadata | null;
}> = ({
  start,
  index,
  shouldEnter,
  shouldExit,
  canvasLayout,
  nextScene,
  previousScene,
  sceneAndMetadata,
}) => {
  if (sceneAndMetadata.type !== "video-scene") {
    throw new Error("Not a camera scene");
  }

  if (sceneAndMetadata.scene.type !== "scene") {
    throw new Error("Not a scene");
  }

  const { scene, durationInFrames } = sceneAndMetadata;

  const startFrom = scene.trimStart ?? 0;
  const endAt = scene.duration ? startFrom + scene.duration : undefined;

  return (
    <Sequence
      name={`Scene ${index}`}
      from={start}
      durationInFrames={Math.max(1, durationInFrames)}
    >
      <Inner
        canvasLayout={canvasLayout}
        endAt={endAt}
        shouldEnter={shouldEnter}
        shouldExit={shouldExit}
        startFrom={startFrom}
        scene={sceneAndMetadata}
        nextScene={nextScene}
        previousScene={previousScene}
      />
    </Sequence>
  );
};
