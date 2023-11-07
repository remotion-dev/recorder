import { interpolate } from "remotion";
import type {
  CanvasLayout,
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../configuration";
import type { Layout } from "../layout/get-layout";
import { safeSpace } from "../layout/get-layout";
import {
  isGrowingFromMiniature,
  isGrowingOrShrinkingToMiniature,
  isShrinkingToMiniature,
  isWebCamAtBottom,
  isWebCamRight,
} from "./camera-scene-transitions";

const getSubtitleExit = ({
  width,
  canvasLayout,
  nextScene,
  scene,
  currentLayout,
}: {
  width: number;
  canvasLayout: CanvasLayout;
  scene: VideoSceneAndMetadata;
  nextScene: SceneAndMetadata | null;
  currentLayout: Layout;
}) => {
  if (nextScene === null || nextScene.type !== "video-scene") {
    return {
      translationX: -width,
      translationY: 0,
    };
  }

  if (
    nextScene &&
    isGrowingOrShrinkingToMiniature({
      currentScene: scene,
      otherScene: nextScene,
    })
  ) {
    if (isGrowingFromMiniature({ firstScene: scene, secondScene: nextScene })) {
      const isLeft = !isWebCamRight(scene.finalWebcamPosition);
      const webcamTranslation =
        nextScene.layout.webcamLayout.y - scene.layout.webcamLayout.y;
      return {
        translationX: isLeft
          ? currentLayout.width + safeSpace(canvasLayout)
          : -currentLayout.width - safeSpace(canvasLayout),
        translationY: webcamTranslation,
      };
    }

    if (isShrinkingToMiniature({ firstScene: scene, secondScene: nextScene })) {
      const isAtBottomBefore = isWebCamAtBottom(scene.finalWebcamPosition);
      const isAtBottomAfter = isWebCamAtBottom(nextScene.finalWebcamPosition);
      if (isAtBottomBefore === isAtBottomAfter) {
        // Display can cover the subtitles
        return {
          translationX: 0,
          translationY: 0,
        };
      }

      return {
        translationX: 0,
        translationY: isAtBottomBefore
          ? -currentLayout.height - safeSpace(canvasLayout)
          : currentLayout.height + safeSpace(canvasLayout),
      };
    }

    return {
      translationX: 0,
      translationY: 0,
    };
  }

  if (scene.type !== "video-scene") {
    throw new Error("no subtitles on non-video scenes");
  }

  const isSamePositionVertical =
    isWebCamRight(nextScene.finalWebcamPosition) ===
    isWebCamRight(scene.finalWebcamPosition);
  const isSamePositionHorizontal =
    isWebCamAtBottom(nextScene.finalWebcamPosition) ===
    isWebCamAtBottom(scene.finalWebcamPosition);

  if (!isSamePositionHorizontal && canvasLayout === "square") {
    return {
      translationX: 0,
      translationY: isWebCamAtBottom(scene.finalWebcamPosition)
        ? currentLayout.height + safeSpace(canvasLayout)
        : -(currentLayout.height + safeSpace(canvasLayout) * 2),
    };
  }

  if (!isSamePositionVertical && canvasLayout === "square") {
    return {
      translationX: isWebCamRight(scene.finalWebcamPosition) ? -width : width,
      translationY: 0,
    };
  }

  return { translationX: 0, translationY: 0 };
};

const getSubtitleEnter = ({
  width,
  height,
  canvasLayout,
  currentScene,
  previousScene,
  currentLayout,
}: {
  width: number;
  height: number;
  currentScene: SceneAndMetadata;
  canvasLayout: CanvasLayout;
  previousScene: SceneAndMetadata | null;
  currentLayout: Layout;
}) => {
  if (currentScene.type !== "video-scene") {
    throw new Error("no subtitles on non-video scenes");
  }

  if (
    previousScene &&
    previousScene.type === "video-scene" &&
    isShrinkingToMiniature({
      firstScene: previousScene,
      secondScene: currentScene,
    })
  ) {
    const isWebcamLeft = !isWebCamRight(currentScene.finalWebcamPosition);
    const atBottom = isWebCamAtBottom(currentScene.finalWebcamPosition);

    const transX = currentLayout.width + safeSpace(canvasLayout);
    const transY = height - currentLayout.height - safeSpace(canvasLayout) * 2;

    const previousAtBottom = isWebCamAtBottom(
      previousScene.finalWebcamPosition,
    );
    const changedVerticalPosition = atBottom !== previousAtBottom;

    return {
      translationX: isWebcamLeft ? transX : -transX,
      translationY: changedVerticalPosition ? (atBottom ? -transY : transY) : 0,
    };
  }

  if (
    previousScene &&
    previousScene.type === "video-scene" &&
    isGrowingFromMiniature({
      firstScene: previousScene,
      secondScene: currentScene,
    })
  ) {
    const heightDifference =
      currentScene.layout.webcamLayout.height -
      previousScene.layout.webcamLayout.height;

    const previouslyAtBottom = isWebCamAtBottom(
      previousScene.finalWebcamPosition,
    );
    const currentlyAtBottom = isWebCamAtBottom(
      currentScene.finalWebcamPosition,
    );
    const changedVerticalPosition = previouslyAtBottom !== currentlyAtBottom;

    if (changedVerticalPosition) {
      return {
        translationX: 0,
        translationY: currentlyAtBottom
          ? -currentLayout.height - safeSpace(canvasLayout)
          : currentLayout.height + safeSpace(canvasLayout),
      };
    }

    return {
      translationX: isWebCamRight(currentScene.finalWebcamPosition)
        ? width
        : -width,
      translationY: currentlyAtBottom ? heightDifference : -heightDifference,
    };
  }

  if (previousScene === null || previousScene.type !== "video-scene") {
    if (canvasLayout === "wide") {
      return {
        translationX: 0,
        translationY: height,
      };
    }

    if (canvasLayout === "square" || canvasLayout === "tall") {
      return {
        translationX: width,
        translationY: 0,
      };
    }

    throw new Error("Invalid canvas layout");
  }

  const isSamePositionVertical =
    isWebCamRight(previousScene.finalWebcamPosition) ===
    isWebCamRight(currentScene.finalWebcamPosition);
  const isSamePositionHorizontal =
    isWebCamAtBottom(previousScene.finalWebcamPosition) ===
    isWebCamAtBottom(currentScene.finalWebcamPosition);

  if (
    !isSamePositionHorizontal &&
    (canvasLayout === "square" || canvasLayout === "tall")
  ) {
    return {
      translationX: 0,
      translationY: isWebCamAtBottom(currentScene.finalWebcamPosition)
        ? currentLayout.height + safeSpace(canvasLayout)
        : -(currentLayout.height + safeSpace(canvasLayout) * 2),
    };
  }

  if (
    !isSamePositionVertical &&
    (canvasLayout === "square" || canvasLayout === "tall")
  ) {
    return {
      translationX: isWebCamRight(currentScene.finalWebcamPosition)
        ? -width
        : width,
      translationY: 0,
    };
  }

  return { translationX: 0, translationY: 0 };
};

export const getSubtitleTranslation = ({
  enter,
  exit,
  width,
  height,
  canvasLayout,
  nextScene,
  previousScene,
  scene,
  currentLayout,
}: {
  enter: number;
  exit: number;
  width: number;
  height: number;
  canvasLayout: CanvasLayout;
  scene: VideoSceneAndMetadata;
  previousScene: SceneAndMetadata | null;
  nextScene: SceneAndMetadata | null;
  currentLayout: Layout;
}): Layout => {
  const _enter = getSubtitleEnter({
    canvasLayout,
    height,
    width,
    currentScene: scene,
    previousScene,
    currentLayout,
  });

  const _exit = getSubtitleExit({
    canvasLayout,
    width,
    nextScene,
    scene,
    currentLayout,
  });

  if (exit > 0) {
    return {
      ...currentLayout,
      x: interpolate(
        exit,
        [0, 1],
        [currentLayout.x, currentLayout.x + _exit.translationX],
      ),
      y: interpolate(
        exit,
        [0, 1],
        [currentLayout.y, currentLayout.y + _exit.translationY],
      ),
    };
  }

  return {
    ...currentLayout,
    x: interpolate(
      enter,
      [0, 1],
      [currentLayout.x + _enter.translationX, currentLayout.x],
    ),
    y: interpolate(
      enter,
      [0, 1],
      [currentLayout.y + _enter.translationY, currentLayout.y],
    ),
  };
};
