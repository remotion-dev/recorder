import { interpolateStyles } from "@remotion/animation-utils";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
  WebcamPosition,
} from "../../config/scenes";
import type { CanvasLayout } from "../configuration";
import type { Layout } from "../layout/layout-types";
import { safeSpace } from "../layout/safe-space";

export const isWebCamAtBottom = (webcamPosition: WebcamPosition) => {
  return webcamPosition === "bottom-left" || webcamPosition === "bottom-right";
};

export const isWebCamRight = (webcamPosition: WebcamPosition) => {
  return webcamPosition === "top-right" || webcamPosition === "bottom-right";
};

export const isGrowingFromMiniature = ({
  firstScene,
  secondScene,
}: {
  firstScene: SceneAndMetadata;
  secondScene: SceneAndMetadata;
}) => {
  if (secondScene.type !== "video-scene") {
    return false;
  }

  if (firstScene.type !== "video-scene") {
    return false;
  }

  const toMiniature =
    firstScene.layout.displayLayout !== null &&
    secondScene.layout.displayLayout === null;

  return toMiniature;
};

export const isShrinkingToMiniature = ({
  firstScene,
  secondScene,
}: {
  firstScene: SceneAndMetadata;
  secondScene: SceneAndMetadata;
}) => {
  if (secondScene.type !== "video-scene") {
    return false;
  }

  if (firstScene.type !== "video-scene") {
    return false;
  }

  return (
    firstScene.layout.displayLayout === null &&
    secondScene.layout.displayLayout !== null
  );
};

export const isGrowingOrShrinkingToMiniature = ({
  currentScene,
  otherScene,
}: {
  currentScene: VideoSceneAndMetadata;
  otherScene: SceneAndMetadata;
}) => {
  if (otherScene.type !== "video-scene") {
    return false;
  }

  return (
    isGrowingFromMiniature({
      firstScene: currentScene,
      secondScene: otherScene,
    }) ||
    isShrinkingToMiniature({
      firstScene: currentScene,
      secondScene: otherScene,
    }) ||
    isGrowingFromMiniature({
      firstScene: otherScene,
      secondScene: currentScene,
    }) ||
    isShrinkingToMiniature({
      firstScene: otherScene,
      secondScene: currentScene,
    })
  );
};

const getWebcamEndLayout = ({
  width,
  height,
  canvasLayout,
  nextScene,
  currentScene,
}: {
  nextScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  width: number;
  height: number;
  canvasLayout: CanvasLayout;
}): Layout => {
  if (!currentScene || currentScene.type !== "video-scene") {
    throw new Error("no transitions on non-video scenes");
  }

  const currentLayout = currentScene.layout.webcamLayout;

  if (!nextScene || nextScene.type !== "video-scene") {
    return currentLayout;
  }

  if (
    isGrowingOrShrinkingToMiniature({ currentScene, otherScene: nextScene })
  ) {
    return nextScene.layout.webcamLayout;
  }

  const samePositionHorizontal =
    isWebCamAtBottom(nextScene.finalWebcamPosition) ===
    isWebCamAtBottom(currentScene.finalWebcamPosition);
  const isSamePositionVertical =
    isWebCamRight(nextScene.finalWebcamPosition) ===
    isWebCamRight(currentScene.finalWebcamPosition);

  if (canvasLayout === "landscape") {
    if (!isSamePositionVertical) {
      // landscape, moving to the right
      if (isWebCamRight(currentScene.finalWebcamPosition)) {
        return {
          ...currentLayout,
          left: width,
        };
      }

      // landscape, moving to the left
      return {
        ...currentLayout,
        left: -currentLayout.width,
      };
    }

    return nextScene.layout.webcamLayout;
  }

  if (samePositionHorizontal) {
    return nextScene.layout.webcamLayout;
  }

  return {
    ...nextScene.layout.webcamLayout,
    left: currentLayout.left,
    top: isWebCamAtBottom(currentScene.finalWebcamPosition)
      ? height + safeSpace(canvasLayout)
      : -currentLayout.height - safeSpace(canvasLayout),
  };
};

const getWebCamStartLayout = ({
  width,
  height,
  canvasLayout,
  previousScene,
  currentScene,
}: {
  previousScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  width: number;
  height: number;
  canvasLayout: CanvasLayout;
}): Layout => {
  const currentLayout = currentScene.layout.webcamLayout;

  if (!previousScene || previousScene.type !== "video-scene") {
    return currentLayout;
  }

  if (
    isGrowingOrShrinkingToMiniature({ currentScene, otherScene: previousScene })
  ) {
    return previousScene.layout.webcamLayout;
  }

  const samePositionHorizontal =
    isWebCamAtBottom(previousScene.finalWebcamPosition) ===
    isWebCamAtBottom(currentScene.finalWebcamPosition);
  const isSamePositionVertical =
    isWebCamRight(previousScene.finalWebcamPosition) ===
    isWebCamRight(currentScene.finalWebcamPosition);

  if (canvasLayout === "landscape") {
    if (!isSamePositionVertical) {
      // landscape layout, flying in from the right
      if (isWebCamRight(currentScene.finalWebcamPosition)) {
        return {
          ...currentLayout,
          left: width,
        };
      }

      // landscape layout, flying in from the left
      return {
        ...currentLayout,
        left: -currentLayout.width,
      };
    }

    return previousScene.layout.webcamLayout;
  }

  // Square layout, only moving from left to right
  if (samePositionHorizontal) {
    return previousScene.layout.webcamLayout;
  }

  // Square, moving bottom up
  if (isWebCamAtBottom(currentScene.finalWebcamPosition)) {
    return {
      ...currentLayout,
      top: height + safeSpace(canvasLayout),
    };
  }

  // Square, moving top down
  return {
    ...currentLayout,
    top: -currentLayout.height - safeSpace(canvasLayout),
  };
};

const shouldTransitionWebcamVideo = ({
  previousScene,
}: {
  previousScene: SceneAndMetadata | null;
}) => {
  if (!previousScene) {
    return false;
  }

  if (previousScene.type !== "video-scene") {
    return false;
  }

  return true;
};

export const getWebcamLayout = ({
  enterProgress,
  exitProgress,
  width,
  height,
  canvasLayout,
  currentScene,
  nextScene,
  previousScene,
}: {
  enterProgress: number;
  exitProgress: number;
  width: number;
  height: number;
  canvasLayout: CanvasLayout;
  nextScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  previousScene: SceneAndMetadata | null;
}): React.CSSProperties => {
  const startLayout = getWebCamStartLayout({
    canvasLayout,
    currentScene,
    height,
    previousScene,
    width,
  });

  const endLayout = getWebcamEndLayout({
    canvasLayout,
    currentScene,
    height,
    nextScene,
    width,
  });

  if (exitProgress > 0) {
    return interpolateStyles(
      exitProgress,
      [0, 1],
      [currentScene.layout.webcamLayout, endLayout],
    );
  }

  return {
    ...interpolateStyles(
      enterProgress,
      [0, 1],
      [startLayout, currentScene.layout.webcamLayout],
    ),
    // Switch in the middle of the transition
    opacity: shouldTransitionWebcamVideo({ previousScene })
      ? enterProgress > 0.5
        ? 1
        : 0
      : 1,
  };
};
