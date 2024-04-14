import { getSafeSpace } from "../../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import type { Layout } from "../../layout/layout-types";
import { isWebCamAtBottom } from "./helpers";

export const getSquareWebcamStartOrEndLayout = ({
  otherScene,
  currentScene,
  height,
}: {
  otherScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  height: number;
}): Layout => {
  if (!currentScene || currentScene.type !== "video-scene") {
    throw new Error("no transitions on non-video scenes");
  }

  const currentLayout = currentScene.layout.webcamLayout;

  // No entrance if the other scene is not a video scene
  if (!otherScene || otherScene.type !== "video-scene") {
    return currentScene.layout.webcamLayout;
  }

  // When at least 1 scene is fullscreen, the webcam can just move to the new position
  if (!currentScene.layout.displayLayout || !otherScene.layout.displayLayout) {
    return otherScene.layout.webcamLayout;
  }

  // Same position horizontally, webcam can just move to the new position
  if (
    isWebCamAtBottom(otherScene.finalWebcamPosition) ===
    isWebCamAtBottom(currentScene.finalWebcamPosition)
  ) {
    return otherScene.layout.webcamLayout;
  }

  // Display is moving from bottom to top or vice versa
  // Webcam will animate out of the edge and appear from the other side
  if (isWebCamAtBottom(currentScene.finalWebcamPosition)) {
    return {
      ...currentLayout,
      top: height + getSafeSpace("square"),
    };
  }

  return {
    ...currentLayout,
    top: -getSafeSpace("square"),
  };
};
