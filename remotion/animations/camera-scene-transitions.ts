import { interpolate } from "remotion";
import type {
  CanvasLayout,
  SceneAndMetadata,
  VideoSceneAndMetadata,
  WebcamPosition,
} from "../configuration";
import type { Layout } from "../layout/get-layout";

export const getDisplayTranslation = ({
  enter,
  exit,
  width,
  nextScene: nextLayout,
  previousScene: previousLayout,
  currentScene: currentLayout,
}: {
  enter: number;
  exit: number;
  width: number;
  previousScene: SceneAndMetadata | null;
  nextScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
}) => {
  if (
    currentLayout.type !== "video-scene" ||
    currentLayout.layout.displayLayout === null
  ) {
    throw new Error("no transitions on non-video scenes");
  }

  const currentandPreviousAreVideoScenes =
    previousLayout &&
    previousLayout.type === "video-scene" &&
    previousLayout.layout.displayLayout !== null;
  const nextAndCurrentAreVideoScenes =
    nextLayout &&
    nextLayout.type === "video-scene" &&
    nextLayout.layout.displayLayout !== null;

  const enterStartX = currentandPreviousAreVideoScenes
    ? (previousLayout.layout.displayLayout as Layout).x
    : currentLayout.layout.displayLayout.x + width;

  const enterStartY = currentandPreviousAreVideoScenes
    ? (previousLayout.layout.displayLayout as Layout).y
    : currentLayout.layout.displayLayout.y;

  const exitEndX = nextAndCurrentAreVideoScenes
    ? (nextLayout.layout.displayLayout as Layout).x
    : currentLayout.layout.displayLayout.x - width;

  const exitEndY = nextAndCurrentAreVideoScenes
    ? (nextLayout.layout.displayLayout as Layout).y
    : currentLayout.layout.displayLayout.y;

  const startOpacity = currentLayout && previousLayout ? 0 : 1;
  const opacity = interpolate(enter, [0, 0.5], [startOpacity, 1]);

  if (exit > 0) {
    return {
      translationX: Math.round(
        interpolate(
          exit,
          [0, 1],
          [currentLayout.layout.displayLayout.x, exitEndX],
        ),
      ),
      translationY: Math.round(
        interpolate(
          exit,
          [0, 1],
          [currentLayout.layout.displayLayout.y, exitEndY],
        ),
      ),
      opacity,
    };
  }

  const enterX = interpolate(
    enter,
    [0, 1],
    [enterStartX, currentLayout.layout.displayLayout.x],
  );
  const enterY = interpolate(
    enter,
    [0, 1],
    [enterStartY, currentLayout.layout.displayLayout.y],
  );

  return {
    translationX: Math.round(enterX),
    translationY: Math.round(enterY),
    opacity,
  };
};

const isGrowingOrShrinkingToMiniature = ({
  currentScene,
  otherScene,
}: {
  currentScene: VideoSceneAndMetadata;
  otherScene: SceneAndMetadata;
}) => {
  if (otherScene.type !== "video-scene") {
    return false;
  }

  const toMiniature =
    currentScene.layout.displayLayout === null &&
    otherScene.layout.displayLayout !== null;

  const fromMiniature =
    currentScene.layout.displayLayout !== null &&
    otherScene.layout.displayLayout === null;

  return toMiniature || fromMiniature;
};

const isWebCamAtBottom = (webcamPosition: WebcamPosition) => {
  return webcamPosition === "bottom-left" || webcamPosition === "bottom-right";
};

