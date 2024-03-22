import { loadFont } from "@remotion/google-fonts/RobotoCondensed";
import React from "react";
import { AbsoluteFill } from "remotion";
import type { Brand, LinkType, Platform } from "../../../config/endcard";
import type { CanvasLayout } from "../../../config/scenes";
import type { Theme } from "../../../config/themes";
import { COLORS } from "../../../config/themes";
import { LeftSide } from "./LeftSide";
import { ThumbnailContainers } from "./RightSide";

loadFont();

export const EndCard: React.FC<{
  channel: Brand;
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
