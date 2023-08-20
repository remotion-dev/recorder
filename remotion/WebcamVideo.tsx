import React from "react";
import {
  interpolate,
  OffthreadVideo,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Pair } from "./configuration";
import type { Layout } from "./layout/get-layout";
import { borderRadius, frameWidth } from "./layout/get-layout";

export const WebcamVideo: React.FC<{
  webcamLayout: Layout;
  enter: number;
  exit: number;
  startFrom: number;
  endAt: number | undefined;
  pair: Pair;
  zoomInAtStart: boolean;
}> = ({ webcamLayout, enter, exit, zoomInAtStart, startFrom, endAt, pair }) => {
  const { height, width, fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const zoomIn = zoomInAtStart
    ? spring({
        fps,
        frame,
        config: {
          damping: 200,
        },
        durationInFrames: 10,
      })
    : 0;

  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
      }}
    >
      <div
        style={{
          borderRadius: borderRadius + frameWidth,
          overflow: "hidden",
          padding: frameWidth,
          // backgroundColor: "black",
          width: webcamLayout.width,
          height: webcamLayout.height,
          left: webcamLayout.x,
          top: webcamLayout.y,
          position: "relative",
          translate: `${interpolate(exit, [0, 1], [0, -width])}px ${interpolate(
            enter,
            [0, 1],
            [height, 0]
          )}px`,
        }}
      >
        <OffthreadVideo
          startFrom={startFrom}
          endAt={endAt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            borderRadius,
            overflow: "hidden",
            scale: String(zoomIn * 0.4 + 1),
          }}
          src={pair.webcam.src}
        />
      </div>
    </div>
  );
};
