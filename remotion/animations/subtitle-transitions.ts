import { interpolateStyles, translate } from "@remotion/animation-utils";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../config/scenes";
import type { Layout } from "../layout/layout-types";
import type { SubtitleType } from "../Subs/Segment";
import {
  belowVideoSubtitleEnter,
  belowVideoSubtitleExit,
} from "./subtitle-transitions/below-video";
import { getBoxedEnter, getBoxedExit } from "./subtitle-transitions/boxed";
import {
  getOverlayedCenterSubtitleEnter,
  getOverlayedCenterSubtitleExit,
} from "./subtitle-transitions/overlayed-center";

const getSubtitleExit = ({
  width,
  nextScene,
  scene,
  currentLayout,
  subtitleType,
}: {
  width: number;
  scene: VideoSceneAndMetadata;
  nextScene: SceneAndMetadata | null;
  currentLayout: Layout;
  subtitleType: SubtitleType;
}) => {
  if (subtitleType === "overlayed-center") {
    return getOverlayedCenterSubtitleExit({ nextScene, currentScene: scene });
  }

  if (subtitleType === "below-video") {
    return belowVideoSubtitleExit({ nextScene, currentScene: scene });
  }

  if (subtitleType === "boxed") {
    return getBoxedExit({ nextScene, currentLayout, scene, width });
  }

  throw new Error("Unknown subtitle type: " + subtitleType);
};

const getSubtitleEnterTransform = ({
  width,
  height,
  scene,
  previousScene,
  currentLayout,
  subtitleType,
}: {
  width: number;
  height: number;
  scene: SceneAndMetadata;
  previousScene: SceneAndMetadata | null;
  currentLayout: Layout;
  subtitleType: SubtitleType;
}): string => {
  if (scene.type !== "video-scene") {
    throw new Error("no subtitles on non-video scenes");
  }

  if (subtitleType === "overlayed-center") {
    return getOverlayedCenterSubtitleEnter({
      previousScene,
      scene,
    });
  }

  if (subtitleType === "below-video") {
    return belowVideoSubtitleEnter({
      previousScene,
      scene,
    });
  }

  if (subtitleType === "boxed") {
    return getBoxedEnter({
      currentLayout,
      scene,
      height,
      previousScene,
      width,
    });
  }

  throw new Error("Unknown subtitle type: " + subtitleType);
};

export const getSubtitleTransform = ({
  enter,
  exit,
  width,
  height,
  nextScene,
  previousScene,
  scene,
  currentLayout,
  subtitleType,
}: {
  enter: number;
  exit: number;
  width: number;
  height: number;
  scene: VideoSceneAndMetadata;
  previousScene: SceneAndMetadata | null;
  nextScene: SceneAndMetadata | null;
  currentLayout: Layout;
  subtitleType: SubtitleType;
}): string => {
  const _enter = getSubtitleEnterTransform({
    height,
    width,
    scene,
    previousScene,
    currentLayout,
    subtitleType,
  });

  const _exit = getSubtitleExit({
    width,
    nextScene,
    scene,
    currentLayout,
    subtitleType,
  });

  if (exit > 0) {
    return interpolateStyles(
      exit,
      [0, 1],
      [{ transform: translate(0, 0) }, { transform: _exit }],
    ).transform as string;
  }

  return interpolateStyles(
    enter,
    [0, 1],
    [{ transform: _enter }, { transform: translate(0, 0) }],
    {},
  ).transform as string;
};
