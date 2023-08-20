import React from "react";
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { z } from "zod";
import type {
  CanvasLayout,
  configuration,
  Pair,
  SceneMetadata,
} from "./configuration";
import { borderRadius, frameWidth, getLayout } from "./layout/get-layout";
import { Subs } from "./Subs/Subs";
import { WebcamVideo } from "./WebcamVideo";

export const Scene: React.FC<{
  metadata: SceneMetadata;
  pair: Pair;
  conf: z.infer<typeof configuration> | undefined;
  start: number;
  index: number;
  prevWasTitle: boolean;
  canvasSize: CanvasLayout;
}> = ({ metadata, pair, conf, start, index, prevWasTitle, canvasSize }) => {
  const { fps, height, width } = useVideoConfig();
  const frame = useCurrentFrame();

  const from = start;

  if (conf === undefined) {
    return (
      <Sequence
        from={from}
        durationInFrames={Math.max(1, metadata.durationInFrames)}
      >
        <div>
          <h1
            style={{
              backgroundColor: "red",
            }}
          >
            no conf
          </h1>
        </div>
      </Sequence>
    );
  }

  if (conf.type !== "scene") {
    throw new Error("Not a scene");
  }

  if (metadata.videos === null) {
    throw new Error("No videos");
  }

  const startFrom = conf.trimStart ?? 0;
  const endAt = conf.duration ? startFrom + conf.duration : undefined;

  const { displayLayout, webcamLayout } = getLayout({
    display: metadata.videos.display,
    webcam: metadata.videos.webcam,
    canvasSize: {
      width,
      height,
    },
    canvasLayout: canvasSize,
    webcamPosition: conf.webcamPosition,
  });

  const enter = (() => {
    if (prevWasTitle) {
      const spr = spring({
        fps,
        frame,
        durationInFrames: 20,
        config: {
          damping: 200,
        },
        delay: from,
      });
      return spr;
    }

    return 1;
  })();

  return (
    <Sequence
      name={`Scene ${index}`}
      from={from}
      durationInFrames={Math.max(1, metadata.durationInFrames)}
    >
      <AbsoluteFill>
        {displayLayout && pair.display ? (
          <div
            style={{
              width: displayLayout.width,
              height: displayLayout.height,
              left: displayLayout.x,
              top: displayLayout.y,
              position: "absolute",
              // backgroundColor: "black",
              padding: frameWidth,
              borderRadius: borderRadius + frameWidth,
              translate: interpolate(enter, [0, 1], [width, 0]) + "px 0",
            }}
          >
            <OffthreadVideo
              startFrom={startFrom}
              endAt={endAt}
              src={pair.display.src}
              style={{
                maxWidth: "100%",
                borderRadius,
              }}
            />
          </div>
        ) : null}
        <WebcamVideo
          endAt={endAt}
          enter={enter}
          pair={pair}
          zoomInAtStart={conf.zoomInAtStart ?? false}
          startFrom={startFrom}
          webcamLayout={webcamLayout}
        />
      </AbsoluteFill>
      {pair.sub ? (
        <Subs
          webcamPosition={conf.webcamPosition}
          canvasLayout={canvasSize}
          trimStart={startFrom}
          file={pair.sub}
          webcamLayout={webcamLayout}
          displayLayout={displayLayout}
        />
      ) : null}
    </Sequence>
  );
};
