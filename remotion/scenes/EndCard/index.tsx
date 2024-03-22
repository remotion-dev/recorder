import { loadFont } from "@remotion/google-fonts/RobotoCondensed";
import React from "react";
import { AbsoluteFill } from "remotion";
import type { Channel, Platform } from "../../../config/socials";
import { COLORS } from "../../colors";
import type { CanvasLayout, LinkType, Theme } from "../../configuration";
import { LeftSide } from "./LeftSide";
import { ThumbnailContainers } from "./RightSide";

loadFont();

export const EndCard: React.FC<{
  channel: Channel;
  canvasLayout: CanvasLayout;
  platform: Platform;
  links: LinkType[];
  theme: Theme;
}> = ({ canvasLayout, platform, channel, links, theme }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS[theme].BACKGROUND,
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
