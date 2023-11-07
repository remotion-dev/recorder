import React from "react";
import { OffthreadVideo, useVideoConfig } from "remotion";
import { getWebcamPosition } from "./animations/camera-scene-transitions";
import type {
  CanvasLayout,
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "./configuration";
import type { Layout } from "./layout/get-layout";

export const WebcamVideo: React.FC<{
  webcamLayout: Layout;
  enter: number;
  exit: number;
  startFrom: number;
  endAt: number | undefined;
  canvasLayout: CanvasLayout;
  nextScene: SceneAndMetadata | null;
  previousScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
}> = ({
  webcamLayout,
  enter,
  exit,
  startFrom,
  endAt,
  nextScene,
  previousScene,
  canvasLayout,
  currentScene,
}) => {
  const { height, width } = useVideoConfig();

  const webcamLayoutWithTransitions = getWebcamPosition({
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
          borderRadius: webcamLayoutWithTransitions.borderRadius,
          overflow: "hidden",
          width: webcamLayoutWithTransitions.width,
          height: webcamLayoutWithTransitions.height,
          left: webcamLayoutWithTransitions.x,
          top: webcamLayoutWithTransitions.y,
          position: "relative",
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
          }}
          src={currentScene.pair.webcam.src}
        />
      </div>
    </div>
  );
};
