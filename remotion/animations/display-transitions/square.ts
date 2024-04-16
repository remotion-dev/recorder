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

  // Assuming now: currentScene is a display video that needs to be moved in
  // the canvas because other scene had no display video

  // 1. From bottom left/right to top: Display should disappear top edge
  if (
    isWebCamAtBottom(currentScene.finalWebcamPosition) &&
    !isWebCamAtBottom(otherScene.finalWebcamPosition)
  ) {
    return {
      ...currentScene.layout.displayLayout,
      top: -currentScene.layout.displayLayout.height,
    };
  }

  // 2. From top to bottom left/right: Display should appear from bottom edge
  if (
    !isWebCamAtBottom(currentScene.finalWebcamPosition) &&
    isWebCamAtBottom(otherScene.finalWebcamPosition)
  ) {
    return {
      ...currentScene.layout.displayLayout,
      top: height,
    };
  }

  // 3. From top right to top: Should slide display to left
  if (currentScene.finalWebcamPosition === "top-right") {
    return {
      ...currentScene.layout.displayLayout,
      left: -currentScene.layout.displayLayout.width - getSafeSpace("square"),
      top: otherScene.layout.webcamLayout.height + getSafeSpace("square") * 2,
    };
  }

  // 4. From top left to top: Should slide display to right
  if (currentScene.finalWebcamPosition === "top-left") {
    return {
      ...currentScene.layout.displayLayout,
      left: width + getSafeSpace("square"),
      top: otherScene.layout.webcamLayout.height + getSafeSpace("square") * 2,
    };
  }

  // 5. From bottom left to bottom: Display should disappear to right
  if (currentScene.finalWebcamPosition === "bottom-left") {
    return {
      ...currentScene.layout.displayLayout,
      left: width + getSafeSpace("square"),
      top:
        height -
        currentScene.layout.displayLayout.height -
        otherScene.layout.webcamLayout.height -
        getSafeSpace("square") * 2,
    };
  }

  // 6. From bottom right to bottom: Display should disappear to left
  if (currentScene.finalWebcamPosition === "bottom-right") {
    return {
      ...currentScene.layout.displayLayout,
      left: -currentScene.layout.displayLayout.width - getSafeSpace("square"),
      top:
        height -
        currentScene.layout.displayLayout.height -
        otherScene.layout.webcamLayout.height -
        getSafeSpace("square") * 2,
    };
  }

  throw new Error("Unhandled case");
};
