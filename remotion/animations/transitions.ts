import type { CanvasLayout } from "../../config/layout";
import type {
  ComparableWebcamPosition,
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../config/scenes";
import { SCENE_TRANSITION_DURATION } from "../../config/transitions";

const getComparableWebcamPosition = (
  sceneAndMetaData: VideoSceneAndMetadata,
  canvasLayout: CanvasLayout,
): ComparableWebcamPosition => {
  if (canvasLayout !== "square") {
    return sceneAndMetaData.finalWebcamPosition;
  }

  if (sceneAndMetaData.videos.display) {
    return sceneAndMetaData.finalWebcamPosition;
  }

  if (
    sceneAndMetaData.finalWebcamPosition === "bottom-left" ||
    sceneAndMetaData.finalWebcamPosition === "bottom-right"
  ) {
    return "bottom";
  }

  return "top";
};

export const getShouldTransitionOut = ({
  sceneAndMetadata,
  nextScene,
  canvasLayout,
}: {
  sceneAndMetadata: SceneAndMetadata;
  nextScene: SceneAndMetadata | null;
  canvasLayout: CanvasLayout;
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
    return true;
  }

  const sceneWebcamPosition = getComparableWebcamPosition(
    sceneAndMetadata,
    canvasLayout,
  );
  const nextSceneWebcamPosition = getComparableWebcamPosition(
    nextScene,
    canvasLayout,
  );

  const hasSameWebcamPosition = sceneWebcamPosition === nextSceneWebcamPosition;
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
  canvasLayout,
}: {
  scene: SceneAndMetadata;
  previousScene: SceneAndMetadata | null;
  canvasLayout: CanvasLayout;
}) => {
  if (previousScene === null) {
    return false;
  }

  return getShouldTransitionOut({
    sceneAndMetadata: previousScene,
    nextScene: scene,
    canvasLayout,
  });
};

export const getSumUpDuration = ({
  scene,
  previousScene,
  canvasLayout,
}: {
  scene: SceneAndMetadata;
  previousScene: SceneAndMetadata | null;
  canvasLayout: CanvasLayout;
}) => {
  return getShouldTransitionIn({
    scene,
    previousScene,
    canvasLayout,
  })
    ? scene.durationInFrames - SCENE_TRANSITION_DURATION
    : scene.durationInFrames;
};
