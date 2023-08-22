import type { SceneType } from "../configuration";

export const isATextCard = (scene: SceneType) => {
  return scene.type === "title" || scene.type === "titlecard";
};

export const getIsTransitioningOut = (scenes: SceneType[], index: number) => {
  const scene = scenes[index];

  if (isATextCard(scene)) {
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
    scene.type === "scene" &&
    nextScene.type === "scene" &&
    scene.transitionToNextScene
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
