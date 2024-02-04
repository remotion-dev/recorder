import { getVideoMetadata } from "@remotion/media-utils";
import type { CalculateMetadataFunction } from "remotion";
import type { AllProps } from "./All";
import {
  getIsTransitioningOut,
  getSumUpDuration,
} from "./animations/transitions";
import type {
  SceneAndMetadata,
  SceneType,
  SceneVideos,
  WebcamPosition,
} from "./configuration";
import { fps, getPairs, transitionDuration } from "./configuration";
import { getDimensionsForLayout } from "./layout/dimensions";
import { getLayout } from "./layout/get-layout";
import { truthy } from "./truthy";

export const calcMetadata: CalculateMetadataFunction<AllProps> = async ({
  props,
  compositionId,
}) => {
  const pairs = getPairs(compositionId);

  let videoIndex = -1;

  const scenesAndMetadataWithoutDuration = (
    await Promise.all(
      props.scenes.map(async (scene, i): Promise<SceneAndMetadata | null> => {
        if (
          scene.type === "title" ||
          scene.type === "titlecard" ||
          scene.type === "endcard" ||
          scene.type === "tableofcontents" ||
          scene.type === "remotionupdate"
        ) {
          return {
            type: "other-scene",
            scene,
            durationInFrames: scene.durationInFrames,
            from: 0, // Placeholder
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

        let { webcamPosition } = scene;
        let idx = i;
        while (webcamPosition === "previous" && idx >= 0) {
          const prevScene = props.scenes[idx] as SceneType;
          if (prevScene.type === "videoscene") {
            webcamPosition = prevScene.webcamPosition;
          }

          if (webcamPosition === "previous" && idx === 0) {
            webcamPosition = "top-left";
          }

          idx -= 1;
        }

        return {
          type: "video-scene",
          scene,
          videos,
          durationInFrames: duration,
          layout: getLayout({
            webcamPosition: webcamPosition as WebcamPosition,
            videos,
            canvasLayout: props.canvasLayout,
          }),
          pair: p,
          finalWebcamPosition: webcamPosition as WebcamPosition,
          from: 0,
        };
      }),
    )
  ).filter(truthy);

  let addedUpDurations = 0;

  const scenesAndMetadata = scenesAndMetadataWithoutDuration.map(
    (sceneAndMetadata, i) => {
      const from = addedUpDurations;
      addedUpDurations += sceneAndMetadata.durationInFrames;
      if (
        getIsTransitioningOut({
          sceneAndMetadata,
          nextScene: scenesAndMetadataWithoutDuration[i + 1] ?? null,
        })
      ) {
        addedUpDurations -= transitionDuration;
      }

      return {
        ...sceneAndMetadata,
        from,
      };
    },
  );

  const durations = scenesAndMetadata.map((s, i) => {
    return getSumUpDuration({
      scene: s,
      previousScene: scenesAndMetadata[i - 1] ?? null,
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
      prefix: compositionId,
      scenes: props.scenes,
      fps,
      pairs,
      scenesAndMetadata,
      theme: props.theme,
    },
  };
};
