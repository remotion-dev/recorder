import { interpolate } from "remotion";
import type {
  CanvasLayout,
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../configuration";
import type { Layout } from "../layout/get-layout";
import { safeSpace } from "../layout/get-layout";
import {
  isGrowingFromMiniature,
  isShrinkingToMiniature,
  isWebCamAtBottom,
  isWebCamRight,
} from "./camera-scene-transitions";

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
      ? height
      : nextScene.layout.webcamLayout.height + 2 * safeSpace(canvasLayout);

    if (changedVerticalPosition) {
      return {
        exitEndX: currentScene.layout.displayLayout.x,
        exitEndY: y,
      };
    }

    return {
      exitEndX: isWebCamRight(currentScene.finalWebcamPosition)
        ? -(width - safeSpace(canvasLayout) * 2)
        : width - safeSpace(canvasLayout) * 2,
      exitEndY: y,
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
}: {
  previousScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  width: number;
}) => {
  if (
    currentScene.type !== "video-scene" ||
    currentScene.layout.displayLayout === null
  ) {
    throw new Error("no transitions on non-video scenes");
  }

  if (
    previousScene &&
    isShrinkingToMiniature({
      firstScene: previousScene,
      secondScene: currentScene,
    })
  ) {
    const translationY = currentScene.layout.displayLayout.height;
    const y = isWebCamAtBottom(currentScene.finalWebcamPosition)
      ? -translationY
      : translationY;
    return {
      enterStartX: (currentScene.layout.displayLayout as Layout).x,
      enterStartY: y,
    };
  }

  const currentandPreviousAreVideoScenes =
    previousScene && previousScene.type === "video-scene";
  if (currentandPreviousAreVideoScenes) {
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
  canvasLayout,
}: {
  nextScene: SceneAndMetadata | null;
  previousScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  canvasLayout: CanvasLayout;
  width: number;
  height: number;
}) => {
  const { enterStartX, enterStartY } = getDisplayEnter({
    currentScene,
    previousScene,
    width,
  });

  const { exitEndX, exitEndY } = getDisplayExit({
    currentScene,
    nextScene,
    width,
    height,
    canvasLayout,
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
  canvasLayout,
}: {
  enter: number;
  exit: number;
  width: number;
  height: number;
  previousScene: SceneAndMetadata | null;
  nextScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  canvasLayout: CanvasLayout;
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
      canvasLayout,
    });

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
      opacity: 1,
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
    opacity: 1,
  };
};
