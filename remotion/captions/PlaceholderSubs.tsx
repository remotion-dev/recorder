import React, { useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  useVideoConfig,
} from "remotion";
import {
  MONOSPACE_FONT_FAMILY,
  REGULAR_FONT_FAMILY,
  REGULAR_FONT_WEIGHT,
  waitForFonts,
} from "../../config/fonts";
import type { CanvasLayout } from "../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../config/scenes";
import type { Theme } from "../../config/themes";
import { COLORS } from "../../config/themes";
import { shouldInlineTransitionSubtitles } from "../animations/subtitle-transitions/should-transition-subtitle";
import { getSubtitleTransform } from "../animations/subtitle-transitions/subtitle-transitions";
import { getBorderWidthForSubtitles, getSubsAlign } from "./Segment";
import {
  TransitionFromPreviousSubtitles,
  TransitionToNextSubtitles,
} from "./TransitionBetweenSubtitles";

const LINE_HEIGHT = 1.2;

export const PlaceholderSubs: React.FC<{
  canvasLayout: CanvasLayout;
  scene: VideoSceneAndMetadata;
  enterProgress: number;
  exitProgress: number;
  nextScene: SceneAndMetadata | null;
  previousScene: SceneAndMetadata | null;
  theme: Theme;
}> = ({
  canvasLayout,
  scene,
  enterProgress,
  exitProgress,
  nextScene,
  previousScene,
  theme,
}) => {
  const { width, height } = useVideoConfig();
  const [handle] = useState(() => delayRender());

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const delay = delayRender("Waiting for fonts to be loaded");

    waitForFonts()
      .then(() => {
        continueRender(delay);
        setFontsLoaded(true);
      })
      .catch((err) => {
        cancelRender(err);
      });
  }, [fontsLoaded, handle]);

  const { subtitleType } = scene.layout;

  const shouldTransitionToNext = shouldInlineTransitionSubtitles({
    currentScene: scene,
    nextScene,
  });
  const shouldTransitionFromPrevious = shouldInlineTransitionSubtitles({
    currentScene: scene,
    nextScene: previousScene,
  });
  const textStyle: React.CSSProperties = useMemo(() => {
    return {
      fontFamily: REGULAR_FONT_FAMILY,
      fontWeight: REGULAR_FONT_WEIGHT,
      margin: 30,
      opacity: 0.6,
    };
  }, []);

  const outer: React.CSSProperties = {
    fontSize: 20,
    display: "flex",
    lineHeight: LINE_HEIGHT,
    border: `${getBorderWidthForSubtitles(subtitleType)}px solid ${
      COLORS[theme].BORDER_COLOR
    }`,
    backgroundColor:
      subtitleType === "square" || subtitleType === "overlayed-center"
        ? COLORS[theme].SUBTITLES_BACKGROUND
        : undefined,
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
          <div style={textStyle}>
            No subtitles found for this scene. Run the command{" "}
            <span
              style={{
                fontFamily: MONOSPACE_FONT_FAMILY,
                color: COLORS[theme].ACCENT_COLOR,
              }}
            >
              bun sub.ts
            </span>{" "}
            in your terminal to generate subtitles for this recording.
          </div>
        </TransitionToNextSubtitles>
      </TransitionFromPreviousSubtitles>
    </AbsoluteFill>
  );
};
