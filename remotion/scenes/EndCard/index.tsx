import { loadFont } from "@remotion/google-fonts/RobotoCondensed";
import React from "react";
import { AbsoluteFill } from "remotion";
import type { CanvasLayout, Channel, Platform } from "../../configuration";
import { LeftSide } from "./LeftSide";
import { ThumbnailContainers } from "./RightSide";

loadFont();

export const EndCard: React.FC<{
  channel: Channel;
  canvasLayout: CanvasLayout;
  platform: Platform;
  isTransitioningIn: boolean;
}> = ({ canvasLayout }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "white",
      }}
    >
      <LeftSide />
      {canvasLayout === "wide" ? <ThumbnailContainers /> : null}
    </AbsoluteFill>
  );
};
