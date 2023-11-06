import type { SceneType } from "../configuration";

export const isATextCard = (scene: SceneType) => {
  return (
    scene.type === "title" ||
    scene.type === "titlecard" ||
    scene.type === "endcard" ||
    scene.type === "remotionupdate"
  );
};

export const getIsTransitioningOut = (scenes: SceneType[], index: number) => {
  const sceneAndMetadata = scenes[index];

  if (isATextCard(sceneAndMetadata)) {
    return true;
  }

  const nextScene = scenes[index + 1];
  if (!nextScene) {
    return false;
  }

  if (isATextCard(nextScene)) {
    return true;
  }

  if (
    sceneAndMetadata.type === "scene" &&
    nextScene.type === "scene" &&
    sceneAndMetadata.transitionToNextScene &&
    nextScene.webcamPosition !== sceneAndMetadata.webcamPosition
  ) {
    return true;
  }

  return false;
};

export const getIsTransitioningIn = (scenes: SceneType[], index: number) => {
  if (index === 0) {
    return false;
  }

  return getIsTransitioningOut(scenes, index - 1);
};
