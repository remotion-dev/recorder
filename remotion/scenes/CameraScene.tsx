import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { z } from "zod";
import { getDisplayTranslation } from "../animations/camera-scene-transitions";
import type {
  CanvasLayout,
  configuration,
  Pair,
  SceneMetadata,
} from "../configuration";
import { transitionDuration } from "../configuration";
import type { Layout } from "../layout/get-layout";
import { borderRadius, frameWidth, getLayout } from "../layout/get-layout";
import { Subs } from "../Subs/Subs";
import { WebcamVideo } from "../WebcamVideo";

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
        durationInFrames: transitionDuration,
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
        durationInFrames: transitionDuration,
        config: {
          damping: 200,
        },
        delay: durationInFrames - transitionDuration,
      });
      return spr;
    }

    return 0;
  })();

  if (conf.type !== "scene") {
    throw new Error("Not a scene");
  }

  const displayTranslation = getDisplayTranslation({ enter, exit, width });

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
              translate: `${displayTranslation.translationX}px ${displayTranslation.translationY}px`,
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
          webcamPosition={conf.webcamPosition}
          zoomInAtEnd={conf.zoomInAtEnd}
          shouldExit={shouldExit}
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

export const CameraScene: React.FC<{
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
