import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SCENE_TRANSITION_DURATION } from "../../config/transitions";
import type { SubtitleType } from "./Segment";

export const TransitionFromPreviousSubtitles: React.FC<{
  children: React.ReactNode;
  shouldTransitionFromPreviousSubtitle: boolean;
  subtitleType: SubtitleType;
}> = ({ children, shouldTransitionFromPreviousSubtitle, subtitleType }) => {
  const frame = useCurrentFrame();
  if (
    !shouldTransitionFromPreviousSubtitle ||
    subtitleType === "overlayed-center"
  ) {
    return <div>{children}</div>;
  }

  if (subtitleType === "below-video") {
    return (
      <div style={{ opacity: frame >= SCENE_TRANSITION_DURATION / 2 ? 1 : 0 }}>
        {children}
      </div>
    );
  }

  if (subtitleType === "square") {
    return (
      <div
        style={{
          // TODO: Differentiate between layout change and not
          opacity: interpolate(
            frame,
            [SCENE_TRANSITION_DURATION, SCENE_TRANSITION_DURATION + 5],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          ),
        }}
      >
        {children}
      </div>
    );
  }

  throw new Error("Unknown subtitle type: " + subtitleType);
};

export const TransitionToNextSubtitles: React.FC<{
  children: React.ReactNode;
  shouldTransitionToNextsSubtitles: boolean;
  subtitleType: SubtitleType;
}> = ({ children, shouldTransitionToNextsSubtitles, subtitleType }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  if (
    !shouldTransitionToNextsSubtitles ||
    subtitleType === "overlayed-center"
  ) {
    return <div>{children}</div>;
  }

  if (subtitleType === "below-video") {
    return (
      <div
        style={{
          opacity:
            frame < durationInFrames - SCENE_TRANSITION_DURATION / 2 ? 1 : 0,
        }}
      >
        {children}
      </div>
    );
  }

  if (subtitleType === "square") {
    return (
      <div
        style={{
          opacity: interpolate(
            frame,
            [
              durationInFrames - SCENE_TRANSITION_DURATION - 5,
              durationInFrames - SCENE_TRANSITION_DURATION,
            ],
            [1, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          ),
        }}
      >
        {children}
      </div>
    );
  }

  throw new Error("Unknown subtitle type: " + subtitleType);
};
