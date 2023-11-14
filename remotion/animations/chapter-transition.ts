import { interpolate } from "remotion";
import type { SceneAndMetadata, VideoSceneAndMetadata } from "../configuration";
import {
  isGrowingFromMiniature,
  isShrinkingToMiniature,
  isWebCamAtBottom,
} from "./camera-scene-transitions";

export type OutTransition = "none" | "up" | "down" | "left" | "right";
export type InTransition =
  | "none"
  | "from-top"
  | "from-bottom"
  | "from-left"
  | "from-right";

export const transitionOut = ({
  currentScene,
  nextScene,
}: {
  currentScene: VideoSceneAndMetadata;
  nextScene: SceneAndMetadata | null;
}): OutTransition => {
  const isCurrentlyLeft =
    currentScene.finalWebcamPosition === "bottom-left" ||
    currentScene.finalWebcamPosition === "top-left";

  if (nextScene === null || nextScene.type !== "video-scene") {
    if (isCurrentlyLeft) {
      return "left";
    }

    return "right";
  }

  if (!currentScene.scene.transitionToNextScene) {
    return "none";
  }

  const isCurrentlyTop =
    currentScene.finalWebcamPosition === "top-left" ||
    currentScene.finalWebcamPosition === "top-right";

  const isNextLeft =
    nextScene?.finalWebcamPosition === "bottom-left" ||
    nextScene?.finalWebcamPosition === "top-left";

  const isNextTop =
    nextScene?.finalWebcamPosition === "top-left" ||
    nextScene?.finalWebcamPosition === "top-right";

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

export const transitionIn = ({
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
    previousScene?.type === "video-scene" &&
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

  const outTransition = transitionOut({
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
  height,
  outTransition,
  progress,
  width,
}: {
  outTransition: OutTransition;
  width: number;
  height: number;
  progress: number;
}): { x: number; y: number } => {
  if (outTransition === "none") {
    return { x: 0, y: 0 };
  }

  if (outTransition === "down") {
    return { x: 0, y: interpolate(progress, [0, 1], [0, height]) };
  }

  if (outTransition === "up") {
    return { x: 0, y: interpolate(progress, [0, 1], [0, -height]) };
  }

  if (outTransition === "left") {
    return { y: 0, x: interpolate(progress, [0, 1], [0, -width]) };
  }

  if (outTransition === "right") {
    return { y: 0, x: interpolate(progress, [0, 1], [0, width]) };
  }

  throw new Error('weird outTransition "' + outTransition + '"');
};

export const makeInTransition = ({
  inTransition,
  width,
  height,
  progress,
}: {
  inTransition: InTransition;
  width: number;
  height: number;
  progress: number;
}): { x: number; y: number } => {
  if (inTransition === "none") {
    return { x: 0, y: 0 };
  }

  if (inTransition === "from-top") {
    return {
      x: 0,
      y: interpolate(progress, [0, 1], [-height, 0]),
    };
  }

  if (inTransition === "from-bottom") {
    return {
      x: 0,
      y: interpolate(progress, [0, 1], [height, 0]),
    };
  }

  if (inTransition === "from-left") {
    return { y: 0, x: interpolate(progress, [0, 1], [-width, 0]) };
  }

  if (inTransition === "from-right") {
    return { y: 0, x: interpolate(progress, [0, 1], [width, 0]) };
  }

  throw new Error('weird inTransition "' + inTransition + '"');
};
