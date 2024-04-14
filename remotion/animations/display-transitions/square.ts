import { getSafeSpace } from "../../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import type { Layout } from "../../layout/layout-types";
import {
  isGrowingFromMiniature,
  isShrinkingToMiniature,
  isWebCamAtBottom,
  isWebCamRight,
} from "../webcam-transitions/helpers";

export const getSquareDisplayEnter = ({
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
    if (isWebCamAtBottom(previousScene.finalWebcamPosition)) {
      return {
        ...currentScene.layout.displayLayout,
        top: -currentScene.layout.displayLayout.height,
      };
    }

    const samePositionHorizontal =
      isWebCamAtBottom(previousScene.finalWebcamPosition) ===
      isWebCamAtBottom(currentScene.finalWebcamPosition);

    if (samePositionHorizontal) {
      return {
        ...currentScene.layout.displayLayout,
        left: width,
      };
    }

    return {
      ...currentScene.layout.displayLayout,
      top: currentScene.layout.displayLayout.height,
    };
  }

  return currentScene.layout.displayLayout;
};

export const getSquareDisplayExit = ({
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

  const nextAndCurrentAreVideoScenes =
    nextScene &&
    nextScene.type === "video-scene" &&
    nextScene.layout.displayLayout !== null;

  if (nextAndCurrentAreVideoScenes) {
    return nextScene.layout.displayLayout as Layout;
  }

  if (
    nextScene &&
    isGrowingFromMiniature({ firstScene: currentScene, secondScene: nextScene })
  ) {
    if (nextScene.type !== "video-scene") {
      throw new Error("no transitions on non-video scenes");
    }

    const previouslyAtBottom = isWebCamAtBottom(
      currentScene.finalWebcamPosition,
    );
    const currentlyAtBottom = isWebCamAtBottom(nextScene.finalWebcamPosition);
    const changedVerticalPosition = previouslyAtBottom !== currentlyAtBottom;
    const y = isWebCamAtBottom(nextScene.finalWebcamPosition)
      ? height -
        nextScene.layout.webcamLayout.height -
        currentScene.layout.displayLayout.height -
        getSafeSpace("square") * 2
      : nextScene.layout.webcamLayout.height + 2 * getSafeSpace("square");

    if (changedVerticalPosition) {
      return {
        ...currentScene.layout.displayLayout,
        top: y,
      };
    }

    return {
      ...currentScene.layout.displayLayout,
      left: isWebCamRight(currentScene.finalWebcamPosition)
        ? -(width - getSafeSpace("square") * 2)
        : width + getSafeSpace("square"),
      top: y,
    };
  }

  return currentScene.layout.displayLayout;
};
