import { getSafeSpace } from "../../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import type { Layout } from "../../layout/layout-types";
import {
  isShrinkingToMiniature,
  isWebCamAtBottom,
} from "../webcam-transitions/helpers";

export const getSquareDisplayEnterOrExit = ({
  currentScene,
  otherScene,
  height,
  width,
}: {
  otherScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  width: number;
  height: number;
}): Layout => {
  if (
    currentScene.type !== "video-scene" ||
    currentScene.layout.displayLayout === null
  ) {
    throw new Error("no transitions on non-video scenes");
  }

  if (otherScene === null || otherScene.type !== "video-scene") {
    return currentScene.layout.displayLayout;
  }

  if (
    !isShrinkingToMiniature({
      firstScene: otherScene,
      secondScene: currentScene,
    })
  ) {
    return currentScene.layout.displayLayout;
  }

  if (isWebCamAtBottom(otherScene.finalWebcamPosition)) {
    return {
      ...currentScene.layout.displayLayout,
      top: -currentScene.layout.displayLayout.height - getSafeSpace("square"),
    };
  }

  return {
    ...currentScene.layout.displayLayout,
    top: height + getSafeSpace("square"),
    // TODO: Animation is also dependent on the video width
    left: width + getSafeSpace("square"),
  };
};
