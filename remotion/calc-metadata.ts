import { getVideoMetadata } from "@remotion/media-utils";
import type { CalculateMetadataFunction, StaticFile } from "remotion";
import { getStaticFiles } from "remotion";
import {
  ALTERNATIVE1_PREFIX,
  ALTERNATIVE2_PREFIX,
  DISPLAY_PREFIX,
  SUBS_PREFIX,
  WEBCAM_PREFIX,
} from "../config/cameras";
import { waitForFonts } from "../config/fonts";
import { FPS } from "../config/fps";
import {
  type FinalWebcamPosition,
  type Pair,
  type SceneAndMetadata,
  type SceneType,
  type SceneVideos,
  type WebcamPosition,
} from "../config/scenes";
import { SCENE_TRANSITION_DURATION } from "../config/transitions";
import {
  getShouldTransitionOut,
  getSumUpDuration,
} from "./animations/transitions";
import type { WhisperOutput } from "./captions/types";
import { truthy } from "./helpers/truthy";
import { getDimensionsForLayout } from "./layout/dimensions";
import { getLayout } from "./layout/get-layout";
import type { MainProps } from "./Main";
import { applyBRollRules } from "./scenes/BRoll/apply-b-roll-rules";
import { getBRollDimensions } from "./scenes/BRoll/get-broll-dimensions";

const TIMESTAMP_PADDING_IN_FRAMES = Math.floor(FPS / 2);

const getTransitionAdjustedStartframe = (
  sceneAndMetadata: SceneAndMetadata,
  comesFromTransition: boolean,
): number => {
  if (sceneAndMetadata.type === "other-scene") {
    return 0;
  }

  const { startFrame } = sceneAndMetadata;

  if (comesFromTransition) {
    // add startOffset to calculation
    const subtracted = startFrame - SCENE_TRANSITION_DURATION;
    return subtracted > 0 ? subtracted : 0;
  }

  return sceneAndMetadata.startFrame;
};

const deriveStartFrameFromSubs = (subsJSON: WhisperOutput | null): number => {
  if (!subsJSON) {
    return 0;
  }

  // taking the first real word and take its start timestamp in ms.
  const startFromInHundrethsOfSec = subsJSON.transcription[1]?.tokens[0]?.t_dtw;
  if (startFromInHundrethsOfSec === undefined) {
    return 0;
  }

  const startFromInFrames =
    Math.floor((startFromInHundrethsOfSec / 100) * FPS) -
    TIMESTAMP_PADDING_IN_FRAMES;
  return startFromInFrames > 0 ? startFromInFrames : 0;
};

const deriveEndFrameFromSubs = (
  subsJSON: WhisperOutput | null,
): number | null => {
  if (!subsJSON) {
    return null;
  }

  // taking the first real word and take its start timestamp in ms.
  const indexOfLastTranscriptionElem = subsJSON.transcription.length - 1;

  const endAtInHunrethsOfSec =
    subsJSON.transcription[indexOfLastTranscriptionElem]?.tokens[0]?.t_dtw;

  if (endAtInHunrethsOfSec === undefined) {
    return null;
  }

  const endAtInFrames =
    Math.floor((endAtInHunrethsOfSec / 100) * FPS) +
    TIMESTAMP_PADDING_IN_FRAMES;

  return endAtInFrames;
};

const fetchSubsJson = async (
  file: StaticFile | null,
): Promise<WhisperOutput | null> => {
  if (!file) {
    return null;
  }

  try {
    const res = await fetch(file.src);
    const data = await res.json();
    return data as WhisperOutput;
  } catch (error) {
    console.error("Error fetching WhisperOutput from JSON:", error);
    return null;
  }
};

const getPairs = (prefix: string) => {
  const files = getStaticFiles().filter((f) => f.name.startsWith(prefix));

  return (
    files
      .map((file): Pair | null => {
        if (!file.name.startsWith(`${prefix}/${WEBCAM_PREFIX}`)) {
          return null;
        }

        const timestamp = file.name
          .toLowerCase()
          .replace(`${prefix}/${WEBCAM_PREFIX}`, "")
          .replace(".webm", "")
          .replace(".mov", "")
          .replace(".mp4", "");

        const display = files.find((_f) =>
          _f.name.startsWith(`${prefix}/${DISPLAY_PREFIX}${timestamp}.`),
        );
        const sub = files.find((_f) =>
          _f.name.startsWith(`${prefix}/${SUBS_PREFIX}${timestamp}.`),
        );
        const alternative1 = files.find((_f) =>
          _f.name.startsWith(`${prefix}/${ALTERNATIVE1_PREFIX}${timestamp}.`),
        );
        const alternative2 = files.find((_f) =>
          _f.name.startsWith(`${prefix}/${ALTERNATIVE2_PREFIX}${timestamp}.`),
        );

        return {
          webcam: file,
          display: display ?? null,
          subs: sub ?? null,
          alternative1: alternative1 ?? null,
          alternative2: alternative2 ?? null,
          timestamp: parseInt(timestamp, 10),
        };
      })
      .filter(Boolean) as Pair[]
  ).sort((a, b) => a.timestamp - b.timestamp);
};

