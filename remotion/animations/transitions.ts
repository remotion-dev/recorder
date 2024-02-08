import type { SceneAndMetadata, SceneType } from "../configuration";
import { transitionDuration } from "../configuration";

export const isATextCard = (scene: SceneType) => {
  return (
    scene.type === "title" ||
    scene.type === "titlecard" ||
    scene.type === "endcard" ||
    scene.type === "tableofcontents" ||
    scene.type === "remotionupdate"
  );
};

export const getShouldTransitionOut = ({
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

  return (
    sceneAndMetadata.type === "video-scene" && nextScene.type === "video-scene"
  );
};

export const getShouldTransitionIn = ({
  scene,
  previousScene,
}: {
  scene: SceneAndMetadata;
  previousScene: SceneAndMetadata | null;
}) => {
  if (previousScene === null) {
    return false;
  }

  return getShouldTransitionOut({
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
  return getShouldTransitionIn({
    scene,
    previousScene,
  })
    ? scene.durationInFrames - transitionDuration
    : scene.durationInFrames;
};
