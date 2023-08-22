import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { getDisplayTranslation } from "../animations/camera-scene-transitions";
import type {
  CanvasLayout,
  Dimensions,
  Pair,
  SceneMetadata,
  SceneType,
} from "../configuration";
import { transitionDuration } from "../configuration";
import type { CameraSceneLayout } from "../layout/get-layout";
import { borderRadius, frameWidth, getLayout } from "../layout/get-layout";
import { Subs } from "../Subs/Subs";
import { WebcamVideo } from "../WebcamVideo";

const Inner: React.FC<{
  pair: Pair;
  startFrom: number;
  endAt: number | undefined;
  shouldEnter: boolean;
  shouldExit: boolean;
  canvasLayout: CanvasLayout;
  scene: SceneType;
  layout: CameraSceneLayout;
  previousLayout: CameraSceneLayout | null;
  nextLayout: CameraSceneLayout | null;
}> = ({
  endAt,
  shouldEnter,
  shouldExit,
  pair,
  startFrom,
  scene,
  canvasLayout,
  layout,
  nextLayout,
  previousLayout,
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

  if (scene.type !== "scene") {
    throw new Error("Not a camera scene");
  }

  const displayTranslation = getDisplayTranslation({
    enter,
    exit,
    width,
    nextLayout: nextLayout?.displayLayout ?? null,
    previousLayout: previousLayout?.displayLayout ?? null,
    currentLayout: layout.displayLayout,
  });

  return (
    <>
      <AbsoluteFill>
        {layout.displayLayout && pair.display ? (
          <div
            style={{
              width: layout.displayLayout.width,
              height: layout.displayLayout.height,
              left: layout.displayLayout.x,
              top: layout.displayLayout.y,
              position: "absolute",
              padding: frameWidth,
              borderRadius: borderRadius + frameWidth,
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
                borderRadius,
              }}
            />
          </div>
        ) : null}
        <WebcamVideo
          endAt={endAt}
          enter={enter}
          exit={exit}
          pair={pair}
          zoomInAtStart={scene.zoomInAtStart ?? false}
          startFrom={startFrom}
          webcamLayout={layout.webcamLayout}
          webcamPosition={scene.webcamPosition}
          zoomInAtEnd={scene.zoomInAtEnd}
          shouldExit={shouldExit}
        />
      </AbsoluteFill>
      {pair.sub ? (
        <Subs
          webcamPosition={scene.webcamPosition}
          canvasLayout={canvasLayout}
          trimStart={startFrom}
          file={pair.sub}
          webcamLayout={layout.webcamLayout}
          displayLayout={layout.displayLayout}
          enter={enter}
          exit={exit}
        />
      ) : null}
    </>
  );
};

export const CameraScene: React.FC<{
  metadata: SceneMetadata;
  pair: Pair;
  start: number;
  index: number;
  shouldEnter: boolean;
  shouldExit: boolean;
  canvasLayout: CanvasLayout;
  scene: SceneType | undefined;
  nextScene: { scene: SceneType; metadata: SceneMetadata } | null;
  previousScene: { scene: SceneType; metadata: SceneMetadata } | null;
}> = ({
  metadata,
  pair,
  start,
  index,
  shouldEnter,
  shouldExit,
  canvasLayout,
  scene,
  nextScene,
  previousScene,
}) => {
  const { height, width } = useVideoConfig();

  const from = start;

  if (scene === undefined) {
    return (
      <Sequence
        from={from}
        durationInFrames={Math.max(1, metadata.durationInFrames)}
      >
        <div>
          <h1
            style={{
              backgroundColor: "red",
            }}
          >
            no conf
          </h1>
        </div>
      </Sequence>
    );
  }

  if (scene.type !== "scene") {
    throw new Error("Not a camera scene");
  }

  if (metadata.videos === null) {
    throw new Error("No videos");
  }

  const startFrom = scene.trimStart ?? 0;
  const endAt = scene.duration ? startFrom + scene.duration : undefined;

  const canvasSize = {
    width,
    height,
  };

  const layout = getLayout({
    display: metadata.videos.display,
    webcam: metadata.videos.webcam,
    canvasSize,
    canvasLayout,
    webcamPosition: scene.webcamPosition,
  });

  const prevLayout =
    previousScene && previousScene.scene.type === "scene"
      ? getLayout({
          display: previousScene.metadata.videos?.display ?? null,
          webcam: previousScene.metadata.videos?.webcam as Dimensions,
          canvasSize,
          canvasLayout,
          webcamPosition: previousScene.scene.webcamPosition,
        })
      : null;

  const nextLayout =
    nextScene && nextScene.scene.type === "scene"
      ? getLayout({
          display: nextScene.metadata.videos?.display ?? null,
          webcam: nextScene.metadata.videos?.webcam as Dimensions,
          canvasSize,
          canvasLayout,
          webcamPosition: nextScene.scene.webcamPosition,
        })
      : null;

  return (
    <Sequence
      name={`Scene ${index}`}
      from={from}
      durationInFrames={Math.max(1, metadata.durationInFrames)}
    >
      <Inner
        canvasLayout={canvasLayout}
        endAt={endAt}
        pair={pair}
        shouldEnter={shouldEnter}
        shouldExit={shouldExit}
        startFrom={startFrom}
        layout={layout}
        scene={scene}
        nextLayout={nextLayout}
        previousLayout={prevLayout}
      />
    </Sequence>
  );
};
