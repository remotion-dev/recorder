import { interpolate } from "remotion";
import type { SceneAndMetadata, VideoSceneAndMetadata } from "../configuration";
import type { Layout } from "../layout/get-layout";
import {
  isGrowingFromMiniature,
  isShrinkingToMiniature,
  isWebCamAtBottom,
} from "./camera-scene-transitions";

const getDisplayExit = ({
  currentScene,
  nextScene,
  width,
  height,
}: {
  nextScene: SceneAndMetadata | null;
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
    const y = isWebCamAtBottom(currentScene.finalWebcamPosition)
      ? -currentScene.layout.displayLayout.height
      : height;
    return {
      exitEndX: currentScene.layout.displayLayout.x,
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
    height,
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
