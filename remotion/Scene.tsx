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
import type { configuration, Pair, SceneMetadata } from "./configuration";
import {
  borderRadius,
  frameWidth,
  getLayout,
  safeSpaceBottom,
} from "./configuration";

export const Scene: React.FC<{
  metadata: SceneMetadata;
  pair: Pair;
  conf: z.infer<typeof configuration> | undefined;
  start: number;
  index: number;
  prevWasTitle: boolean;
}> = ({ metadata, pair, conf, start, index, prevWasTitle }) => {
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

  const videoStyle = (() => {
    if (conf.webcamPosition === "bottom-left") {
      return {
        justifyContent: "flex-end",
        alignItems: "flex-start",
      };
    }

    if (conf.webcamPosition === "bottom-right") {
      return {
        justifyContent: "flex-end",
        alignItems: "flex-end",
      };
    }

    if (conf.webcamPosition === "top-left") {
      return {
        justifyContent: "flex-start",
        alignItems: "flex-start",
      };
    }

    return {
      justifyContent: "flex-start",
      alignItems: "flex-end",
    };
  })();

  const startFrom = conf.trimStart ?? 0;
  const endAt = conf.duration ? startFrom + conf.duration : undefined;

  const layout = getLayout(metadata.displayWidth, metadata.displayHeight);

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
        {pair.display ? (
          <div
            style={{
              width: layout.width,
              height: layout.height,
              left: layout.x,
              top: layout.y,
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

        <AbsoluteFill
          style={{
            ...videoStyle,
            padding: 40,
            paddingBottom: safeSpaceBottom,
            translate: "0 " + interpolate(enter, [0, 1], [height, 0]) + "px",
          }}
        >
          <div
            style={{
              borderRadius: borderRadius + frameWidth,
              overflow: "hidden",
              padding: frameWidth,
              backgroundColor: "black",
            }}
          >
            <OffthreadVideo
              startFrom={startFrom}
              endAt={endAt}
              style={{
                width: 350,
                height: 400,
                objectFit: "cover",
                display: "block",
                borderRadius,
                overflow: "hidden",
              }}
              src={pair.webcam.src}
            />
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </Sequence>
  );
};
