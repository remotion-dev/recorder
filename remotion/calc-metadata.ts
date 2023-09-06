import { getVideoMetadata } from "@remotion/media-utils";
import type { CalculateMetadataFunction } from "remotion";
import type { AllProps } from "./All";
import { getIsTransitioningIn } from "./animations/transitions";
import type { CanvasLayout, Dimensions, SceneMetadata } from "./configuration";
import { fps, getPairs, transitionDuration } from "./configuration";
import { truthy } from "./truthy";

export const getDimensionsForLayout = (
  canvasLayout: CanvasLayout
): Dimensions => {
  if (canvasLayout === "square") {
    return {
      height: 1080,
      width: 1080,
    };
  }

  if (canvasLayout === "tall") {
    return {
      height: 1860,
      width: 1080,
    };
  }

  return {
    height: 1080,
    width: 1920,
  };
};

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
    ...getDimensionsForLayout(props.canvasLayout),
    props: {
      ...props,
      pairs,
      metadata,
      scenes: props.scenes,
    },
  };
};
