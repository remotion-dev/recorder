import { interpolate } from "remotion";
import type {
  CanvasLayout,
  SceneAndMetadata,
  VideoSceneAndMetadata,
  WebcamPosition,
} from "../configuration";
import type { Layout } from "../layout/get-layout";
import { safeSpace } from "../layout/get-layout";

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

const getWebcamEndOffset = ({
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
    return {
      ...currentLayout,
      x: currentLayout.x - width,
    };
  }

  if (
    isGrowingOrShrinkingToMiniature({ currentScene, otherScene: nextScene })
  ) {
    const next = nextScene.layout.webcamLayout;

    return next;
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
          x: width,
        };
      }

      // landscape, moving to the left
      return {
        ...currentLayout,
        x: -currentLayout.width,
      };
    }

    if (!samePositionHorizontal) {
      return {
        ...currentLayout,
        y: nextScene.layout.webcamLayout.y,
      };
    }

    return {
      ...currentLayout,
      x: currentLayout.x - width,
    };
  }

  return {
    ...currentLayout,
    x: samePositionHorizontal
      ? nextScene.layout.webcamLayout.x
      : currentLayout.x,
    y: samePositionHorizontal
      ? currentLayout.y
      : isWebCamAtBottom(currentScene.finalWebcamPosition)
      ? height + safeSpace(canvasLayout)
      : -currentLayout.height - safeSpace(canvasLayout),
  };
};

const getWebCamStartOffset = ({
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
    return {
      ...currentLayout,
      x: currentLayout.x + width,
    };
  }

  if (
    isGrowingOrShrinkingToMiniature({ currentScene, otherScene: previousScene })
  ) {
    const prev = previousScene.layout.webcamLayout;

    return prev;
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
          x: width,
        };
      }

      // landscape layout, flying in from the left
      return {
        ...currentLayout,
        x: -currentLayout.width,
      };
    }

    if (!samePositionHorizontal) {
      return {
        ...currentLayout,
        y: previousScene.layout.webcamLayout.y,
      };
    }

    return {
      ...currentLayout,
      x: currentLayout.x + width,
    };
  }

  // Square layout, only moving from left to right
  if (samePositionHorizontal) {
    return {
      ...currentLayout,
      x: previousScene.layout.webcamLayout.x,
    };
  }

  // Square, moving bottom up
  if (isWebCamAtBottom(currentScene.finalWebcamPosition)) {
    return {
      ...currentLayout,
      y: height + safeSpace(canvasLayout),
    };
  }

  // Square, moving top down
  return {
    ...currentLayout,
    y: -currentLayout.height - safeSpace(canvasLayout),
  };
};

export const getWebcamPosition = ({
  enter,
  exit,
  width,
  height,
  canvasLayout,
  currentScene,
  nextScene,
  previousScene,
}: {
  enter: number;
  exit: number;
  width: number;
  height: number;
  canvasLayout: CanvasLayout;
  nextScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  previousScene: SceneAndMetadata | null;
}): Layout => {
  const startLayout = getWebCamStartOffset({
    canvasLayout,
    currentScene,
    height,
    previousScene,
    width,
  });

  const endLayout = getWebcamEndOffset({
    canvasLayout,
    currentScene,
    height,
    nextScene,
    width,
  });

  if (exit > 0) {
    return {
      x: interpolate(
        exit,
        [0, 1],
        [currentScene.layout.webcamLayout.x, endLayout.x],
      ),
      y: interpolate(
        exit,
        [0, 1],
        [currentScene.layout.webcamLayout.y, endLayout.y],
      ),
      borderRadius: interpolate(
        exit,
        [0, 1],
        [currentScene.layout.webcamLayout.borderRadius, endLayout.borderRadius],
      ),
      height: interpolate(
        exit,
        [0, 1],
        [currentScene.layout.webcamLayout.height, endLayout.height],
      ),
      width: interpolate(
        exit,
        [0, 1],
        [currentScene.layout.webcamLayout.width, endLayout.width],
      ),
      opacity: 1,
    };
  }

  return {
    x: interpolate(
      enter,
      [0, 1],
      [startLayout.x, currentScene.layout.webcamLayout.x],
    ),
    y: interpolate(
      enter,
      [0, 1],
      [startLayout.y, currentScene.layout.webcamLayout.y],
    ),
    borderRadius: interpolate(
      enter,
      [0, 1],
      [startLayout.borderRadius, currentScene.layout.webcamLayout.borderRadius],
    ),
    height: interpolate(
      enter,
      [0, 1],
      [startLayout.height, currentScene.layout.webcamLayout.height],
    ),
    width: interpolate(
      enter,
      [0, 1],
      [startLayout.width, currentScene.layout.webcamLayout.width],
    ),
    // Make opacity go twice as fast
    opacity:
      previousScene &&
      isGrowingOrShrinkingToMiniature({
        otherScene: previousScene,
        currentScene,
      })
        ? interpolate(enter, [0.4, 0.6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        : 1,
  };
};
