import { interpolate } from "remotion";
import type { CanvasLayout } from "../../config/layout";
import { getSafeSpace } from "../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../config/scenes";
import type { Layout } from "../layout/layout-types";
import {
  isGrowingFromMiniature,
  isShrinkingToMiniature,
  isWebCamAtBottom,
  isWebCamRight,
} from "./webcam-transitions/helpers";

const getLandscapeDisplayExit = ({
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

const getSquareDisplayExit = ({
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

const getDisplayExit = ({
  currentScene,
  nextScene,
  width,
  height,
  canvasLayout,
}: {
  nextScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  width: number;
  height: number;
  canvasLayout: CanvasLayout;
}): Layout => {
  if (canvasLayout === "landscape") {
    return getLandscapeDisplayExit({
      currentScene,
      nextScene,
      width,
      height,
    });
  }

  if (canvasLayout === "square") {
    return getSquareDisplayExit({ currentScene, nextScene, width, height });
  }

  throw new Error("Unknown canvas layout: " + canvasLayout);
};

const getLandscapeDisplayEnter = ({
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

const getSquareDisplayEnter = ({
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

const getDisplayEnter = ({
  currentScene,
  previousScene,
  width,
  canvasLayout,
}: {
  previousScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  width: number;
  canvasLayout: CanvasLayout;
}): Layout => {
  if (canvasLayout === "landscape") {
    return getLandscapeDisplayEnter({ currentScene, previousScene, width });
  }

  if (canvasLayout === "square") {
    return getSquareDisplayEnter({ currentScene, previousScene, width });
  }

  throw new Error("Unknown canvas layout: " + canvasLayout);
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

  if (previousScene.videos.display === null) {
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
