import { interpolate } from "remotion";
import type {
  CanvasLayout,
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../configuration";
import type { Layout } from "../layout/get-layout";
import { safeSpace } from "../layout/get-layout";
import {
  isGrowingOrShrinkingToMiniature,
  isShrinkingToMiniature,
  isWebCamAtBottom,
  isWebCamRight,
} from "./camera-scene-transitions";

const getSubtitleExit = ({
  width,
  height,
  canvasLayout,
  nextScene,
  scene,
  currentLayout,
}: {
  width: number;
  height: number;
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
        translationY: isAtBottomBefore ? -height : height,
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

    return {
      translationX: isWebcamLeft ? width : -width,
      translationY: 0,
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
    height,
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
