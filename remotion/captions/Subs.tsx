import React, { useMemo } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import type { CanvasLayout } from "../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../config/scenes";
import type { Theme } from "../../config/themes";
import { COLORS } from "../../config/themes";
import { shouldInlineTransitionSubtitles } from "../animations/subtitle-transitions/should-transition-subtitle";
import { getSubtitleTransform } from "../animations/subtitle-transitions/subtitle-transitions";
import { Captions } from "./Captions";
import { useCaptions } from "./Editor/captions-provider";
import { postprocessSubtitles } from "./processing/postprocess-subs";
import { getBorderWidthForSubtitles, getSubsAlign } from "./Segment";
import {
  TransitionFromPreviousSubtitles,
  TransitionToNextSubtitles,
} from "./TransitionBetweenSubtitles";

const LINE_HEIGHT = 1.2;

export const Subs: React.FC<{
  trimStart: number;
  canvasLayout: CanvasLayout;
  scene: VideoSceneAndMetadata;
  enterProgress: number;
  exitProgress: number;
  nextScene: SceneAndMetadata | null;
  previousScene: SceneAndMetadata | null;
  theme: Theme;
}> = ({
  trimStart,
  canvasLayout,
  scene,
  enterProgress,
  exitProgress,
  nextScene,
  previousScene,
  theme,
}) => {
  const { width, height } = useVideoConfig();
  const { subtitleType, subtitleFontSize, subtitleLayout, subtitleLines } =
    scene.layout;

  const shouldTransitionToNext = shouldInlineTransitionSubtitles({
    currentScene: scene,
    nextScene,
  });
  const shouldTransitionFromPrevious = shouldInlineTransitionSubtitles({
    currentScene: scene,
    nextScene: previousScene,
  });

  const whisperOutput = useCaptions();
  const postprocessed = useMemo(() => {
    return postprocessSubtitles({
      subTypes: whisperOutput,
      boxWidth: subtitleLayout.width,
      maxLines: subtitleLines,
      fontSize: subtitleFontSize,
      canvasLayout,
      subtitleType,
    });
  }, [
    whisperOutput,
    subtitleLayout.width,
    subtitleLines,
    subtitleFontSize,
    canvasLayout,
    subtitleType,
  ]);

  const outer: React.CSSProperties = useMemo(() => {
    const backgroundColor =
      subtitleType === "square"
        ? COLORS[theme].SUBTITLES_BACKGROUND
        : undefined;

    return {
      fontSize: subtitleFontSize,
      display: "flex",
      lineHeight: LINE_HEIGHT,
      borderWidth: getBorderWidthForSubtitles(subtitleType),
      borderStyle: "solid",
      borderColor: COLORS[theme].BORDER_COLOR,
      backgroundColor,
      ...getSubsAlign({
        canvasLayout,
        subtitleType,
      }),
      ...getSubtitleTransform({
        enterProgress,
        exitProgress,
        canvasHeight: height,
        nextScene,
        previousScene,
        scene,
        canvasWidth: width,
        subtitleType,
      }),
    };
  }, [
    canvasLayout,
    enterProgress,
    exitProgress,
    height,
    nextScene,
    previousScene,
    scene,
    subtitleFontSize,
    subtitleType,
    theme,
    width,
  ]);

  return (
    <AbsoluteFill style={outer}>
      <TransitionFromPreviousSubtitles
        shouldTransitionFromPreviousSubtitle={shouldTransitionFromPrevious}
        subtitleType={subtitleType}
      >
        <TransitionToNextSubtitles
          shouldTransitionToNextsSubtitles={shouldTransitionToNext}
          subtitleType={subtitleType}
        >
          <Captions
            canvasLayout={canvasLayout}
            fontSize={scene.layout.subtitleFontSize}
            lines={scene.layout.subtitleLines}
            segments={postprocessed.segments}
            subtitleType={subtitleType}
            theme={theme}
            trimStart={trimStart}
          />
        </TransitionToNextSubtitles>
      </TransitionFromPreviousSubtitles>
    </AbsoluteFill>
  );
};
