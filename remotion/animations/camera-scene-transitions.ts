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

const getDisplayExit = ({
  currentScene,
  nextScene,
  width,
}: {
  nextScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  width: number;
}) => {
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
    return {
      exitEndX: (nextScene.layout.displayLayout as Layout).x,
      exitEndY: (nextScene.layout.displayLayout as Layout).y,
    };
  }

  return {
    exitEndX: currentScene.layout.displayLayout.x - width,
    exitEndY: currentScene.layout.displayLayout.y,
  };
};

const getDisplayEnter = ({
  currentScene,
  previousScene,
  width,
  height,
}: {
  previousScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  width: number;
  height: number;
}) => {
  if (
    currentScene.type !== "video-scene" ||
    currentScene.layout.displayLayout === null
  ) {
    throw new Error("no transitions on non-video scenes");
  }

  const currentandPreviousAreVideoScenes =
    previousScene && previousScene.type === "video-scene";

  if (currentandPreviousAreVideoScenes) {
    if (
      isShrinkingToMiniature({
        firstScene: previousScene,
        secondScene: currentScene,
      })
    ) {
      const y = isWebCamAtBottom(currentScene.finalWebcamPosition)
        ? -height
        : height;
      return {
        enterStartX: (currentScene.layout.displayLayout as Layout).x,
        enterStartY: y,
      };
    }

    return {
      enterStartX: (previousScene.layout.displayLayout as Layout).x,
      enterStartY: (previousScene.layout.displayLayout as Layout).y,
    };
  }

  return {
    enterStartX: currentScene.layout.displayLayout.x + width,
    enterStartY: currentScene.layout.displayLayout.y,
  };
};

const getDisplayTransitionOrigins = ({
  currentScene,
  nextScene,
  previousScene,
  width,
  height,
}: {
  nextScene: SceneAndMetadata | null;
  previousScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  width: number;
  height: number;
}) => {
  const { enterStartX, enterStartY } = getDisplayEnter({
    currentScene,
    previousScene,
    width,
    height,
  });

  const { exitEndX, exitEndY } = getDisplayExit({
    currentScene,
    nextScene,
    width,
  });

  return {
    enterStartX,
    enterStartY,
    exitEndX,
    exitEndY,
  };
};

export const getDisplayPosition = ({
  enter,
  exit,
  width,
  height,
  nextScene,
  previousScene,
  currentScene,
}: {
  enter: number;
  exit: number;
  width: number;
  height: number;
  previousScene: SceneAndMetadata | null;
  nextScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
}) => {
  if (
    currentScene.type !== "video-scene" ||
    currentScene.layout.displayLayout === null
  ) {
    throw new Error("no transitions on non-video scenes");
  }

  const { enterStartX, enterStartY, exitEndX, exitEndY } =
    getDisplayTransitionOrigins({
      currentScene,
      nextScene,
      previousScene,
      width,
      height,
    });

  const startOpacity = currentScene && previousScene ? 0 : 1;
  const opacity = interpolate(enter, [0, 0.5], [startOpacity, 1]);

  if (exit > 0) {
    return {
      translationX: Math.round(
        interpolate(
          exit,
          [0, 1],
          [currentScene.layout.displayLayout.x, exitEndX],
        ),
      ),
      translationY: Math.round(
        interpolate(
          exit,
          [0, 1],
          [currentScene.layout.displayLayout.y, exitEndY],
        ),
      ),
      opacity,
    };
  }

  const enterX = interpolate(
    enter,
    [0, 1],
    [enterStartX, currentScene.layout.displayLayout.x],
  );
  const enterY = interpolate(
    enter,
    [0, 1],
    [enterStartY, currentScene.layout.displayLayout.y],
  );

  return {
    translationX: Math.round(enterX),
    translationY: Math.round(enterY),
    opacity,
  };
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

  if (canvasLayout === "wide") {
    if (!isSamePositionVertical) {
      return {
        ...currentLayout,
        x:
          currentLayout.x +
          (isWebCamRight(currentScene.finalWebcamPosition) ? width : -width),
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

  if (canvasLayout === "wide") {
    if (!isSamePositionVertical) {
      return {
        ...currentLayout,
        x:
          currentLayout.x +
          (isWebCamRight(currentScene.finalWebcamPosition) ? width : -width),
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

  return {
    ...currentLayout,
    x: samePositionHorizontal
      ? previousScene.layout.webcamLayout.x
      : currentLayout.x,
    y: samePositionHorizontal
      ? currentLayout.y
      : isWebCamAtBottom(currentScene.finalWebcamPosition)
      ? height + safeSpace(canvasLayout)
      : -currentLayout.height - safeSpace(canvasLayout),
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
    opacity: Math.min(1, enter * 2),
  };
};
