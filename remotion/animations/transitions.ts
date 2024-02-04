import type { SceneAndMetadata, SceneType } from "../configuration";
import { transitionDuration } from "../configuration";
import { isGrowingOrShrinkingToMiniature } from "./camera-scene-transitions";

export const isATextCard = (scene: SceneType) => {
  return (
    scene.type === "title" ||
    scene.type === "titlecard" ||
    scene.type === "endcard" ||
    scene.type === "tableofcontents" ||
    scene.type === "remotionupdate"
  );
};

export const getIsTransitioningOut = ({
  sceneAndMetadata,
  nextScene,
}: {
  sceneAndMetadata: SceneAndMetadata;
  nextScene: SceneAndMetadata | null;
}) => {
  if (nextScene === null) {
    return false;
  }

  if (
    sceneAndMetadata.type === "video-scene" &&
    !sceneAndMetadata.scene.transitionToNextScene
  ) {
    return false;
  }

  if (isATextCard(sceneAndMetadata.scene)) {
    return true;
  }

  if (isATextCard(nextScene.scene)) {
    return true;
  }

  if (
    sceneAndMetadata.type === "video-scene" &&
    nextScene.type === "video-scene"
  ) {
    const samePosition =
      nextScene.finalWebcamPosition !== sceneAndMetadata.finalWebcamPosition;

    const isShrinkingOrGrowing = isGrowingOrShrinkingToMiniature({
      currentScene: sceneAndMetadata,
      otherScene: nextScene,
    });

    return samePosition || isShrinkingOrGrowing;
  }

  return false;
};

export const getIsTransitioningIn = ({
  scene,
  previousScene,
}: {
  scene: SceneAndMetadata;
  previousScene: SceneAndMetadata | null;
}) => {
  if (previousScene === null) {
    return false;
  }

  return getIsTransitioningOut({
    sceneAndMetadata: previousScene,
    nextScene: scene,
  });
};

export const getSumUpDuration = ({
  scene,
  previousScene,
}: {
  scene: SceneAndMetadata;
  previousScene: SceneAndMetadata | null;
}) => {
  return getIsTransitioningIn({
    scene,
    previousScene,
  })
    ? scene.durationInFrames - transitionDuration
    : scene.durationInFrames;
};
