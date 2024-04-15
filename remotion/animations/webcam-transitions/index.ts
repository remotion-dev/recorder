import { interpolateStyles } from "@remotion/animation-utils";
import type { CanvasLayout } from "../../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import type { Layout } from "../../layout/layout-types";
import { getLandscapeWebCamStartOrEndLayout } from "./landscape";
import { getSquareWebcamStartOrEndLayout } from "./square";

const getWebCamStartOrEndLayout = ({
  width,
  height,
  canvasLayout,
  otherScene,
  currentScene,
}: {
  otherScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  width: number;
  height: number;
  canvasLayout: CanvasLayout;
}): Layout => {
  if (canvasLayout === "landscape") {
    return getLandscapeWebCamStartOrEndLayout({
      currentScene,
      otherScene,
      width,
    });
  }

  if (canvasLayout === "square") {
    return getSquareWebcamStartOrEndLayout({
      currentScene,
      height,
      otherScene,
    });
  }

  throw new Error(`Unknown canvas layout: ${canvasLayout}`);
};

const shouldTransitionWebcamVideo = ({
  previousScene,
}: {
  previousScene: SceneAndMetadata | null;
}) => {
  if (!previousScene) {
    return false;
  }

  if (previousScene.type !== "video-scene") {
    return false;
  }

  return true;
};

export const getWebcamLayout = ({
  enterProgress,
  exitProgress,
  width,
  height,
  canvasLayout,
  currentScene,
  nextScene,
  previousScene,
}: {
  enterProgress: number;
  exitProgress: number;
  width: number;
  height: number;
  canvasLayout: CanvasLayout;
  nextScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  previousScene: SceneAndMetadata | null;
}): React.CSSProperties => {
  const startLayout = getWebCamStartOrEndLayout({
    canvasLayout,
    currentScene,
    otherScene: previousScene,
    width,
    height,
  });

  const endLayout = getWebCamStartOrEndLayout({
    canvasLayout,
    currentScene,
    height,
    otherScene: nextScene,
    width,
  });

  if (exitProgress > 0) {
    return interpolateStyles(
      exitProgress,
      [0, 1],
      [currentScene.layout.webcamLayout, endLayout],
    );
  }

  return {
    ...interpolateStyles(
      enterProgress,
      [0, 1],
      [startLayout, currentScene.layout.webcamLayout],
    ),
    // Switch opacity in the middle of the transition
    opacity: shouldTransitionWebcamVideo({ previousScene })
      ? enterProgress > 0.5
        ? 1
        : 0
      : 1,
  };
};
