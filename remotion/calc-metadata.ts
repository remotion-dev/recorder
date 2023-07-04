import { getVideoMetadata } from "@remotion/media-utils";
import { CalculateMetadataFunction } from "remotion";
import { z } from "zod";
import { AllProps } from "./All";
import {
  fps,
  getPairs,
  introDuration,
  SceneMetadata,
  videoConf,
} from "./configuration";

export const calcMetadata: CalculateMetadataFunction<AllProps> = async ({
  props,
}) => {
  const pairs = getPairs("day2");
  const metadata = await Promise.all(
    pairs.map(async (p, i): Promise<SceneMetadata> => {
      const scene = props.scenes[i];

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
    durationInFrames: totalDuration + introDuration,
    props: {
      ...props,
      pairs,
      metadata,
      scenes: props.scenes,
    },
  };
};
