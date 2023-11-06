import React from "react";
import {
  OffthreadVideo,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { getWebcamTranslation } from "./animations/camera-scene-transitions";
import type { CanvasLayout, Pair, SceneAndMetadata } from "./configuration";
import { transitionDuration } from "./configuration";
import type { Layout } from "./layout/get-layout";

export const WebcamVideo: React.FC<{
  webcamLayout: Layout;
  enter: number;
  exit: number;
  startFrom: number;
  endAt: number | undefined;
  pair: Pair;
  zoomInAtStart: boolean;
  zoomInAtEnd: boolean;
  shouldExit: boolean;
  canvasLayout: CanvasLayout;
  nextScene: SceneAndMetadata | null;
  previousScene: SceneAndMetadata | null;
  currentScene: SceneAndMetadata;
}> = ({
  webcamLayout,
  enter,
  exit,
  zoomInAtStart,
  zoomInAtEnd,
  startFrom,
  endAt,
  pair,
  nextScene,
  previousScene,
  shouldExit,
  canvasLayout,
  currentScene,
}) => {
  const { height, width, fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const zoomIn = zoomInAtEnd
    ? spring({
        fps,
        frame,
        config: { damping: 200 },
        durationInFrames: 10,
        delay: durationInFrames - 15 - (shouldExit ? transitionDuration : 0),
      })
    : zoomInAtStart
    ? spring({
        fps,
        frame,
        config: {
          damping: 200,
        },
        durationInFrames: 10,
      })
    : 0;

  const webcamTranslation = getWebcamTranslation({
    enter,
    exit,
    height,
    width,
    currentScene,
    nextScene,
    previousScene,
    canvasLayout,
  });

  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
      }}
    >
      <div
        style={{
          borderRadius: webcamLayout.borderRadius,
          overflow: "hidden",
          width: webcamLayout.width,
          height: webcamLayout.height,
          left: webcamLayout.x,
          top: webcamLayout.y,
          position: "relative",
          translate: `${webcamTranslation.translationX}px ${webcamTranslation.translationY}px`,
        }}
      >
        <OffthreadVideo
          startFrom={startFrom}
          endAt={endAt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            borderRadius: webcamLayout.borderRadius,
            overflow: "hidden",
            transformOrigin: "50% 0%",
            scale: String(zoomIn * 0.4 + 1),
          }}
          src={pair.webcam.src}
        />
      </div>
    </div>
  );
};
