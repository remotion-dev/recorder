import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import type { SubtitleType } from "../../captions/Segment";
import type { Layout } from "../../layout/layout-types";
import { interpolateLayout } from "../interpolate-layout";
import { belowVideoSubtitleEnterOrExit } from "./below-video";
import { getOverlayedCenterSubtitleEnterOrExit } from "./overlayed-center";
import { getSquareEnterOrExit } from "./square";

const getSubtitleEnterOrExitLayout = ({
  canvasWidth,
  canvasHeight,
  scene,
  otherScene,
  subtitleType,
}: {
  canvasWidth: number;
  canvasHeight: number;
  scene: SceneAndMetadata;
  otherScene: SceneAndMetadata | null;
  subtitleType: SubtitleType;
}): Layout => {
  if (scene.type !== "video-scene") {
    throw new Error("no subtitles on non-video scenes");
  }

  if (subtitleType === "overlayed-center") {
    return getOverlayedCenterSubtitleEnterOrExit({
      otherScene,
      scene,
    });
  }

  if (subtitleType === "below-video") {
    return belowVideoSubtitleEnterOrExit({
      otherScene,
      scene,
    });
  }

  if (subtitleType === "square") {
    return getSquareEnterOrExit({
      scene,
      canvasHeight,
      otherScene,
      canvasWidth,
    });
  }

  throw new Error("Unknown subtitle type: " + subtitleType);
};

export const getSubtitleTransform = ({
  enterProgress,
  exitProgress,
  canvasWidth,
  canvasHeight,
  nextScene,
  previousScene,
  scene,
  subtitleType,
}: {
  enterProgress: number;
  exitProgress: number;
  canvasWidth: number;
  canvasHeight: number;
  scene: VideoSceneAndMetadata;
  previousScene: SceneAndMetadata | null;
  nextScene: SceneAndMetadata | null;
  subtitleType: SubtitleType;
}): Layout => {
  const enter = getSubtitleEnterOrExitLayout({
    scene,
    otherScene: previousScene,
    canvasHeight,
    canvasWidth,
    subtitleType,
  });

  const exit = getSubtitleEnterOrExitLayout({
    scene,
    otherScene: nextScene,
    subtitleType,
    canvasWidth,
    canvasHeight,
  });

  if (exitProgress > 0) {
    return interpolateLayout(scene.layout.subtitleLayout, exit, exitProgress);
  }

  return interpolateLayout(enter, scene.layout.subtitleLayout, enterProgress);
};
