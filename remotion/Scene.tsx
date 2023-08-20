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
import { titleHideDuration } from "./configuration";
import type { Layout } from "./layout/get-layout";
import { borderRadius, frameWidth, getLayout } from "./layout/get-layout";
import { Subs } from "./Subs/Subs";
import { WebcamVideo } from "./WebcamVideo";

const Inner: React.FC<{
  pair: Pair;
  startFrom: number;
  endAt: number | undefined;
  shouldEnter: boolean;
  shouldExit: boolean;
  conf: z.infer<typeof configuration>;
  displayLayout: Layout | null;
  webcamLayout: Layout;
  canvasLayout: CanvasLayout;
}> = ({
  displayLayout,
  endAt,
  shouldEnter,
  shouldExit,
  pair,
  startFrom,
  webcamLayout,
  conf,
  canvasLayout,
}) => {
  const { fps, width, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const enter = (() => {
    if (shouldEnter) {
      const spr = spring({
        fps,
        frame,
        durationInFrames: titleHideDuration,
        config: {
          damping: 200,
        },
      });
      return spr;
    }

    return 1;
  })();

  const exit = (() => {
    if (shouldExit) {
      const spr = spring({
        fps,
        frame,
        durationInFrames: titleHideDuration,
        config: {
          damping: 200,
        },
        delay: durationInFrames - titleHideDuration,
      });
      return spr;
    }

    return 0;
  })();

  if (conf.type !== "scene") {
    throw new Error("Not a scene");
  }

  return (
    <>
      <AbsoluteFill>
        {displayLayout && pair.display ? (
          <div
            style={{
              width: displayLayout.width,
              height: displayLayout.height,
              left: displayLayout.x,
              top: displayLayout.y,
              position: "absolute",
              padding: frameWidth,
              borderRadius: borderRadius + frameWidth,
              translate:
                interpolate(enter, [0, 1], [width, 0]) +
                interpolate(exit, [0, 1], [0, -width]) +
                "px 0",
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
          exit={exit}
          pair={pair}
          zoomInAtStart={conf.zoomInAtStart ?? false}
          startFrom={startFrom}
          webcamLayout={webcamLayout}
        />
      </AbsoluteFill>
      {pair.sub ? (
        <Subs
          webcamPosition={conf.webcamPosition}
          canvasLayout={canvasLayout}
          trimStart={startFrom}
          file={pair.sub}
          webcamLayout={webcamLayout}
          displayLayout={displayLayout}
          enter={enter}
          exit={exit}
        />
      ) : null}
    </>
  );
};

export const Scene: React.FC<{
  metadata: SceneMetadata;
  pair: Pair;
  conf: z.infer<typeof configuration> | undefined;
  start: number;
  index: number;
  shouldEnter: boolean;
  shouldExit: boolean;
  canvasSize: CanvasLayout;
}> = ({
  metadata,
  pair,
  conf,
  start,
  index,
  shouldEnter,
  shouldExit,
  canvasSize,
}) => {
  const { height, width } = useVideoConfig();

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

  return (
    <Sequence
      name={`Scene ${index}`}
      from={from}
      durationInFrames={Math.max(1, metadata.durationInFrames)}
    >
      <Inner
        canvasLayout={canvasSize}
        conf={conf}
        displayLayout={displayLayout}
        endAt={endAt}
        pair={pair}
        shouldEnter={shouldEnter}
        shouldExit={shouldExit}
        startFrom={startFrom}
        webcamLayout={webcamLayout}
      />
    </Sequence>
  );
};
