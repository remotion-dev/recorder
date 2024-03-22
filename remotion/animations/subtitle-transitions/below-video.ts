import { translate } from "@remotion/animation-utils";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import {
  isGrowingFromMiniature,
  isShrinkingToMiniature,
} from "../webcam-transitions";

export const belowVideoSubtitleEnter = ({
  previousScene,
  scene,
}: {
  previousScene: SceneAndMetadata | null;
  scene: VideoSceneAndMetadata;
}): string => {
  if (previousScene === null) {
    return translate(0, 0);
  }

  if (previousScene.type !== "video-scene") {
    return translate(0, 500);
  }

  if (
    isShrinkingToMiniature({ firstScene: previousScene, secondScene: scene })
  ) {
    return translate(0, 500);
  }

  return translate(0, 0);
};

export const belowVideoSubtitleExit = ({
  nextScene,
  currentScene,
}: {
  nextScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
}): string => {
  if (!nextScene) {
    return translate(0, 0);
  }

  if (nextScene.type !== "video-scene") {
    return translate(0, 500);
  }

  if (
    isGrowingFromMiniature({
      firstScene: currentScene,
      secondScene: nextScene,
    })
  ) {
    return translate(0, 500);
  }

  return translate(0, 0);
};
