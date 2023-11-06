import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { getDisplayTranslation } from "../animations/camera-scene-transitions";
import { SquareChapter } from "../chapters/SquareChapter";
import type { CanvasLayout, Pair, SceneAndMetadata } from "../configuration";
import { transitionDuration } from "../configuration";
import { Subs } from "../Subs/Subs";
import { WebcamVideo } from "../WebcamVideo";

const Inner: React.FC<{
  pair: Pair;
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
  pair,
  startFrom,
  scene,
  canvasLayout,
  nextScene,
  previousScene,
}) => {
  const { fps, width, durationInFrames } = useVideoConfig();
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

  const displayTranslation = getDisplayTranslation({
    enter,
    exit,
    width,
    nextScene,
    previousScene,
    currentScene: scene,
  });

  return (
    <>
      <AbsoluteFill>
        {scene.layout.displayLayout && pair.display ? (
          <div
            style={{
              width: scene.layout.displayLayout.width,
              height: scene.layout.displayLayout.height,
              left: scene.layout.displayLayout.x,
              top: scene.layout.displayLayout.y,
              position: "absolute",
              borderRadius: scene.layout.displayLayout.borderRadius,
              opacity: displayTranslation.opacity,
              translate: `${displayTranslation.translationX}px ${displayTranslation.translationY}px`,
            }}
          >
            <OffthreadVideo
              startFrom={startFrom}
              endAt={endAt}
              src={pair.display.src}
              style={{
                maxWidth: "100%",
                borderRadius: scene.layout.displayLayout.borderRadius,
              }}
            />
          </div>
        ) : null}
        <WebcamVideo
          currentScene={scene}
          endAt={endAt}
          enter={enter}
          exit={exit}
          pair={pair}
          zoomInAtStart={scene.scene.zoomInAtStart ?? false}
          startFrom={startFrom}
          webcamLayout={scene.layout.webcamLayout}
          zoomInAtEnd={scene.scene.zoomInAtEnd}
          shouldExit={shouldExit}
          canvasLayout={canvasLayout}
          nextScene={nextScene}
          previousScene={previousScene}
        />
      </AbsoluteFill>
      {pair.sub ? (
        <Subs
          canvasLayout={canvasLayout}
          trimStart={startFrom}
          file={pair.sub}
          enter={enter}
          exit={exit}
          scene={scene}
          nextScene={nextScene}
          previousScene={previousScene}
        />
      ) : null}
      {scene.scene.newChapter && canvasLayout === "square" ? (
        <SquareChapter
          webcamPosition={scene.scene.webcamPosition}
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
  pair: Pair;
  start: number;
  index: number;
  shouldEnter: boolean;
  shouldExit: boolean;
  canvasLayout: CanvasLayout;
  nextScene: SceneAndMetadata | null;
  previousScene: SceneAndMetadata | null;
}> = ({
  pair,
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
        pair={pair}
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
