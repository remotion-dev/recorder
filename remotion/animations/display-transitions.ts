import { interpolate } from "remotion";
import type {
  CanvasLayout,
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../config/scenes";
import type { Layout } from "../layout/layout-types";
import { safeSpace } from "../layout/safe-space";
import {
  isGrowingFromMiniature,
  isShrinkingToMiniature,
  isWebCamAtBottom,
  isWebCamRight,
} from "./webcam-transitions";

const getDisplayExit = ({
  currentScene,
  nextScene,
  width,
  canvasLayout,
  height,
}: {
  nextScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  width: number;
  height: number;
  canvasLayout: CanvasLayout;
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
    const y =
      canvasLayout === "landscape"
        ? height - currentScene.layout.displayLayout.height
        : isWebCamAtBottom(nextScene.finalWebcamPosition)
          ? height -
            nextScene.layout.webcamLayout.height -
            currentScene.layout.displayLayout.height -
            safeSpace(canvasLayout) * 2
          : nextScene.layout.webcamLayout.height + 2 * safeSpace(canvasLayout);

    if (changedVerticalPosition) {
      return {
        ...currentScene.layout.displayLayout,
        top: y,
      };
    }

    return {
      ...currentScene.layout.displayLayout,
      left: isWebCamRight(currentScene.finalWebcamPosition)
        ? -(width - safeSpace(canvasLayout) * 2)
        : width + safeSpace(canvasLayout),
      top: y,
    };
  }

  return currentScene.layout.displayLayout;
};

const getDisplayEnter = ({
  currentScene,
  previousScene,
  width,
  canvasLayout,
  height,
}: {
  previousScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  width: number;
  canvasLayout: CanvasLayout;
  height: number;
}): Layout => {
  if (
    currentScene.type !== "video-scene" ||
    currentScene.layout.displayLayout === null
  ) {
    throw new Error("no transitions on non-video scenes");
  }

  if (
    previousScene &&
    previousScene.type === "video-scene" &&
    isShrinkingToMiniature({
      firstScene: previousScene,
      secondScene: currentScene,
    })
  ) {
    const previouslyAtBottom = isWebCamAtBottom(
      previousScene.finalWebcamPosition,
    );
    const currentlyAtBottom = isWebCamAtBottom(
      currentScene.finalWebcamPosition,
    );
    const changedVerticalPosition = previouslyAtBottom !== currentlyAtBottom;

    const translationY = currentScene.layout.displayLayout.height;
    const y = isWebCamAtBottom(currentScene.finalWebcamPosition)
      ? -translationY
      : changedVerticalPosition
        ? translationY
        : height;

    // landscape, Slide in from left
    if (
      canvasLayout === "landscape" &&
      isWebCamRight(currentScene.finalWebcamPosition)
    ) {
      return {
        ...currentScene.layout.displayLayout,
        left:
          -currentScene.layout.displayLayout.width - safeSpace(canvasLayout),
        top: 0,
      };
    }

    // Slide in from right
    if (canvasLayout === "landscape") {
      return {
        ...currentScene.layout.displayLayout,
        left: width + safeSpace(canvasLayout),
        top: 0,
      };
    }

    return {
      ...currentScene.layout.displayLayout,
      top: y,
    };
  }

  const currentandPreviousAreVideoScenes =
    previousScene && previousScene.type === "video-scene";

  if (currentandPreviousAreVideoScenes) {
    return previousScene.layout.displayLayout as Layout;
  }

  return currentScene.layout.displayLayout;
};

const getDisplayTransitionOrigins = ({
  currentScene,
  nextScene,
  previousScene,
  width,
  height,
  canvasLayout,
}: {
  nextScene: SceneAndMetadata | null;
  previousScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  canvasLayout: CanvasLayout;
  width: number;
  height: number;
}) => {
  const enter = getDisplayEnter({
    currentScene,
    previousScene,
    width,
    canvasLayout,
    height,
  });

  const exit = getDisplayExit({
    currentScene,
    nextScene,
    width,
    height,
    canvasLayout,
  });

  return {
    enter,
    exit,
  };
};

const shouldTransitionDisplayVideo = ({
  previousScene,
}: {
  previousScene: SceneAndMetadata | null;
}) => {
  if (previousScene === null) {
    return false;
  }

  if (previousScene.type !== "video-scene") {
    return false;
  }

  return true;
};

export const getDisplayPosition = ({
  enterProgress: enter,
  exitProgress: exit,
  width,
  height,
  nextScene,
  previousScene,
  currentScene,
  canvasLayout,
}: {
  enterProgress: number;
  exitProgress: number;
  width: number;
  height: number;
  previousScene: SceneAndMetadata | null;
  nextScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  canvasLayout: CanvasLayout;
}): Layout => {
  if (
    currentScene.type !== "video-scene" ||
    currentScene.layout.displayLayout === null
  ) {
    throw new Error("no transitions on non-video scenes");
  }

  const { enter: enterState, exit: exitState } = getDisplayTransitionOrigins({
    currentScene,
    nextScene,
    previousScene,
    width,
    height,
    canvasLayout,
  });

  if (exit > 0) {
    // TODO: Could use interpolateStyles() here
    return {
      left: Math.round(
        interpolate(
          exit,
          [0, 1],
          [currentScene.layout.displayLayout.left, exitState.left],
        ),
      ),
      top: Math.round(
        interpolate(
          exit,
          [0, 1],
          [currentScene.layout.displayLayout.top, exitState.top],
        ),
      ),
      width: Math.round(
        interpolate(
          exit,
          [0, 1],
          [currentScene.layout.displayLayout.width, exitState.width],
        ),
      ),
      height: Math.round(
        interpolate(
          exit,
          [0, 1],
          [currentScene.layout.displayLayout.height, exitState.height],
        ),
      ),
      opacity: interpolate(
        exit,
        [0, 1],
        [currentScene.layout.displayLayout.opacity, exitState.opacity],
      ),
      borderRadius: interpolate(
        exit,
        [0, 1],
        [
          currentScene.layout.displayLayout.borderRadius,
          exitState.borderRadius,
        ],
      ),
    };
  }

  const enterX = interpolate(
    enter,
    [0, 1],
    [enterState.left, currentScene.layout.displayLayout.left],
  );
  const enterY = interpolate(
    enter,
    [0, 1],
    [enterState.top, currentScene.layout.displayLayout.top],
  );
  const enterWidth = interpolate(
    enter,
    [0, 1],
    [enterState.width, currentScene.layout.displayLayout.width],
  );
  const enterHeight = interpolate(
    enter,
    [0, 1],
    [enterState.height, currentScene.layout.displayLayout.height],
  );
  const borderRadius = interpolate(
    enter,
    [0, 1],
    [enterState.borderRadius, currentScene.layout.displayLayout.borderRadius],
  );

  return {
    left: Math.round(enterX),
    top: Math.round(enterY),
    width: enterWidth,
    height: enterHeight,
    // Switch to new video in the middle of the transition
    opacity: shouldTransitionDisplayVideo({ previousScene })
      ? enter > 0.5
        ? 1
        : 0
      : 1,
    borderRadius,
  };
};
