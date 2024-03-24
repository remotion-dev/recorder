import React from "react";
import { Audio, interpolate, Sequence, useVideoConfig } from "remotion";
import type { SceneAndMetadata } from "../../config/scenes";
import {
  AUDIO_FADE_IN_FRAMES,
  BACKGROUND_VOLUME,
  getAudioSource,
  REGULAR_VOLUME,
} from "../../config/sounds";
import { TRANSITION_DURATION } from "../../config/transitions";
import { getShouldTransitionOut } from "../animations/transitions";

type TAudioTrack = {
  from: number;
  src: string;
  duration: number;
  loudParts: [number, number][];
};

const AudioClip: React.FC<{
  src: string;
  loudParts: [number, number][];
}> = ({ src, loudParts }) => {
  const { durationInFrames } = useVideoConfig();

  return (
    <Audio
      volume={(f) => {
        let isLoudPart: null | [number, number] = null;
        for (const loudPart of loudParts) {
          const [from, to] = loudPart;
          if (f >= from && f <= to) {
            isLoudPart = [from, to];
            break;
          }
        }

        const regularVolume = interpolate(
          f,
          [
            0,
            AUDIO_FADE_IN_FRAMES,
            durationInFrames - AUDIO_FADE_IN_FRAMES,
            durationInFrames - 1,
          ],
          [0, BACKGROUND_VOLUME, BACKGROUND_VOLUME, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );

        if (isLoudPart) {
          return interpolate(
            f,
            [
              isLoudPart[0],
              isLoudPart[0] + AUDIO_FADE_IN_FRAMES,
              isLoudPart[1] - AUDIO_FADE_IN_FRAMES,
              isLoudPart[1],
            ],
            [regularVolume, REGULAR_VOLUME, REGULAR_VOLUME, regularVolume],
          );
        }

        return regularVolume;
      }}
      src={src}
    />
  );
};

export const AudioTrack: React.FC<{
  scenesAndMetadata: SceneAndMetadata[];
}> = ({ scenesAndMetadata }) => {
  let addedUpDurations = 0;
  const audioClips: TAudioTrack[] = [];

  scenesAndMetadata.forEach((scene, i) => {
    const metadataForScene = scenesAndMetadata[i];
    if (!metadataForScene) {
      return null;
    }

    const from = addedUpDurations;
    addedUpDurations += metadataForScene.durationInFrames;
    const isTransitioningOut = getShouldTransitionOut({
      sceneAndMetadata: scene,
      nextScene: scenesAndMetadata[i + 1] ?? null,
    });
    if (isTransitioningOut) {
      addedUpDurations -= TRANSITION_DURATION;
    }

    const isLoud = scene.type !== "video-scene";

    const { music } = scene.scene;

    if (music === "previous") {
      if (audioClips.length > 0) {
        (audioClips[audioClips.length - 1] as TAudioTrack).duration +=
          metadataForScene.durationInFrames;
        if (isTransitioningOut) {
          (audioClips[audioClips.length - 1] as TAudioTrack).duration -=
            TRANSITION_DURATION;
        }

        if (isLoud) {
          (audioClips[audioClips.length - 1] as TAudioTrack).loudParts.push([
            from,
            from + metadataForScene.durationInFrames,
          ]);
        }
      }
    } else {
      audioClips.push({
        src: getAudioSource(music),
        duration: metadataForScene.durationInFrames,
        from,
        loudParts: isLoud
          ? [[from, from + metadataForScene.durationInFrames]]
          : [],
      });
    }
  });

  return (
    <>
      {audioClips.map((clip, i) => {
        if (clip.src === "none") {
          return null;
        }

        return (
          <Sequence
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            from={clip.from}
            layout="none"
            durationInFrames={clip.duration}
          >
            <AudioClip
              src={clip.src}
              loudParts={clip.loudParts.map((l) => {
                return [l[0] - clip.from, l[1] - clip.from] as [number, number];
              })}
            />
          </Sequence>
        );
      })}
    </>
  );
};
