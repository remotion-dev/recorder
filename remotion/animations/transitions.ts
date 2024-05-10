import type { Dimensions } from "@remotion/layout-utils";
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

const getHasSameSize = (
  first: Dimensions | null,
  second: Dimensions | null,
) => {
  // If both are null, they are the same
  if (first === null && second === null) {
    return true;
  }

  // If only one is null, they are not the same
  if (first === null || second === null) {
    return false;
  }

  return first.height === second.height && second.width === first.width;
};

// Figure out if we are able to do a transition.
// We can do a transition if the layout is not the same.
export const getShouldTransitionOut = ({
  sceneAndMetadata,
  nextScene,
  canvasLayout,
}: {
  sceneAndMetadata: SceneAndMetadata;
  nextScene: SceneAndMetadata | null;
  canvasLayout: CanvasLayout;
}) => {
  // Can not transition if this is the last scene
  if (nextScene === null) {
    return false;
  }

  // Can not transition if it was disabled
  if (!sceneAndMetadata.scene.transitionToNextScene) {
    return false;
  }

  // If not both are video scenes, we can transition (slide)
  if (
    sceneAndMetadata.type !== "video-scene" ||
    nextScene.type !== "video-scene"
  ) {
    return true;
  }

  // If the webcam position changed, we can transition (move webcam)
  if (
    getComparableWebcamPosition(sceneAndMetadata, canvasLayout) !==
    getComparableWebcamPosition(nextScene, canvasLayout)
  ) {
    return true;
  }

  // We can transition if the webcam size has changed
  if (
    !getHasSameSize(
      sceneAndMetadata.layout.webcamLayout,
      nextScene.layout.webcamLayout,
    )
  ) {
    return true;
  }

  // If display is not the same, we can transition
  if (
    !getHasSameSize(
      sceneAndMetadata.layout.displayLayout,
      nextScene.layout.displayLayout,
    )
  ) {
    return true;
  }

  // Seems like everything is the same, we can't transition!
  return false;
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
