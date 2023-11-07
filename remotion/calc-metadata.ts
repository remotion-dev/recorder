import { getVideoMetadata } from "@remotion/media-utils";
import type { CalculateMetadataFunction } from "remotion";
import type { AllProps } from "./All";
import { getSumUpDuration } from "./animations/transitions";
import type { SceneAndMetadata, SceneVideos } from "./configuration";
import { fps, getPairs } from "./configuration";
import { getDimensionsForLayout } from "./layout/dimensions";
import { getLayout } from "./layout/get-layout";
import { truthy } from "./truthy";

export const calcMetadata: CalculateMetadataFunction<AllProps> = async ({
  props,
}) => {
  const pairs = getPairs(props.prefix);

  let videoIndex = -1;

  const scenesAndMetadata = (
    await Promise.all(
      props.scenes.map(async (scene): Promise<SceneAndMetadata | null> => {
        if (
          scene.type === "title" ||
          scene.type === "titlecard" ||
          scene.type === "endcard" ||
          scene.type === "remotionupdate"
        ) {
          return {
            type: "other-scene",
            scene,
            durationInFrames: scene.durationInFrames,
          };
        }

        videoIndex += 1;
        const p = pairs[videoIndex];
        if (!p) {
          return null;
        }

        const {
          durationInSeconds,
          height: webcamHeight,
          width: webcamWidth,
        } = await getVideoMetadata(p.webcam.src);

        const dim = p.display ? await getVideoMetadata(p.display.src) : null;
        const durationInFrames = Math.round(durationInSeconds * fps);

        const trimStart = scene?.trimStart ?? 0;

        const duration =
          scene?.duration ?? Math.round(durationInFrames - trimStart);

        const videos: SceneVideos = {
          display: dim,
          webcam: {
            height: webcamHeight,
            width: webcamWidth,
          },
        };

        return {
          type: "video-scene",
          scene,
          videos,
          durationInFrames: duration,
          layout: getLayout({
            scene,
            videos,
            canvasLayout: props.canvasLayout,
          }),
          pair: p,
        };
      }),
    )
  ).filter(truthy);

  const durations = scenesAndMetadata.map((s, i) => {
    return getSumUpDuration({
      scene: s,
      previousScene: scenesAndMetadata[i + 1] ?? null,
    });
  });

  const totalDuration = Math.max(
    1,
    durations.reduce((a, b) => a + b, 0),
  );

  return {
    durationInFrames: totalDuration,
    ...getDimensionsForLayout(props.canvasLayout),
    props: {
      canvasLayout: props.canvasLayout,
      prefix: props.prefix,
      scenes: props.scenes,
      fps,
      pairs,
      scenesAndMetadata,
    },
  };
};
