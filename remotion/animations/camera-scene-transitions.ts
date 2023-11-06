import { interpolate } from "remotion";
import type {
  CanvasLayout,
  SceneAndMetadata,
  WebcamPosition,
} from "../configuration";

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
  currentScene: SceneAndMetadata | null;
}) => {
  const enterStartX =
    currentLayout &&
    previousLayout &&
    currentLayout.type === "video-scene" &&
    previousLayout.type === "video-scene"
      ? previousLayout.layout.webcamLayout.x -
        currentLayout.layout.webcamLayout.x
      : width;

  const enterStartY =
    currentLayout &&
    previousLayout &&
    currentLayout.type === "video-scene" &&
    previousLayout.type === "video-scene"
      ? previousLayout.layout.webcamLayout.y -
        currentLayout.layout.webcamLayout.y
      : 0;

  const exitEndX =
    currentLayout &&
    nextLayout &&
    currentLayout.type === "video-scene" &&
    nextLayout.type === "video-scene"
      ? nextLayout.layout.webcamLayout.x - currentLayout.layout.webcamLayout.x
      : -width;

  const exitEndY =
    currentLayout &&
    nextLayout &&
    currentLayout.type === "video-scene" &&
    nextLayout.type === "video-scene"
      ? nextLayout.layout.webcamLayout.y - currentLayout.layout.webcamLayout.y
      : 0;

  const startOpacity = currentLayout && previousLayout ? 0 : 1;

  const enterX = interpolate(enter, [0, 1], [enterStartX, 0]);
  const enterY = interpolate(enter, [0, 1], [enterStartY, 0]);

  const exitX = interpolate(exit, [0, 1], [0, exitEndX]);
  const exitY = interpolate(exit, [0, 1], [0, exitEndY]);

  const opacity = interpolate(enter, [0, 0.5], [startOpacity, 1]);

  const translationX = enterX + exitX;
  const translationY = enterY + exitY;

  return {
    translationX: Math.round(translationX),
    translationY: Math.round(translationY),
    opacity,
  };
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
  currentScene: SceneAndMetadata;
  width: number;
  height: number;
  canvasLayout: CanvasLayout;
}): { endX: number; endY: number } => {
  if (!nextScene || nextScene.type !== "video-scene") {
    return {
      endX: -width,
      endY: 0,
    };
  }

  if (!currentScene || currentScene.type !== "video-scene") {
    return {
      endX: -width,
      endY: 0,
    };
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
        endX: isWebCamRight(currentScene.scene.webcamPosition) ? width : -width,
        endY: 0,
      };
    }

    if (!samePositionHorizontal) {
      return {
        endX: 0,
        endY:
          nextScene.layout.webcamLayout.y - currentScene.layout.webcamLayout.y,
      };
    }

    return {
      endX: -width,
      endY: 0,
    };
  }

  return {
    endX: samePositionHorizontal
      ? nextScene.layout.webcamLayout.x - currentScene.layout.webcamLayout.x
      : 0,
    endY: samePositionHorizontal
      ? 0
      : isWebCamAtBottom(currentScene.scene.webcamPosition)
      ? height
      : -height,
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
  currentScene: SceneAndMetadata;
  width: number;
  height: number;
  canvasLayout: CanvasLayout;
}): { startX: number; startY: number } => {
  if (!previousScene || previousScene.type !== "video-scene") {
    return {
      startX: width,
      startY: 0,
    };
  }

  if (!currentScene || currentScene.type !== "video-scene") {
    return {
      startX: width,
      startY: 0,
    };
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
        startX: isWebCamRight(currentScene.scene.webcamPosition)
          ? width
          : -width,
        startY: 0,
      };
    }

    if (!samePositionHorizontal) {
      return {
        startX: 0,
        startY:
          previousScene.layout.webcamLayout.y -
          currentScene.layout.webcamLayout.y,
      };
    }

    return {
      startX: width,
      startY: 0,
    };
  }

  return {
    startX: samePositionHorizontal
      ? previousScene.layout.webcamLayout.x - currentScene.layout.webcamLayout.x
      : 0,
    startY: samePositionHorizontal
      ? 0
      : isWebCamAtBottom(currentScene.scene.webcamPosition)
      ? height
      : -height,
  };
};

export const getWebcamTranslation = ({
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
  currentScene: SceneAndMetadata;
  previousScene: SceneAndMetadata | null;
}) => {
  const { startX, startY } = getWebCamStartOffset({
    canvasLayout,
    currentScene,
    height,
    previousScene,
    width,
  });

  const { endX, endY } = getWebcamEndOffset({
    canvasLayout,
    currentScene,
    height,
    nextScene,
    width,
  });

  const enterX = interpolate(enter, [0, 1], [startX, 0]);
  const enterY = interpolate(enter, [0, 1], [startY, 0]);
  const exitX = interpolate(exit, [0, 1], [0, endX]);
  const exitY = interpolate(exit, [0, 1], [0, endY]);

  return { translationX: exitX + enterX, translationY: enterY + exitY };
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
