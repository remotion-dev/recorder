import type { SceneAndMetadata } from "../../config/scenes";

export const getSceneEnter = ({
  width,
  previousScene,
  currentScene,
}: {
  width: number;
  previousScene: SceneAndMetadata | null;
  currentScene: SceneAndMetadata;
}): {
  left: number;
} => {
  if (previousScene === null) {
    return {
      left: 0,
    };
  }

  if (
    previousScene.type === "video-scene" &&
    currentScene.type === "video-scene"
  ) {
    return {
      left: 0,
    };
  }

  return {
    left: width,
  };
};

export const getSceneExit = ({
  width,
  nextScene,
  currentScene,
}: {
  width: number;
  nextScene: SceneAndMetadata | null;
  currentScene: SceneAndMetadata;
}) => {
  if (nextScene === null) {
    return {
      left: 0,
    };
  }

  if (nextScene.type === "video-scene" && currentScene.type === "video-scene") {
    return {
      left: 0,
    };
  }

  return {
    left: -width,
  };
};
