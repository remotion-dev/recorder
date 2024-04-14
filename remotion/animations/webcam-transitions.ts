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

const getSquareWebcamStartOrEndLayout = ({
  otherScene,
  currentScene,
  height,
}: {
  otherScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  height: number;
}): Layout => {
  if (!currentScene || currentScene.type !== "video-scene") {
    throw new Error("no transitions on non-video scenes");
  }

  const currentLayout = currentScene.layout.webcamLayout;

  // No entrance if the other scene is not a video scene
  if (!otherScene || otherScene.type !== "video-scene") {
    return currentScene.layout.webcamLayout;
  }

  // When at least 1 scene is fullscreen, the webcam can just move to the new position
  if (!currentScene.layout.displayLayout || !otherScene.layout.displayLayout) {
    return otherScene.layout.webcamLayout;
  }

  // Same position horizontally, webcam can just move to the new position
  if (
    isWebCamAtBottom(otherScene.finalWebcamPosition) ===
    isWebCamAtBottom(currentScene.finalWebcamPosition)
  ) {
    return otherScene.layout.webcamLayout;
  }

  // Display is moving from bottom to top or vice versa
  // Webcam will animate out of the edge and appear from the other side
  if (isWebCamAtBottom(currentScene.finalWebcamPosition)) {
    return {
      ...currentLayout,
      top: height + getSafeSpace("square"),
    };
  }

  return {
    ...currentLayout,
    top: -getSafeSpace("square"),
  };
};

const getLandscapeWebCamStartOrEndLayout = ({
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
    return getLandscapeWebCamStartOrEndLayout({
      currentScene,
      otherScene: nextScene,
      width,
    });
  }

  if (canvasLayout === "square") {
    return getSquareWebcamStartOrEndLayout({
      currentScene,
      height,
      otherScene: nextScene,
    });
  }

  throw new Error(`Unknown canvas layout: ${canvasLayout}`);
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
    return getLandscapeWebCamStartOrEndLayout({
      currentScene,
      otherScene: previousScene,
      width,
    });
  }

  if (canvasLayout === "square") {
    return getSquareWebcamStartOrEndLayout({
      currentScene,
      height,
      otherScene: previousScene,
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
