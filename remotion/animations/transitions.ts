import type { SceneType } from "../configuration";

export const getIsTransitioningOut = (scenes: SceneType[], index: number) => {
  const scene = scenes[index];

  if (scene.type === "title" || scene.type === "titlecard") {
    return true;
  }

  return false;
};

export const getIsTransitioningIn = (scenes: SceneType[], index: number) => {
  if (index === 0) {
    return false;
  }

  const scene = scenes[index];

  if (scene.type === "title" || scene.type === "titlecard") {
    return true;
  }

  return false;
};
