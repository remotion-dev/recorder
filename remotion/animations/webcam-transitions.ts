import { interpolateStyles } from "@remotion/animation-utils";
import type { CanvasLayout } from "../../config/layout";
import { getSafeSpace } from "../../config/layout";
import type {
  FinalWebcamPosition,
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../config/scenes";
import type { Layout } from "../layout/layout-types";

export const isWebCamAtBottom = (webcamPosition: FinalWebcamPosition) => {
  if (webcamPosition === "center") {
    throw new Error("Webcam position cannot be center if checking at bottom");
  }

  return webcamPosition === "bottom-left" || webcamPosition === "bottom-right";
};

export const isWebCamRight = (webcamPosition: FinalWebcamPosition) => {
  if (webcamPosition === "center") {
    throw new Error("Webcam position cannot be center if checking at right");
  }

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

const getLandscapeWebcamEndLayout = ({
  width,
  nextScene,
  currentScene,
}: {
  nextScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  width: number;
}): Layout => {
  if (!currentScene || currentScene.type !== "video-scene") {
    throw new Error("no transitions on non-video scenes");
  }

  const currentLayout = currentScene.layout.webcamLayout;

  if (!nextScene || nextScene.type !== "video-scene") {
    return currentLayout;
  }

  if (
    isGrowingFromMiniature({
      firstScene: currentScene,
      secondScene: nextScene,
    }) ||
    isShrinkingToMiniature({ firstScene: currentScene, secondScene: nextScene })
  ) {
    return nextScene.layout.webcamLayout;
  }

  if (currentScene.finalWebcamPosition === "center") {
    return currentLayout;
  }

  const isSamePositionVertical =
    isWebCamRight(nextScene.finalWebcamPosition) ===
    isWebCamRight(currentScene.finalWebcamPosition);

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
};

const getSquareWebcamEndLayout = ({
  nextScene,
  currentScene,
  height,
}: {
  nextScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  height: number;
}): Layout => {
  if (!currentScene || currentScene.type !== "video-scene") {
    throw new Error("no transitions on non-video scenes");
  }

  const currentLayout = currentScene.layout.webcamLayout;

  if (!nextScene || nextScene.type !== "video-scene") {
    return currentLayout;
  }

  if (
    isGrowingFromMiniature({
      firstScene: currentScene,
      secondScene: nextScene,
    }) ||
    isShrinkingToMiniature({ firstScene: currentScene, secondScene: nextScene })
  ) {
    return nextScene.layout.webcamLayout;
  }

  if (currentScene.finalWebcamPosition === "center") {
    return currentLayout;
  }

  const samePositionHorizontal =
    isWebCamAtBottom(nextScene.finalWebcamPosition) ===
    isWebCamAtBottom(currentScene.finalWebcamPosition);

  const currentSubsBoxHeight = currentScene.layout.subLayout.height;

  if (samePositionHorizontal) {
    return nextScene.layout.webcamLayout;
  }

  const hasDisplay = currentScene.layout.displayLayout;
  // vertical and horizontal changes
  if (hasDisplay) {
    if (isWebCamAtBottom(currentScene.finalWebcamPosition)) {
      return {
        ...currentLayout,
        top: height,
      };
    }

    return {
      ...currentLayout,
      top: -currentLayout.height + getSafeSpace("square"),
    };
  }

  // webcam moving from bottom to top (moving distance = height of the current subs box)
  if (isWebCamAtBottom(currentScene.finalWebcamPosition)) {
    return {
      ...nextScene.layout.webcamLayout,
      top: getSafeSpace("square"),
    };
  }

  // webcam moving from top to bottom (moving distance = height of the current subs box)
  return {
    ...nextScene.layout.webcamLayout,
    left: currentLayout.left,
    top: currentSubsBoxHeight + 2 * getSafeSpace("square"),
  };
};

const getWebcamEndLayout = ({
  width,
  canvasLayout,
  nextScene,
  currentScene,
  height,
}: {
  nextScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  width: number;
  height: number;
  canvasLayout: CanvasLayout;
}): Layout => {
  if (canvasLayout === "landscape") {
    return getLandscapeWebcamEndLayout({
      currentScene,
      nextScene,
      width,
    });
  }

  if (canvasLayout === "square") {
    return getSquareWebcamEndLayout({
      currentScene,
      height,
      nextScene,
    });
  }

  throw new Error(`Unknown canvas layout: ${canvasLayout}`);
};

const getLandscapeWebCamStartLayout = ({
  width,
  previousScene,
  currentScene,
}: {
  previousScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  width: number;
}): Layout => {
  const currentLayout = currentScene.layout.webcamLayout;

  if (!previousScene || previousScene.type !== "video-scene") {
    return currentLayout;
  }

  if (
    isGrowingFromMiniature({
      firstScene: previousScene,
      secondScene: currentScene,
    }) ||
    isShrinkingToMiniature({
      firstScene: previousScene,
      secondScene: currentScene,
    })
  ) {
    return previousScene.layout.webcamLayout;
  }

  if (currentScene.finalWebcamPosition === "center") {
    return currentLayout;
  }

  const isSamePositionVertical =
    isWebCamRight(previousScene.finalWebcamPosition) ===
    isWebCamRight(currentScene.finalWebcamPosition);

  if (isSamePositionVertical) {
    return previousScene.layout.webcamLayout;
  }

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
};

const getSquareWebCamStartLayout = ({
  height,
  previousScene,
  currentScene,
}: {
  previousScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  height: number;
}): Layout => {
  const currentLayout = currentScene.layout.webcamLayout;

  if (!previousScene || previousScene.type !== "video-scene") {
    return currentLayout;
  }

  if (
    isGrowingFromMiniature({
      firstScene: previousScene,
      secondScene: currentScene,
    }) ||
    isShrinkingToMiniature({
      firstScene: previousScene,
      secondScene: currentScene,
    })
  ) {
    return previousScene.layout.webcamLayout;
  }

  if (currentScene.finalWebcamPosition === "center") {
    return currentLayout;
  }

  const samePositionHorizontal =
    isWebCamAtBottom(previousScene.finalWebcamPosition) ===
    isWebCamAtBottom(currentScene.finalWebcamPosition);

  const currentSubsBoxHeight = currentScene.layout.subLayout.height;

  // Square layout, only moving from left to right
  if (samePositionHorizontal) {
    return previousScene.layout.webcamLayout;
  }

  // vertical and horizontal changes
  // Square, moving bottom up
  const hasDisplay = currentScene.layout.displayLayout;

  if (hasDisplay) {
    if (isWebCamAtBottom(currentScene.finalWebcamPosition)) {
      return {
        ...currentLayout,
        top: height,
      };
    }

    return {
      ...currentLayout,
      top: -currentSubsBoxHeight - getSafeSpace("square"),
    };
  }

  // Square layout, webcam moving top to bottom
  if (isWebCamAtBottom(currentScene.finalWebcamPosition)) {
    return {
      ...currentLayout,
      top: -currentSubsBoxHeight - getSafeSpace("square"),
    };
  }

  // Square layout, webcam moving top to bottom
  if (isWebCamAtBottom(currentScene.finalWebcamPosition)) {
    return {
      ...currentLayout,
      top: getSafeSpace("square"),
    };
  }

  // Square layout, webcam moving bottom to top
  return {
    ...currentLayout,
    top: currentSubsBoxHeight + getSafeSpace("square"),
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
  if (canvasLayout === "landscape") {
    return getLandscapeWebCamStartLayout({
      currentScene,
      previousScene,
      width,
    });
  }

  if (canvasLayout === "square") {
    return getSquareWebCamStartLayout({
      currentScene,
      height,
      previousScene,
    });
  }

  throw new Error(`Unknown canvas layout: ${canvasLayout}`);
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
    previousScene,
    width,
    height,
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
