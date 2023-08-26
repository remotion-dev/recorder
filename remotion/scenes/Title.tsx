import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { transitionDuration } from "../configuration";

export const Title: React.FC<{
  title: string;
  subtitle: string | null;
  durationInFrames: number;
}> = ({ subtitle, title, durationInFrames }) => {
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
          fontSize: 130,
          color: subtitle ? "#000" : "#fff",
          lineHeight: 1.1,
          fontWeight: "bolder",
          border: "10px solid black",
          borderRadius: 20,
          padding: "15px 40px",
          display: "inline",
          background: subtitle ? "white" : "#0B84F3",
          marginLeft: subtitle ? 30 : 0,
          position: "absolute",
          marginTop: subtitle ? 100 : 0,
          translate: interpolate(show(6), [0, 1], [width, 0]) + "px",
        }}
      >
        {title}
      </div>
      {subtitle ? (
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
      ) : null}
    </AbsoluteFill>
  );
};
