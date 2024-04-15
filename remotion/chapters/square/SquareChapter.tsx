import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TITLE_FONT_FAMILY, TITLE_FONT_WEIGHT } from "../../../config/fonts";
import { getSafeSpace } from "../../../config/layout";
import type { FinalWebcamPosition } from "../../../config/scenes";
import type { Theme } from "../../../config/themes";
import { COLORS } from "../../../config/themes";
import { isWebCamAtBottom } from "../../animations/webcam-transitions/helpers";
import { borderRadius } from "../../layout/get-layout";

export const SquareChapter: React.FC<{
  title: string;
  webcamPosition: FinalWebcamPosition;
  theme: Theme;
}> = ({ title, webcamPosition, theme }) => {
  const isTop = !isWebCamAtBottom(webcamPosition);
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const scale = spring({
    fps,
    frame,
  });

  const toLeft =
    spring({
      fps,
      frame,
      config: {
        damping: 200,
      },
      delay: 70,
    }) * -width;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          color: "white",
          padding: "16px 30px",
          background: COLORS[theme].ACCENT_COLOR,
          fontFamily: TITLE_FONT_FAMILY,
          position: "absolute",
          top: isTop ? undefined : getSafeSpace("square") * 2,
          bottom: isTop ? getSafeSpace("square") * 2 : undefined,
          left: getSafeSpace("square") * 2,
          borderRadius,
          fontSize: 50,
          border: "8px solid black",
          fontWeight: TITLE_FONT_WEIGHT,
          scale: String(scale),
          transform: `translateX(${toLeft}px)`,
        }}
      >
        {title}
      </div>
    </AbsoluteFill>
  );
};
