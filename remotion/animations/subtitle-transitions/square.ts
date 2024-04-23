import { getSafeSpace } from "../../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import type { Layout } from "../../layout/layout-types";
import { isWebCamAtBottom, isWebCamRight } from "../webcam-transitions/helpers";

const getEnterAndExitOfFullscreenBox = ({
  scene,
  otherScene,
  canvasHeight,
  canvasWidth,
}: {
  scene: VideoSceneAndMetadata;
  otherScene: VideoSceneAndMetadata;
  canvasHeight: number;
  canvasWidth: number;
}) => {
  if (otherScene === null || otherScene.type !== "video-scene") {
    return scene.layout.subtitleLayout;
  }

  const previouslyAtBottom = isWebCamAtBottom(otherScene.finalWebcamPosition);
  const currentlyAtBottom = isWebCamAtBottom(scene.finalWebcamPosition);
  const changedVerticalPosition = previouslyAtBottom !== currentlyAtBottom;

  // Changing from top to bottom or vice versa will push the subtitle out of the screen
  if (changedVerticalPosition) {
    if (currentlyAtBottom) {
      return {
        ...scene.layout.subtitleLayout,
        top: -scene.layout.subtitleLayout.height,
      };
    }

    return {
      ...scene.layout.subtitleLayout,
      top: canvasHeight,
    };
  }

  // If the vertical position has not changed, and the next scene also
  // has no display video, then nothing changes in the layout
  if (otherScene.layout.displayLayout === null) {
    return otherScene.layout.subtitleLayout;
  }

  // Now we expect that the other scene has a display video, and the webcam will shrink
  const top = isWebCamAtBottom(scene.finalWebcamPosition)
    ? otherScene.layout.webcamLayout.top -
      scene.layout.subtitleLayout.height -
      getSafeSpace("square")
    : getSafeSpace("square") * 2 + otherScene.layout.webcamLayout.height;

  // If the webcam moves to the top right corner, the subtitle should come from left corner
  if (!isWebCamRight(otherScene.finalWebcamPosition)) {
    return {
      ...scene.layout.subtitleLayout,
      left: -scene.layout.subtitleLayout.width,
      top,
    };
  }

  return {
    ...scene.layout.subtitleLayout,
    left: canvasWidth,
    top,
  };
};

const getEnterAndExitLayoutOfWebcamPositionChange = ({
  otherScene,
  scene,
  canvasHeight,
  canvasWidth,
}: {
  otherScene: VideoSceneAndMetadata;
  scene: VideoSceneAndMetadata;
  canvasHeight: number;
  canvasWidth: number;
}) => {
  if (scene.finalWebcamPosition === otherScene.finalWebcamPosition) {
    return otherScene.layout.subtitleLayout;
  }

  // Horizontal position change, move the subtitle over the edge
  if (
    isWebCamAtBottom(scene.finalWebcamPosition) !==
    isWebCamAtBottom(otherScene.finalWebcamPosition)
  ) {
    if (isWebCamAtBottom(scene.finalWebcamPosition)) {
      return {
        ...scene.layout.subtitleLayout,
        top: canvasHeight,
      };
    }

    return {
      ...scene.layout.subtitleLayout,
      top: -scene.layout.subtitleLayout.height,
    };
  }

  // Vertical position change
  // Webcam moves from right to left
  if (isWebCamRight(scene.finalWebcamPosition)) {
    return {
      ...scene.layout.subtitleLayout,
      left: -scene.layout.subtitleLayout.width,
    };
  }

  // Webcam moves from left to right
  return {
    ...scene.layout.subtitleLayout,
    left: canvasWidth,
  };
};

const getEnterAndExitOfBentoLayout = ({
  scene,
  otherScene,
  canvasWidth,
  canvasHeight,
}: {
  otherScene: VideoSceneAndMetadata;
  scene: VideoSceneAndMetadata;
  canvasWidth: number;
  canvasHeight: number;
}) => {
  if (!scene.layout.displayLayout) {
    throw new Error("Expected display layout to be present");
  }

  if (otherScene.layout.displayLayout) {
    return getEnterAndExitLayoutOfWebcamPositionChange({
      otherScene,
      scene,
      canvasHeight,
      canvasWidth,
    });
  }

  // We now assume the other scene has no display, webcam is getting bigger
  // and we need to animate the subtitles out
  const left = isWebCamRight(scene.finalWebcamPosition)
    ? -scene.layout.subtitleLayout.width
    : canvasWidth;

  // Vertical position change
  if (
    isWebCamAtBottom(otherScene.finalWebcamPosition) !==
    isWebCamAtBottom(scene.finalWebcamPosition)
  ) {
    if (isWebCamAtBottom(scene.finalWebcamPosition)) {
      return {
        ...scene.layout.subtitleLayout,
        top: getSafeSpace("square"),
        left,
      };
    }

    return {
      ...scene.layout.subtitleLayout,
      top:
        canvasHeight -
        scene.layout.subtitleLayout.height -
        getSafeSpace("square"),
      left,
    };
  }

  const top = isWebCamAtBottom(scene.finalWebcamPosition)
    ? canvasHeight -
      otherScene.layout.webcamLayout.height -
      getSafeSpace("square")
    : otherScene.layout.webcamLayout.height -
      scene.layout.subtitleLayout.height +
      getSafeSpace("square");

  return {
    ...otherScene.layout.subtitleLayout,
    left,
    top,
  };
};

export const getSquareEnterOrExit = ({
  scene,
  canvasHeight,
  otherScene,
  canvasWidth,
}: {
  otherScene: SceneAndMetadata | null;
  scene: VideoSceneAndMetadata;
  canvasWidth: number;
  canvasHeight: number;
}): Layout => {
  if (otherScene === null || otherScene.type !== "video-scene") {
    return scene.layout.subtitleLayout;
  }

  if (scene.layout.displayLayout === null) {
    return getEnterAndExitOfFullscreenBox({
      canvasHeight,
      canvasWidth,
      otherScene,
      scene,
    });
  }

  return getEnterAndExitOfBentoLayout({
    otherScene,
    scene,
    canvasWidth,
    canvasHeight,
  });
};
