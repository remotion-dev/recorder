import { getVideoMetadata } from "@remotion/media-utils";
import type { CalculateMetadataFunction } from "remotion";
import type { AllProps } from "./All";
import { getIsTransitioningIn } from "./animations/transitions";
import type { SceneMetadata } from "./configuration";
import { transitionDuration } from "./configuration";
import { fps, getPairs } from "./configuration";
import { truthy } from "./truthy";

export const calcMetadata: CalculateMetadataFunction<AllProps> = async ({
  props,
}) => {
  const pairs = getPairs(props.prefix);

  let videoIndex = -1;

  const metadata = (
    await Promise.all(
      props.scenes.map(async (scene, i): Promise<SceneMetadata | null> => {
        if (
          scene.type === "title" ||
          scene.type === "titlecard" ||
          scene.type === "endcard"
        ) {
          return {
            videos: null,
            durationInFrames: scene.durationInFrames,
            sumUpDuration: getIsTransitioningIn(props.scenes, i)
              ? scene.durationInFrames - transitionDuration
              : scene.durationInFrames,
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

        return {
          durationInFrames: duration,
          sumUpDuration: getIsTransitioningIn(props.scenes, i)
            ? duration - transitionDuration
            : duration,
          videos: {
            display: dim,
            webcam: {
              height: webcamHeight,
              width: webcamWidth,
            },
          },
        };
      })
    )
  ).filter(truthy);

  const totalDuration = Math.max(
    1,
    metadata.reduce((a, b) => a + b.sumUpDuration, 0)
  );

  return {
    durationInFrames: totalDuration,
    width: props.layout === "wide" ? 1920 : 1080,
    height: props.layout === "wide" || props.layout === "square" ? 1080 : 1920,
    props: {
      ...props,
      pairs,
      metadata,
      scenes: props.scenes,
    },
  };
};
