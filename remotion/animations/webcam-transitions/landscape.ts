import { getSafeSpace } from "../../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import type { Layout } from "../../layout/layout-types";
import { isWebCamRight } from "./helpers";

export const getLandscapeWebCamStartOrEndLayout = ({
  width,
  otherScene,
  currentScene,
}: {
  otherScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  width: number;
}): Layout => {
  const currentLayout = currentScene.layout.webcamLayout;

  if (!otherScene || otherScene.type !== "video-scene") {
    return currentLayout;
  }

  // When at least 1 scene is fullscreen, the webcam can just move to the new position
  if (!currentScene.layout.displayLayout || !otherScene.layout.displayLayout) {
    return otherScene.layout.webcamLayout;
  }

  // Same position vertically, webcam can just move to the new position
  if (
    isWebCamRight(otherScene.finalWebcamPosition) ===
    isWebCamRight(currentScene.finalWebcamPosition)
  ) {
    return otherScene.layout.webcamLayout;
  }

  // Display is in the way, webcam needs to animate out of the edge
  // and appear from the other side
  if (isWebCamRight(currentScene.finalWebcamPosition)) {
    return {
      ...currentLayout,
      left: width + getSafeSpace("landscape"),
    };
  }

  return {
    ...currentLayout,
    left: -getSafeSpace("landscape"),
  };
};
