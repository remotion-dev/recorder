import { getVideoMetadata } from "@remotion/media-utils";
import type { CalculateMetadataFunction } from "remotion";
import type {
  Pair,
  SceneAndMetadata,
  SceneType,
  SceneVideos,
  WebcamPosition,
} from "../config/scenes";
import type { AllProps } from "./All";
import {
  getShouldTransitionOut,
  getSumUpDuration,
} from "./animations/transitions";
import { FPS, transitionDuration } from "./configuration";
import { getDimensionsForLayout } from "./layout/dimensions";
import { getLayout } from "./layout/get-layout";
import { truthy } from "./truthy";

import { getStaticFiles } from "remotion";

const getPairs = (prefix: string) => {
  const files = getStaticFiles().filter((f) => f.name.startsWith(prefix));

  const pairs = files
    .map((f): Pair | null => {
      if (f.name.startsWith(`${prefix}/webcam`)) {
        const timestamp = f.name
          .replace(`${prefix}/webcam`, "")
          .replace(".webm", "")
          .replace(".mp4", "");
        const display = files.find(
          (_f) =>
            _f.name === `${prefix}/display${timestamp}.webm` ||
            _f.name === `${prefix}/display${timestamp}.mp4`,
        );

        const sub = files.find((_f) => {
          return _f.name === `${prefix}/subs${timestamp}.json`;
        });

        return { display: display ?? null, webcam: f, sub: sub ?? null };
      }

      return null;
    })
    .filter(Boolean) as Pair[];
  return pairs;
};

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
            chapter: null,
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
        const durationInFrames = Math.round(durationInSeconds * FPS);

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
          chapter: scene.newChapter ?? null,
        };
      }),
    )
  ).filter(truthy);

  let addedUpDurations = 0;
  let currentChapter: string | null = null;

  const scenesAndMetadata = scenesAndMetadataWithoutDuration.map(
    (sceneAndMetadata, i) => {
      const from = addedUpDurations;
      addedUpDurations += sceneAndMetadata.durationInFrames;
      if (
        sceneAndMetadata.type === "video-scene" &&
        sceneAndMetadata.scene.newChapter
      ) {
        currentChapter = sceneAndMetadata.scene.newChapter;
      }

      if (
        getShouldTransitionOut({
          sceneAndMetadata,
          nextScene: scenesAndMetadataWithoutDuration[i + 1] ?? null,
        })
      ) {
        addedUpDurations -= transitionDuration;
      }

      const retValue = {
        ...sceneAndMetadata,
        from,
        chapter: currentChapter,
      };
      if (
        sceneAndMetadata.type === "video-scene" &&
        sceneAndMetadata.scene.stopChapteringAfterThis
      ) {
        currentChapter = null;
      }

      return retValue;
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
      fps: FPS,
      pairs,
      scenesAndMetadata,
      theme: props.theme,
    },
  };
};
