import { interpolate } from "remotion";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../config/scenes";
import {
  isGrowingFromMiniature,
  isShrinkingToMiniature,
  isWebCamAtBottom,
  isWebCamRight,
} from "./webcam-transitions/helpers";

export type OutTransition = "none" | "up" | "down" | "left" | "right";
export type InTransition =
  | "none"
  | "from-top"
  | "from-bottom"
  | "from-left"
  | "from-right";

export const getChapterOutTransition = ({
  currentScene,
  nextScene,
}: {
  currentScene: VideoSceneAndMetadata;
  nextScene: SceneAndMetadata | null;
}): OutTransition => {
  const isCurrentlyLeft = !isWebCamRight(currentScene.finalWebcamPosition);

  if (nextScene === null || nextScene.type !== "video-scene") {
    return "left";
  }

  if (!currentScene.scene.transitionToNextScene) {
    return "none";
  }

  const isCurrentlyTop = !isWebCamAtBottom(currentScene.finalWebcamPosition);
  const isNextLeft = !isWebCamRight(nextScene.finalWebcamPosition);
  const isNextTop = !isWebCamAtBottom(nextScene.finalWebcamPosition);

  if (isCurrentlyLeft && !isNextLeft) {
    return "left";
  }

  if (!isCurrentlyLeft && isNextLeft) {
    return "right";
  }

  if (isCurrentlyTop && !isNextTop) {
    return "down";
  }

  if (!isCurrentlyTop && isNextTop) {
    return "up";
  }

  if (
    isGrowingFromMiniature({ firstScene: currentScene, secondScene: nextScene })
  ) {
    if (isWebCamAtBottom(nextScene.finalWebcamPosition)) {
      return "up";
    }

    return "down";
  }

  return "none";
};

export const getChapterInTransition = ({
  currentScene,
  previousScene,
}: {
  currentScene: VideoSceneAndMetadata;
  previousScene: SceneAndMetadata | null;
}): InTransition => {
  if (previousScene === null || previousScene.type !== "video-scene") {
    return "from-right";
  }

  if (
    previousScene.type === "video-scene" &&
    isShrinkingToMiniature({
      firstScene: previousScene,
      secondScene: currentScene,
    })
  ) {
    if (isWebCamAtBottom(currentScene.finalWebcamPosition)) {
      return "from-top";
    }

    return "from-bottom";
  }

  const outTransition = getChapterOutTransition({
    currentScene: previousScene,
    nextScene: currentScene,
  });

  if (outTransition === "none") {
    return "none";
  }

  if (outTransition === "down") {
    return "from-top";
  }

  if (outTransition === "up") {
    return "from-bottom";
  }

  if (outTransition === "left") {
    return "from-right";
  }

  if (outTransition === "right") {
    return "from-left";
  }

  throw new Error("weird " + outTransition);
};

export const makeOutTransition = ({
  canvasHeight,
  outTransition,
  progress,
  canvasWidth,
}: {
  outTransition: OutTransition;
  canvasWidth: number;
  canvasHeight: number;
  progress: number;
}): { x: number; y: number } => {
  if (outTransition === "none") {
    return { x: 0, y: 0 };
  }

  if (outTransition === "down") {
    return { x: 0, y: interpolate(progress, [0, 1], [0, canvasHeight]) };
  }

  if (outTransition === "up") {
    return { x: 0, y: interpolate(progress, [0, 1], [0, -canvasHeight]) };
  }

  if (outTransition === "left") {
    return { y: 0, x: interpolate(progress, [0, 1], [0, -canvasWidth]) };
  }

  if (outTransition === "right") {
    return { y: 0, x: interpolate(progress, [0, 1], [0, canvasWidth]) };
  }

  throw new Error('weird outTransition "' + outTransition + '"');
};

export const makeInTransition = ({
  inTransition,
  canvasWidth,
  canvasHeight,
  progress,
}: {
  inTransition: InTransition;
  canvasWidth: number;
  canvasHeight: number;
  progress: number;
}): { x: number; y: number } => {
  if (inTransition === "none") {
    return { x: 0, y: 0 };
  }

  if (inTransition === "from-top") {
    return {
      x: 0,
      y: interpolate(progress, [0, 1], [-canvasHeight / 2, 0]),
    };
  }

  if (inTransition === "from-bottom") {
    return {
      x: 0,
      y: interpolate(progress, [0, 1], [canvasHeight / 2, 0]),
    };
  }

  if (inTransition === "from-left") {
    return { y: 0, x: interpolate(progress, [0, 1], [-canvasWidth / 2, 0]) };
  }

  if (inTransition === "from-right") {
    return { y: 0, x: interpolate(progress, [0, 1], [canvasWidth / 2, 0]) };
  }

  throw new Error('weird inTransition "' + inTransition + '"');
};
