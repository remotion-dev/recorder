import { loadFont } from "@remotion/google-fonts/RobotoCondensed";
import React from "react";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";
import { COLORS } from "../../colors";
import type { CanvasLayout, Channel, Platform } from "../../configuration";
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
  enter: number;
  exit: number;
}> = ({ canvasLayout, platform, channel, links, enter, exit }) => {
  const { width } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.BACKGROUND,
        transform: `translateX(${interpolate(
          enter - exit,
          [0, 1],
          [width, 0],
        )}px)`,
      }}
    >
      <LeftSide links={links} channel={channel} platform={platform} />
      {canvasLayout === "wide" ? <ThumbnailContainers /> : null}
    </AbsoluteFill>
  );
};