const isWebCamRight = (webcamPosition: WebcamPosition) => {
  return webcamPosition === "top-right" || webcamPosition === "bottom-right";
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
    isWebCamAtBottom(nextScene.scene.webcamPosition) ===
    isWebCamAtBottom(currentScene.scene.webcamPosition);
  const isSamePositionVertical =
    isWebCamRight(nextScene.scene.webcamPosition) ===
    isWebCamRight(currentScene.scene.webcamPosition);

  if (canvasLayout === "wide") {
    if (!isSamePositionVertical) {
      return {
        ...currentLayout,
        x:
          currentLayout.x +
          (isWebCamRight(currentScene.scene.webcamPosition) ? width : -width),
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
      : isWebCamAtBottom(currentScene.scene.webcamPosition)
      ? currentLayout.y + height
      : currentLayout.y - height,
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
    isWebCamAtBottom(previousScene.scene.webcamPosition) ===
    isWebCamAtBottom(currentScene.scene.webcamPosition);
  const isSamePositionVertical =
    isWebCamRight(previousScene.scene.webcamPosition) ===
    isWebCamRight(currentScene.scene.webcamPosition);

  if (canvasLayout === "wide") {
    if (!isSamePositionVertical) {
      return {
        ...currentLayout,
        x:
          currentLayout.x +
          (isWebCamRight(currentScene.scene.webcamPosition) ? width : -width),
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
      ? previousScene.layout.webcamLayout.x - currentScene.layout.webcamLayout.x
      : 0,
    y: samePositionHorizontal
      ? 0
      : isWebCamAtBottom(currentScene.scene.webcamPosition)
      ? height
      : -height,
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
  };
};

const getSubtitleExit = ({
  exit,
  width,
  height,
  canvasLayout,
  nextScene,
  scene,
}: {
  exit: number;
  width: number;
  height: number;
  canvasLayout: CanvasLayout;
  scene: SceneAndMetadata;
  nextScene: SceneAndMetadata | null;
}) => {
  if (nextScene === null || nextScene.type !== "video-scene") {
    return {
      translationX: interpolate(exit, [0, 1], [0, -width]),
      translationY: 0,
    };
  }

  if (scene.type !== "video-scene") {
    throw new Error("no subtitles on non-video scenes");
  }

  const isSamePositionVertical =
    isWebCamRight(nextScene.scene.webcamPosition) ===
    isWebCamRight(scene.scene.webcamPosition);
  const isSamePositionHorizontal =
    isWebCamAtBottom(nextScene.scene.webcamPosition) ===
    isWebCamAtBottom(scene.scene.webcamPosition);

  if (!isSamePositionHorizontal && canvasLayout === "square") {
    return {
      translationX: 0,
      translationY: interpolate(
        exit,
        [0, 1],
        [0, isWebCamAtBottom(scene.scene.webcamPosition) ? height : -height],
      ),
    };
  }

  if (!isSamePositionVertical && canvasLayout === "square") {
    return {
      translationX: interpolate(
        exit,
        [0, 1],
        [0, isWebCamRight(scene.scene.webcamPosition) ? -width : width],
      ),
      translationY: 0,
    };
  }

  return { translationX: 0, translationY: 0 };
};

const getSubtitleEnter = ({
  enter,
  width,
  height,
  canvasLayout,
  currentScene,
  previousScene,
}: {
  enter: number;
  width: number;
  height: number;
  currentScene: SceneAndMetadata;
  canvasLayout: CanvasLayout;
  previousScene: SceneAndMetadata | null;
}) => {
  if (currentScene.type !== "video-scene") {
    throw new Error("no subtitles on non-video scenes");
  }

  if (previousScene === null || previousScene.type !== "video-scene") {
    if (canvasLayout === "wide") {
      return {
        translationX: 0,
        translationY: interpolate(enter, [0, 1], [height, 0]),
      };
    }

    if (canvasLayout === "square" || canvasLayout === "tall") {
      return {
        translationX: interpolate(enter, [0, 1], [width, 0]),
        translationY: 0,
      };
    }

    throw new Error("Invalid canvas layout");
  }

  const isSamePositionVertical =
    isWebCamRight(previousScene.scene.webcamPosition) ===
    isWebCamRight(currentScene.scene.webcamPosition);
  const isSamePositionHorizontal =
    isWebCamAtBottom(previousScene.scene.webcamPosition) ===
    isWebCamAtBottom(currentScene.scene.webcamPosition);

  if (
    !isSamePositionHorizontal &&
    (canvasLayout === "square" || canvasLayout === "tall")
  ) {
    return {
      translationX: 0,
      translationY: interpolate(
        enter,
        [0, 1],
        [
          isWebCamAtBottom(currentScene.scene.webcamPosition)
            ? height
            : -height,
          0,
        ],
      ),
    };
  }

  if (
    !isSamePositionVertical &&
    (canvasLayout === "square" || canvasLayout === "tall")
  ) {
    return {
      translationX: interpolate(
        enter,
        [0, 1],
        [isWebCamRight(currentScene.scene.webcamPosition) ? -width : width, 0],
      ),
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
}: {
  enter: number;
  exit: number;
  width: number;
  height: number;
  canvasLayout: CanvasLayout;
  scene: SceneAndMetadata;
  previousScene: SceneAndMetadata | null;
  nextScene: SceneAndMetadata | null;
}) => {
  const _enter = getSubtitleEnter({
    canvasLayout,
    enter,
    height,
    width,
    currentScene: scene,
    previousScene,
  });
  const _exit = getSubtitleExit({
    canvasLayout,
    exit,
    height,
    width,
    nextScene,
    scene,
  });

  return {
    translationX: _enter.translationX + _exit.translationX,
    translationY: _enter.translationY + _exit.translationY,
  };
};
