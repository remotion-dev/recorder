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
import type { CanvasLayout, Channel, Platform } from "../../configuration";
import { transitionDuration } from "../../configuration";
import type { LinkType } from "./LeftSide";
import { LeftSide } from "./LeftSide";
import { ThumbnailContainers } from "./RightSide";

loadFont();

export const EndCard: React.FC<{
  channel: Channel;
  canvasLayout: CanvasLayout;
  platform: Platform;
  links: LinkType[];
  isTransitioningIn: boolean;
}> = ({ canvasLayout, platform, channel, links, isTransitioningIn }) => {
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
      <LeftSide links={links} channel={channel} platform={platform} />
      {canvasLayout === "wide" ? <ThumbnailContainers /> : null}
    </AbsoluteFill>
  );
};
