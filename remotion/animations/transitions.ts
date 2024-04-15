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

  if (!sceneAndMetadata.scene.transitionToNextScene) {
    return false;
  }

  const areBothVideoScenes =
    sceneAndMetadata.type === "video-scene" && nextScene.type === "video-scene";

  if (!areBothVideoScenes) {
    return false;
  }

  const hasSameWebcamPosition =
    sceneAndMetadata.finalWebcamPosition === nextScene.finalWebcamPosition;
  const hasSameWebcamSize =
    sceneAndMetadata.layout.webcamLayout.height ===
      nextScene.layout.webcamLayout.height &&
    sceneAndMetadata.layout.webcamLayout.width ===
      nextScene.layout.webcamLayout.width;
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
