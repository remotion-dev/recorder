import { translate } from "@remotion/animation-utils";
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
} from "../webcam-transitions";

export const getBoxedExit = ({
  nextScene,
  scene,
  currentLayout,
  width,
}: {
  nextScene: SceneAndMetadata | null;
  scene: VideoSceneAndMetadata;
  currentLayout: Layout;
  width: number;
}): string => {
  if (nextScene === null || nextScene.type !== "video-scene") {
    return translate(0, 0);
  }

  if (isGrowingFromMiniature({ firstScene: scene, secondScene: nextScene })) {
    const isLeft = !isWebCamRight(scene.finalWebcamPosition);
    const webcamTranslation =
      nextScene.layout.webcamLayout.top - scene.layout.webcamLayout.top;

    return translate(
      isLeft
        ? currentLayout.width + getSafeSpace("square")
        : -currentLayout.width - getSafeSpace("square"),
      webcamTranslation,
    );
  }

  if (isShrinkingToMiniature({ firstScene: scene, secondScene: nextScene })) {
    const isAtBottomBefore = isWebCamAtBottom(scene.finalWebcamPosition);
    const isAtBottomAfter = isWebCamAtBottom(nextScene.finalWebcamPosition);
    if (isAtBottomBefore === isAtBottomAfter) {
      // Display can cover the subtitles
      return translate(0, 0);
    }

    return translate(
      0,
      isAtBottomBefore
        ? -currentLayout.height - getSafeSpace("square")
        : currentLayout.height + getSafeSpace("square"),
    );
  }

  const isSamePositionVertical =
    isWebCamRight(nextScene.finalWebcamPosition) ===
    isWebCamRight(scene.finalWebcamPosition);

  const isSamePositionHorizontal =
    isWebCamAtBottom(nextScene.finalWebcamPosition) ===
    isWebCamAtBottom(scene.finalWebcamPosition);

  const hasDisplay = scene.layout.displayLayout;
  if (!isSamePositionHorizontal && hasDisplay) {
    if (isWebCamAtBottom(scene.finalWebcamPosition)) {
      return translate(0, currentLayout.height + getSafeSpace("square"));
    }

    return translate(0, -currentLayout.height - getSafeSpace("square"));
  }

  if (!isSamePositionHorizontal) {
    return translate(
      0,
      isWebCamAtBottom(scene.finalWebcamPosition)
        ? -(currentLayout.height + getSafeSpace("square"))
        : currentLayout.height + getSafeSpace("square"),
    );
  }

  if (!isSamePositionVertical) {
    return translate(
      isWebCamRight(scene.finalWebcamPosition) ? -width : width,
      0,
    );
  }

  return translate(0, 0);
};

export const getBoxedEnter = ({
  currentLayout,
  scene,
  height,
  previousScene,
  width,
}: {
  previousScene: SceneAndMetadata | null;
  scene: VideoSceneAndMetadata;
  width: number;
  height: number;
  currentLayout: Layout;
}): string => {
  if (
    previousScene &&
    previousScene.type === "video-scene" &&
    isShrinkingToMiniature({
      firstScene: previousScene,
      secondScene: scene,
    })
  ) {
    const isWebcamLeft = !isWebCamRight(scene.finalWebcamPosition);
    const atBottom = isWebCamAtBottom(scene.finalWebcamPosition);
    const transX = currentLayout.width + getSafeSpace("square");
    const transY = height - currentLayout.height - getSafeSpace("square") * 2;
    const previousAtBottom = isWebCamAtBottom(
      previousScene.finalWebcamPosition,
    );
    const changedVerticalPosition = atBottom !== previousAtBottom;

    return translate(
      isWebcamLeft ? transX : -transX,
      changedVerticalPosition ? (atBottom ? -transY : transY) : 0,
    );
  }

  if (
    previousScene &&
    previousScene.type === "video-scene" &&
    isGrowingFromMiniature({
      firstScene: previousScene,
      secondScene: scene,
    })
  ) {
    const heightDifference =
      scene.layout.webcamLayout.height -
      previousScene.layout.webcamLayout.height;

    const previouslyAtBottom = isWebCamAtBottom(
      previousScene.finalWebcamPosition,
    );
    const currentlyAtBottom = isWebCamAtBottom(scene.finalWebcamPosition);
    const changedVerticalPosition = previouslyAtBottom !== currentlyAtBottom;

    if (changedVerticalPosition) {
      return translate(
        0,
        currentlyAtBottom
          ? -currentLayout.height - getSafeSpace("square")
          : currentLayout.height + getSafeSpace("square"),
      );
    }

    return translate(
      isWebCamRight(previousScene.finalWebcamPosition) ? width : -width,
      currentlyAtBottom ? heightDifference : -heightDifference,
    );
  }

  if (previousScene === null || previousScene.type !== "video-scene") {
    return translate(0, 0);
  }

  const isSamePositionVertical =
    isWebCamRight(previousScene.finalWebcamPosition) ===
    isWebCamRight(scene.finalWebcamPosition);
  const isSamePositionHorizontal =
    isWebCamAtBottom(previousScene.finalWebcamPosition) ===
    isWebCamAtBottom(scene.finalWebcamPosition);

  const hasDisplay = scene.layout.displayLayout;
  if (!isSamePositionHorizontal && hasDisplay) {
    if (isWebCamAtBottom(scene.finalWebcamPosition)) {
      return translate(0, currentLayout.height + getSafeSpace("square"));
    }

    return translate(0, -currentLayout.height - getSafeSpace("square"));
  }

  if (!isSamePositionHorizontal) {
    return translate(
      0,
      isWebCamAtBottom(scene.finalWebcamPosition)
        ? -currentLayout.height - getSafeSpace("square") // subtitles above webcam
        : currentLayout.height + getSafeSpace("square"), // subtitles below webcam
    );
  }

  if (!isSamePositionVertical) {
    return translate(
      isWebCamRight(scene.finalWebcamPosition) ? -width : width,
      0,
    );
  }

  return translate(0, 0);
};
