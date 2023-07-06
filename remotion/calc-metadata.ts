import { getVideoMetadata } from "@remotion/media-utils";
import { CalculateMetadataFunction } from "remotion";
import { AllProps } from "./All";
import { fps, getPairs, titleDuration, SceneMetadata } from "./configuration";

export const calcMetadata: CalculateMetadataFunction<AllProps> = async ({
  props,
}) => {
  const pairs = getPairs(props.prefix);

  let videoIndex = -1;

  const metadata = await Promise.all(
    props.scenes.map(async (scene, i): Promise<SceneMetadata> => {
      if (scene.isTitle) {
        return {
          width: 0,
          height: 0,
          durationInFrames: titleDuration,
        };
      }

      videoIndex += 1;
      const p = pairs[videoIndex];

      const { durationInSeconds, height, width } = await getVideoMetadata(
        p.display.src
      );
      const durationInFrames = Math.round(durationInSeconds * fps);

      const trimStart = scene?.trimStart ?? 0;

      const duration =
        scene?.duration ?? Math.round(durationInFrames - trimStart);

      return {
        durationInFrames: duration,
        height,
        width,
      };
    })
  );

  const totalDuration = Math.max(
    1,
    metadata.reduce((a, b) => a + b.durationInFrames, 0)
  );

  return {
    durationInFrames: totalDuration,
    props: {
      ...props,
      pairs,
      metadata,
      scenes: props.scenes,
    },
  };
};