export const calcMetadata: CalculateMetadataFunction<MainProps> = async ({
  props,
  compositionId,
}) => {
  const pairs = getPairs(compositionId);
  let videoIndex = -1;
  const scenesAndMetadataWithoutDuration = (
    await Promise.all(
      props.scenes.map(async (scene, i): Promise<SceneAndMetadata | null> => {
        if (scene.type !== "videoscene") {
          return {
            type: "other-scene",
            scene,
            durationInFrames: scene.durationInFrames,
            from: 0,
            chapter: null,
          };
        }

        videoIndex += 1;
        const PLACE_HOLDER_DURATION_IN_FRAMES = 60;
        const p = pairs[videoIndex];
        if (!p) {
          return {
            type: "other-scene",
            scene: {
              ...scene,
              type: "title",
              title: "No clip",
              subtitle: `No more clips in public/${compositionId}`,
              durationInFrames: PLACE_HOLDER_DURATION_IN_FRAMES,
            },
            durationInFrames: PLACE_HOLDER_DURATION_IN_FRAMES,
            from: 0,
            chapter: null,
          };
        }

        const {
          durationInSeconds,
          height: webcamHeight,
          width: webcamWidth,
        } = await getVideoMetadata(p.webcam.src);

        const dim = p.display ? await getVideoMetadata(p.display.src) : null;

        const subsJson = await fetchSubsJson(p.subs);

        const startFromSubs = deriveStartFrameFromSubs(subsJson);

        const startFrame = startFromSubs + scene.startOffset;

        const derivedEndFrame =
          deriveEndFrameFromSubs(subsJson) ??
          Math.round(durationInSeconds * FPS);
        const durationInFrames =
          durationInSeconds === Infinity
            ? PLACE_HOLDER_DURATION_IN_FRAMES
            : derivedEndFrame - startFrame;

        console.log("durationInFrame", durationInFrames);
        // Intentionally using ||
        // By default, Zod will give it a value of 0, which shifts the timeline
        const duration = scene.duration || Math.round(durationInFrames);

        const videos: SceneVideos = {
          display: dim,
          webcam: {
            height: webcamHeight,
            width: webcamWidth,
          },
        };

        // eslint-disable-next-line prefer-destructuring
        let webcamPosition: FinalWebcamPosition | "previous" =
          scene.webcamPosition;
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

        if (props.canvasLayout === "landscape" && !p.display) {
          webcamPosition = "center";
        }

        const bRollWithDimensions = await Promise.all(
          scene.bRolls.map((bRoll) => {
            return getBRollDimensions(bRoll);
          }),
        );

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
          startFrame: startFromSubs,
          endFrame: derivedEndFrame,
          bRolls: bRollWithDimensions,
        };
      }),
    )
  ).filter(truthy);

  let addedUpDurations = 0;
  let currentChapter: string | null = null;

  await waitForFonts();

  const scenesAndMetadata = scenesAndMetadataWithoutDuration.map(
    (sceneAndMetadata, i) => {
      const previousSceneAndMetaData =
        scenesAndMetadataWithoutDuration[i - 1] ?? null;
      const currentSceneAndMetadata =
        scenesAndMetadataWithoutDuration[i] ?? null;

      const comesFromTransition = previousSceneAndMetaData
        ? getShouldTransitionOut({
            sceneAndMetadata: previousSceneAndMetaData,
            nextScene: currentSceneAndMetadata,
          })
        : false;

      const transitionAdjustedStartFrame = getTransitionAdjustedStartframe(
        sceneAndMetadata,
        comesFromTransition,
      );

      const additionalTransitionFrames =
        sceneAndMetadata.type === "other-scene"
          ? 0
          : sceneAndMetadata.startFrame - transitionAdjustedStartFrame;

      const delta = SCENE_TRANSITION_DURATION - additionalTransitionFrames;

      const from = addedUpDurations;
      addedUpDurations += sceneAndMetadata.durationInFrames - delta;
      if (
        sceneAndMetadata.type === "video-scene" &&
        sceneAndMetadata.scene.newChapter
      ) {
        currentChapter = sceneAndMetadata.scene.newChapter;
      }

      // if (
      //   getShouldTransitionOut({
      //     sceneAndMetadata,
      //     nextScene: scenesAndMetadataWithoutDuration[i + 1] ?? null,
      //   })
      // ) {
      //   addedUpDurations -= SCENE_TRANSITION_DURATION;
      // }

      console.log(i, additionalTransitionFrames);

      const retValue: SceneAndMetadata = {
        ...sceneAndMetadata,
        ...(sceneAndMetadata.type === "video-scene"
          ? {
              bRolls: applyBRollRules({
                bRolls: sceneAndMetadata.bRolls,
                sceneDurationInFrames:
                  sceneAndMetadata.durationInFrames +
                  additionalTransitionFrames,
                willTransitionToNextScene: getShouldTransitionOut({
                  sceneAndMetadata,
                  nextScene: scenesAndMetadataWithoutDuration[i + 1] ?? null,
                }),
              }),
              startFrame: transitionAdjustedStartFrame,
            }
          : {}),

        durationInFrames:
          sceneAndMetadata.durationInFrames + additionalTransitionFrames,
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

  const durations = scenesAndMetadata.map((s, i) =>
    getSumUpDuration({
      scene: s,
      previousScene: scenesAndMetadata[i - 1] ?? null,
    }),
  );

  const totalDuration = Math.max(
    1,
    durations.reduce((a, b) => a + b, 0),
  );

  const { height, width } = getDimensionsForLayout(props.canvasLayout);

  return {
    durationInFrames: totalDuration,
    height,
    width,
    fps: FPS,
    props: {
      canvasLayout: props.canvasLayout,
      prefix: compositionId,
      scenes: props.scenes,
      fps: FPS,
      pairs,
      scenesAndMetadata,
      theme: props.theme,
      platform: props.platform,
    },
  };
};
