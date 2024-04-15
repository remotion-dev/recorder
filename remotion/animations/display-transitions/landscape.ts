import { getSafeSpace } from "../../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import type { Layout } from "../../layout/layout-types";
import {
  isShrinkingToMiniature,
  isWebCamRight,
} from "../webcam-transitions/helpers";

export const getLandscapeDisplayExit = ({
  currentScene,
  nextScene,
  width,
  height,
}: {
  nextScene: SceneAndMetadata | null;
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

  if (!nextScene || nextScene.type !== "video-scene") {
    return currentScene.layout.displayLayout;
  }

  // Next scene also has a display layout, just move it there
  if (nextScene.layout.displayLayout !== null) {
    return nextScene.layout.displayLayout;
  }

  // Next scene has no display
  // The webcam will zoom in to fullscreen, the display
  // needs to move out of the way
  const y = height - currentScene.layout.displayLayout.height;

  return {
    ...currentScene.layout.displayLayout,
    left: isWebCamRight(currentScene.finalWebcamPosition)
      ? -(width - getSafeSpace("landscape") * 2)
      : width + getSafeSpace("landscape"),
    top: y,
  };
};

export const getLandscapeDisplayEnter = ({
  currentScene,
  previousScene,
  width,
}: {
  previousScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  width: number;
}): Layout => {
  if (
    currentScene.type !== "video-scene" ||
    currentScene.layout.displayLayout === null
  ) {
    throw new Error("no transitions on non-video scenes");
  }

  if (previousScene === null || previousScene.type !== "video-scene") {
    return currentScene.layout.displayLayout;
  }

  if (
    isShrinkingToMiniature({
      firstScene: previousScene,
      secondScene: currentScene,
    })
  ) {
    // landscape, Slide in from left
    if (isWebCamRight(currentScene.finalWebcamPosition)) {
      return {
        ...currentScene.layout.displayLayout,
        left:
          -currentScene.layout.displayLayout.width - getSafeSpace("landscape"),
        top: 0,
      };
    }

    // landscape, Slide in from right
    return {
      ...currentScene.layout.displayLayout,
      left: width + getSafeSpace("landscape"),
      top: 0,
    };
  }

  return currentScene.layout.displayLayout;
};
