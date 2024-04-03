import type { SceneAndMetadata } from "../../config/scenes";
import { TRANSITION_DURATION } from "../../config/transitions";

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

  if (
    nextScene.scene.type === "endcard" &&
    sceneAndMetadata.scene.type === "videoscene" &&
    sceneAndMetadata.scene.transitionToNextScene
  ) {
    return true;
  }

  const areBothVideoScenes =
    sceneAndMetadata.type === "video-scene" && nextScene.type === "video-scene";

  if (!areBothVideoScenes) {
    return false;
  }

  const hasSameWebcamPosition =
    sceneAndMetadata.finalWebcamPosition === nextScene.finalWebcamPosition;
  const hasSameWebcamSize =
    sceneAndMetadata.videos.webcam.height === nextScene.videos.webcam.height &&
    sceneAndMetadata.videos.webcam.width === nextScene.videos.webcam.width;
  const hasBothDisplays =
    Boolean(sceneAndMetadata.videos.display) ===
    Boolean(nextScene.videos.display);
  const hasSameDisplaySize =
    !sceneAndMetadata.videos.display || !nextScene.videos.display
      ? true
      : sceneAndMetadata.videos.display.height ===
          nextScene.videos.display.height &&
        sceneAndMetadata.videos.display.width ===
          nextScene.videos.display.width;

  if (
    hasBothDisplays &&
    hasSameDisplaySize &&
    hasSameWebcamSize &&
    hasSameWebcamPosition
  ) {
    return false;
  }

  return true;
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
    ? scene.durationInFrames - TRANSITION_DURATION
    : scene.durationInFrames;
};
