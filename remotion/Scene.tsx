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
  CanvasSize,
  configuration,
  Pair,
  SceneMetadata,
} from "./configuration";
import {
  borderRadius,
  frameWidth,
  getLayout,
  webCamCSS,
} from "./layout/get-layout";
import { Subs } from "./Subs/Subs";

export const Scene: React.FC<{
  metadata: SceneMetadata;
  pair: Pair;
  conf: z.infer<typeof configuration> | undefined;
  start: number;
  index: number;
  prevWasTitle: boolean;
  canvasSize: CanvasSize;
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

  const startFrom = conf.trimStart ?? 0;
  const endAt = conf.duration ? startFrom + conf.duration : undefined;

  const { displayLayout, webcamLayout } = getLayout({
    display: metadata.display,
    webcam: metadata.webcam,
    canvasWidth: width,
    canvasHeight: height,
    canvasSize,
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
      <AbsoluteFill style={{}}>
        {displayLayout && pair.display ? (
          <div
            style={{
              width: displayLayout.width,
              height: displayLayout.height,
              left: displayLayout.x,
              top: displayLayout.y,
              position: "absolute",
              backgroundColor: "black",
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

        {webcamLayout ? (
          <div
            style={{
              position: "absolute",
              display: "flex",
              ...webCamCSS(conf.webcamPosition, canvasSize),
            }}
          >
            <div
              style={{
                borderRadius: borderRadius + frameWidth,
                overflow: "hidden",
                padding: frameWidth,
                backgroundColor: "black",
                width: webcamLayout.width,
                height: webcamLayout.height,
                position: "relative",
                translate:
                  "0 " + interpolate(enter, [0, 1], [height, 0]) + "px",
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
                }}
                src={pair.webcam.src}
              />
            </div>
          </div>
        ) : null}
      </AbsoluteFill>
      {pair.sub ? (
        <Subs canvasSize={canvasSize} trimStart={startFrom} file={pair.sub} />
      ) : null}
    </Sequence>
  );
};
