import { interpolateStyles } from "@remotion/animation-utils";
import type { VideoSceneAndMetadata } from "../../configuration";
import type { Layout } from "../../layout/layout-types";

export const getAnimatedSubtitleLayout = ({
  scene,
  enterProgress,
  exitProgress,
  nextScene,
  previousScene,
  shouldTransitionToNext,
  shouldTransitionFromPrevious,
}: {
  enterProgress: number;
  exitProgress: number;
  nextScene: VideoSceneAndMetadata | null;
  scene: VideoSceneAndMetadata;
  previousScene: VideoSceneAndMetadata | null;
  shouldTransitionToNext: boolean;
  shouldTransitionFromPrevious: boolean;
}): Layout => {
  const previousLayout =
    previousScene && shouldTransitionFromPrevious
      ? previousScene.layout.subLayout
      : null;

  const currentLayout = scene.layout.subLayout;

  const nextLayout =
    nextScene && shouldTransitionToNext ? nextScene.layout.subLayout : null;

  if (exitProgress > 0 && nextLayout) {
    return interpolateStyles(
      exitProgress,
      [0, 1],
      [currentLayout, nextLayout],
    ) as Layout;
  }

  if (previousLayout) {
    return interpolateStyles(
      enterProgress,
      [0, 1],
      [previousLayout, currentLayout],
    ) as Layout;
  }

  return currentLayout as Layout;
};
