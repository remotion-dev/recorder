import React from "react";
import { OffthreadVideo, useVideoConfig } from "remotion";
import type { CanvasLayout } from "../../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import { getWebcamLayout } from "../../animations/webcam-transitions";
import type { Layout } from "../../layout/layout-types";

export const Webcam: React.FC<{
  webcamLayout: Layout;
  enterProgress: number;
  exitProgress: number;
  startFrom: number;
  endAt: number | undefined;
  canvasLayout: CanvasLayout;
  nextScene: SceneAndMetadata | null;
  previousScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
}> = ({
  webcamLayout,
  enterProgress,
  exitProgress,
  startFrom,
  endAt,
  nextScene,
  previousScene,
  canvasLayout,
  currentScene,
}) => {
  const { height, width } = useVideoConfig();

  const webcamLayoutWithTransitions = getWebcamLayout({
    enterProgress,
    exitProgress,
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
          overflow: "hidden",
          position: "relative",
          ...webcamLayoutWithTransitions,
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
