import { interpolate } from "remotion";
import type { VideoSceneAndMetadata, WebcamPosition } from "../configuration";

export type OutTransition = "none" | "up" | "down" | "left" | "right";
export type InTransition =
  | "none"
  | "from-top"
  | "from-bottom"
  | "from-left"
  | "from-right";

export const transitionOut = ({
  currentWebcamPosition,
  nextScene,
  transitionToNextScene,
}: {
  currentWebcamPosition: WebcamPosition;
  nextScene: VideoSceneAndMetadata | null;
  transitionToNextScene: boolean;
}): OutTransition => {
  if (!transitionToNextScene) {
    return "none";
  }

  const isCurrentlyLeft =
    currentWebcamPosition === "bottom-left" ||
    currentWebcamPosition === "top-left";

  const isCurrentlyTop =
    currentWebcamPosition === "top-left" ||
    currentWebcamPosition === "top-right";

  const isNextLeft =
    nextScene?.finalWebcamPosition === "bottom-left" ||
    nextScene?.finalWebcamPosition === "top-left";

  const isNextTop =
    nextScene?.finalWebcamPosition === "top-left" ||
    nextScene?.finalWebcamPosition === "top-right";

  if (nextScene === null) {
    if (isCurrentlyLeft) {
      return "left";
    }

    return "right";
  }

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

  return "none";
};

export const transitionIn = ({
  currentScene,
  previousWebcamPosition,
  previousTransitionToNextScene,
}: {
  currentScene: VideoSceneAndMetadata;
  previousWebcamPosition: WebcamPosition | null;
  previousTransitionToNextScene: boolean;
}): InTransition => {
  if (previousWebcamPosition === null) {
    if (
      currentScene.finalWebcamPosition === "bottom-left" ||
      currentScene.finalWebcamPosition === "top-left"
    ) {
      return "from-left";
    }

    return "from-right";
  }

  const outTransition = transitionOut({
    currentWebcamPosition: previousWebcamPosition,
    nextScene: currentScene,
    transitionToNextScene: previousTransitionToNextScene,
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
