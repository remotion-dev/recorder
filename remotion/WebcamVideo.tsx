import React from "react";
import {
  OffthreadVideo,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { getWebcamTranslation } from "./animations/camera-scene-transitions";
import type { Pair, WebcamPosition } from "./configuration";
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
  zoomInAtEnd: boolean;
  webcamPosition: WebcamPosition;
}> = ({
  webcamLayout,
  enter,
  exit,
  zoomInAtStart,
  zoomInAtEnd,
  startFrom,
  endAt,
  pair,
  webcamPosition,
}) => {
  const { height, width, fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const zoomIn = zoomInAtEnd
    ? spring({
        fps,
        frame,
        config: { damping: 200 },
        durationInFrames: 20,
        delay: durationInFrames - 20,
      })
    : zoomInAtStart
    ? spring({
        fps,
        frame,
        config: {
          damping: 200,
        },
        durationInFrames: 10,
      })
    : 0;

  const webcamTranslation = getWebcamTranslation({
    enter,
    exit,
    height,
    width,
    webcamPosition,
  });

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
          width: webcamLayout.width,
          height: webcamLayout.height,
          left: webcamLayout.x,
          top: webcamLayout.y,
          position: "relative",
          translate: `${webcamTranslation.translationX}px ${webcamTranslation.translationY}px`,
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
