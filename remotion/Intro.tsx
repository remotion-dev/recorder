import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { introDuration } from "./configuration";

export const Intro: React.FC<{
  title: string;
  subtitle: string;
}> = ({ subtitle, title }) => {
  const { fps, width } = useVideoConfig();
  const frame = useCurrentFrame();

  const show = (delay: number) =>
    spring({
      fps,
      frame,
      durationInFrames: 15,
      config: {
        damping: 200,
      },
      delay: delay,
    });

  const hide = spring({
    fps,
    frame,
    durationInFrames: 20,
    config: {
      damping: 200,
    },
    delay: introDuration,
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
          fontSize: 130,
          color: "#000",
          lineHeight: 1.1,
          fontWeight: "bolder",
          border: "10px solid black",
          borderRadius: 20,
          padding: "15px 40px",
          display: "inline",
          background: "white",
          marginLeft: 30,
          position: "absolute",
          marginTop: 100,
          translate: interpolate(show(6), [0, 1], [width, 0]) + "px",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: "GT Planar",
          fontSize: 60,
          background: "#0B84F3",
          lineHeight: 1.1,
          fontWeight: "bold",
          display: "inline",
          color: "white",
          border: "10px solid black",
          borderRadius: 20,
          padding: "15px 30px",
          position: "absolute",
          marginTop: -140,
          translate: interpolate(show(0), [0, 1], [width, 0]) + "px",
        }}
      >
        {subtitle}
      </div>
    </AbsoluteFill>
  );
};
