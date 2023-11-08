import { loadFont } from "@remotion/google-fonts/RobotoCondensed";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../../colors";
import type { CanvasLayout } from "../../configuration";
import { transitionDuration } from "../../configuration";

loadFont();

export const TableOfContents: React.FC<{
  canvasLayout: CanvasLayout;
  isTransitioningIn: boolean;
}> = ({ isTransitioningIn }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const swipe = isTransitioningIn
    ? spring({
        fps,
        frame,
        config: {
          damping: 200,
        },
        durationInFrames: transitionDuration,
      })
    : 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.BACKGROUND,
        transform: `translateX(${interpolate(swipe, [0, 1], [width, 0])}px)`,
      }}
    >
      transitions
    </AbsoluteFill>
  );
};
