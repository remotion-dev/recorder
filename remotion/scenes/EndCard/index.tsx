import { loadFont } from "@remotion/google-fonts/RobotoCondensed";
import React from "react";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";
import { COLORS } from "../../colors";
import type {
  CanvasLayout,
  Channel,
  LinkType,
  Platform,
  Theme,
} from "../../configuration";
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
  theme: Theme;
}> = ({ canvasLayout, platform, channel, links, enter, exit, theme }) => {
  const { width } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS[theme].BACKGROUND,
        transform: `translateX(${interpolate(
          enter - exit,
          [0, 1],
          [width, 0],
        )}px)`,
      }}
    >
      <LeftSide
        theme={theme}
        links={links}
        channel={channel}
        platform={platform}
      />
      {canvasLayout === "landscape" ? (
        <ThumbnailContainers theme={theme} />
      ) : null}
    </AbsoluteFill>
  );
};
