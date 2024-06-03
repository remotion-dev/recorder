import { StaticFile } from "@remotion/studio";
import { Word } from "../../config/autocorrect";
import { FPS } from "../../config/fps";
import { SelectableVideoScene } from "../../config/scenes";
import { postprocessCaptions } from "../captions/processing/postprocess-subs";
import { fetchWhisperCppOutput } from "./fetch-captions";

const START_FRAME_PADDING = Math.ceil(FPS / 4);
const END_FRAME_PADDING = FPS / 2;

const deriveEndFrameFromSubs = (words: Word[] | null) => {
  if (!words) {
    return null;
  }

  const lastWord = words[words.length - 1];
  if (!lastWord || !lastWord.lastTimestamp) {
    return null;
  }

  const lastFrame = Math.floor((lastWord.lastTimestamp / 1000) * FPS);
  return lastFrame;
};

const deriveStartFrameFromSubsJSON = (words: Word[] | null): number => {
  if (!words) {
    return 0;
  }

  // taking the first real word and take its start timestamp in ms.
  const startFromInHundrethsOfSec = words[0]?.firstTimestamp;
  if (startFromInHundrethsOfSec === undefined) {
    return 0;
  }

  const startFromInFrames =
    Math.floor((startFromInHundrethsOfSec / 1000) * FPS) - START_FRAME_PADDING;
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
  endFrameFromCaptions,
  endOffset,
}: {
  endOffset: number;
  durationInSeconds: number;
  endFrameFromCaptions: number | null;
}): number => {
  const videoDurationInFrames = Math.floor(durationInSeconds * FPS);
  if (!endFrameFromCaptions) {
    return Math.min(videoDurationInFrames, videoDurationInFrames + endOffset);
  }

  const paddedEndFrame = endFrameFromCaptions + END_FRAME_PADDING + endOffset;
  if (paddedEndFrame > videoDurationInFrames) {
    return videoDurationInFrames;
  }

  return paddedEndFrame;
};

export const getStartEndFrame = async ({
  scene,
  recordingDurationInSeconds,
  captions,
}: {
  scene: SelectableVideoScene;
  recordingDurationInSeconds: number;
  captions: StaticFile | null;
}) => {
  const subsJson = await fetchWhisperCppOutput(captions);

  // We calculate the subtitles only for
  // the purpose of calculating the durastion
  // and will not use this value further
  const subsForTimestamps = subsJson
    ? postprocessCaptions({
        subTypes: subsJson,
      })
    : null;

  const endFrameFromCaptions = deriveEndFrameFromSubs(subsForTimestamps);
  const derivedEndFrame = getClampedEndFrame({
    durationInSeconds: recordingDurationInSeconds,
    endFrameFromCaptions,
    endOffset: scene.endOffset,
  });

  const startFrameFromSubs = deriveStartFrameFromSubsJSON(subsForTimestamps);
  const actualStartFrame = getClampedStartFrame({
    startOffset: scene.startOffset,
    startFrameFromSubs,
    derivedEndFrame,
  });

  return { actualStartFrame, derivedEndFrame };
};
