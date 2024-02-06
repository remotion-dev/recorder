import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  subtitleFont,
  subtitleFontWeight,
  type WebcamPosition,
} from "../configuration";
import { borderRadius, safeSpace } from "../layout/get-layout";

export const SquareChapter: React.FC<{
  title: string;
  webcamPosition: WebcamPosition;
}> = ({ title, webcamPosition }) => {
  const isTop = webcamPosition === "top-left" || webcamPosition === "top-right";
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
          background: "#0b84f3",
          fontFamily: subtitleFont,
          position: "absolute",
          top: isTop ? undefined : safeSpace("square") * 2,
          bottom: isTop ? safeSpace("square") * 2 : undefined,
          left: safeSpace("square") * 2,
          borderRadius,
          fontSize: 50,
          border: "8px solid black",
          fontWeight: subtitleFontWeight,
          scale: String(scale),
          transform: `translateX(${toLeft}px)`,
        }}
      >
        {title}
      </div>
    </AbsoluteFill>
  );
};
