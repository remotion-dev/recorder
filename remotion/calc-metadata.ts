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
  type SceneVideos,
  type SelectableScene,
  type WebcamPosition,
} from "../config/scenes";
import { SCENE_TRANSITION_DURATION } from "../config/transitions";
import {
  getShouldTransitionIn,
  getShouldTransitionOut,
  getSumUpDuration,
} from "./animations/transitions";
import { postprocessSubtitles } from "./captions/processing/postprocess-subs";
import type { SubTypes, WhisperOutput } from "./captions/types";
import { truthy } from "./helpers/truthy";
import { getDimensionsForLayout } from "./layout/dimensions";
import { getLayout } from "./layout/get-layout";
import type { MainProps } from "./Main";
import { applyBRollRules } from "./scenes/BRoll/apply-b-roll-rules";
import { getBRollDimensions } from "./scenes/BRoll/get-broll-dimensions";

const TIMESTAMP_PADDING_IN_FRAMES = Math.floor(FPS / 2);
const END_FRAME_PADDING = 30;

const deriveStartFrameFromSubsJSON = (
  subsJSON: WhisperOutput | null,
): number => {
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

const getClampedStartFrame = ({
  startOffset,
  startFrameFromSubs,
  derivedEndFrame,
}: {
  startOffset: number;
  startFrameFromSubs: number;
  derivedEndFrame: number;
}): number => {
  const combinedStartFrame = startFrameFromSubs + startOffset;

  if (combinedStartFrame > derivedEndFrame) {
    return derivedEndFrame;
  }

  if (combinedStartFrame < 0) {
    return 0;
  }

  return combinedStartFrame;
};

const getClampedEndFrame = ({
  durationInSeconds,
  derivedEndFrame,
}: {
  durationInSeconds: number;
  derivedEndFrame: number | null;
}): number => {
  const videoDurationInFrames = Math.floor(durationInSeconds * FPS);
  if (!derivedEndFrame) {
    return videoDurationInFrames;
  }

  const paddedEndFrame = derivedEndFrame + END_FRAME_PADDING;
  if (paddedEndFrame > videoDurationInFrames) {
    return videoDurationInFrames;
  }

  return paddedEndFrame;
};

const deriveEndFrameFromSubs = (subs: SubTypes) => {
  const lastSegment = subs.segments[subs.segments.length - 1];
  const lastWord = lastSegment?.words[lastSegment.words.length - 1];
  if (!lastWord || !lastWord.firstTimestamp) {
    throw new Error("Last word or its timestampe is undefined");
  }

  const lastFrame = Math.floor((lastWord.firstTimestamp / 1000) * FPS);
  return lastFrame + 2 * TIMESTAMP_PADDING_IN_FRAMES;
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
              type: videoIndex > 0 ? "nomorerecordings" : "norecordings",
            },
            durationInFrames: PLACE_HOLDER_DURATION_IN_FRAMES,
            from: 0,
          };
        }

        const {
          durationInSeconds,
          height: webcamHeight,
          width: webcamWidth,
        } = await getVideoMetadata(p.webcam.src);

        const dim = p.display ? await getVideoMetadata(p.display.src) : null;

        const subsJson = await fetchSubsJson(p.subs);

        let endFrameFromSubs = null;
        if (subsJson) {
          // only interested in postprocessing of the words to get rid of "BLANK_WORDS"
          const subsForTimestamps = postprocessSubtitles({
            subTypes: subsJson,
            boxWidth: 200,
            canvasLayout: "landscape",
            fontSize: 10,
            maxLines: 3,
            subtitleType: "square",
          });

          endFrameFromSubs = deriveEndFrameFromSubs(subsForTimestamps);
        }

        const derivedEndFrame = getClampedEndFrame({
          durationInSeconds,
          derivedEndFrame: endFrameFromSubs,
        });

        const startFrameFromSubs = deriveStartFrameFromSubsJSON(subsJson);

        const actualStartFrame = getClampedStartFrame({
          startOffset: scene.startOffset,
          startFrameFromSubs,
          derivedEndFrame,
        });

        const durationInFrames =
          durationInSeconds === Infinity
            ? PLACE_HOLDER_DURATION_IN_FRAMES
            : derivedEndFrame - actualStartFrame;
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
          const prevScene = props.scenes[idx] as SelectableScene;
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
          // Intentionally using ||
          // By default, Zod will give it a value of 0, which shifts the timeline
          durationInFrames: scene.duration || Math.round(durationInFrames),
          layout: getLayout({
            webcamPosition: webcamPosition as WebcamPosition,
            videos,
            canvasLayout: props.canvasLayout,
          }),
          pair: p,
          finalWebcamPosition: webcamPosition as WebcamPosition,
          from: 0,
          chapter: scene.newChapter ?? null,
          startFrame: actualStartFrame,
          endFrame: derivedEndFrame,
          bRolls: bRollWithDimensions,
        };
      }),
    )
  ).filter(truthy);

  let addedUpDurations = 0;
  let currentChapter: string | null = null;

  await waitForFonts();

  const scenesAndMetadata: SceneAndMetadata[] =
    props.scenes.length === 0
      ? [
          {
            type: "other-scene" as const,
            scene: {
              // TODO: Add correct placeholder
              type: "noscenes" as const,
              music: "none",
              transitionToNextScene: true,
            },
            durationInFrames: 90,
            from: 0,
          },
        ]
      : scenesAndMetadataWithoutDuration.map((sceneAndMetadata, i) => {
          const previousSceneAndMetaData =
            scenesAndMetadataWithoutDuration[i - 1] ?? null;
          const nextSceneAndMetaData =
            scenesAndMetadataWithoutDuration[i + 1] ?? null;

          const isTransitioningIn = previousSceneAndMetaData
            ? getShouldTransitionIn({
                previousScene: previousSceneAndMetaData,
                scene: sceneAndMetadata,
                canvasLayout: props.canvasLayout,
              })
            : false;
          const isTransitioningOut = getShouldTransitionOut({
            sceneAndMetadata,
            nextScene: nextSceneAndMetaData,
            canvasLayout: props.canvasLayout,
          });

          if (isTransitioningIn) {
            addedUpDurations -= SCENE_TRANSITION_DURATION;
          }

          const from = addedUpDurations;
          addedUpDurations += sceneAndMetadata.durationInFrames;

          if (sceneAndMetadata.type === "other-scene") {
            return {
              ...sceneAndMetadata,
              from,
            };
          }

          let adjustedDuration = sceneAndMetadata.durationInFrames;

          let transitionAdjustedStartFrame = sceneAndMetadata.startFrame;

          if (isTransitioningIn) {
            transitionAdjustedStartFrame = Math.max(
              0,
              sceneAndMetadata.startFrame - SCENE_TRANSITION_DURATION,
            );

            const additionalTransitionFrames =
              sceneAndMetadata.startFrame - transitionAdjustedStartFrame;

            addedUpDurations += additionalTransitionFrames;
            adjustedDuration += additionalTransitionFrames;
          }

          if (sceneAndMetadata.scene.newChapter) {
            currentChapter = sceneAndMetadata.scene.newChapter;
          }

          const retValue: SceneAndMetadata = {
            ...sceneAndMetadata,
            bRolls: applyBRollRules({
              bRolls: sceneAndMetadata.bRolls,
              sceneDurationInFrames: adjustedDuration,
              willTransitionToNextScene: isTransitioningOut,
            }),
            startFrame: transitionAdjustedStartFrame,
            durationInFrames: adjustedDuration,
            from,
            chapter: currentChapter,
          };
          if (sceneAndMetadata.scene.stopChapteringAfterThis) {
            currentChapter = null;
          }

          return retValue;
        });

  const durations = scenesAndMetadata.map((s, i) =>
    getSumUpDuration({
      scene: s,
      previousScene: scenesAndMetadata[i - 1] ?? null,
      canvasLayout: props.canvasLayout,
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
