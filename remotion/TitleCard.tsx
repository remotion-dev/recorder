import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { transitionDuration } from "./configuration";

export const TitleCard: React.FC<{
  title: string;
  durationInFrames: number;
}> = ({ title, durationInFrames }) => {
  const { fps, width } = useVideoConfig();
  const frame = useCurrentFrame();

  const show = (delay: number) =>
    spring({
      fps,
      frame,
      durationInFrames: transitionDuration,
      config: {
        damping: 200,
      },
      delay,
    });

  const hide = spring({
    fps,
    frame,
    durationInFrames: transitionDuration,
    config: {
      damping: 200,
    },
    delay: durationInFrames,
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        translate: interpolate(hide, [0, 1], [0, -width]) + "px 0",
      }}
    >
      <div
        style={{
          fontFamily: "GT Planar",
          fontSize: 60,
          color: "#000",
          lineHeight: 1.1,
          fontWeight: "bolder",
          border: "10px solid black",
          borderRadius: 20,
          padding: "15px 40px",
          display: "inline",
          background: "#fff",
          position: "absolute",
          translate: interpolate(show(0), [0, 1], [width, 0]) + "px",
        }}
      >
        {title}
      </div>
    </AbsoluteFill>
  );
};
