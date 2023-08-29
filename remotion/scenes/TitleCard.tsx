import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { transitionDuration } from "../configuration";
import { borderRadius, safeSpace } from "../layout/get-layout";

export const TitleCard: React.FC<{
  title: string;
  durationInFrames: number;
  image: string;
}> = ({ title, durationInFrames, image }) => {
  const { fps, width, height } = useVideoConfig();
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
    delay: durationInFrames - transitionDuration,
  });

  const desiredImageWidth = width - safeSpace("square") * 2;
  const actualImageHeight = Math.min(
    height * 0.7,
    (desiredImageWidth / 16) * 9
  );
  const actualImageWidth = (actualImageHeight / 9) * 16;

  return (
    <AbsoluteFill
      style={{
        translate:
          interpolate(hide, [0, 1], [0, -width]) +
          interpolate(show(0), [0, 1], [width, 0]) +
          "px 0",
      }}
    >
      <Sequence from={6}>
        <Audio src={staticFile("sounds/whipwhoosh2.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={20}>
        <Audio src={staticFile("sounds/whipwhoosh.mp3")} volume={0.5} />
      </Sequence>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            overflow: "hidden",
            borderRadius,
          }}
        >
          <Img
            style={{
              width: actualImageWidth,
              height: actualImageHeight,
              transform: `scale(${
                show(6) + interpolate(frame, [0, 100], [0, 0.1])
              })`,
            }}
            src={image}
          />
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `translateY(${actualImageHeight / 2}px)`,
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
            transform: `scale(${show(20)})`,
          }}
        >
          {title}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
