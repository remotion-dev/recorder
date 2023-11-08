import React from "react";
import { Audio, interpolate, Sequence, useVideoConfig } from "remotion";
import { getIsTransitioningOut, isATextCard } from "./animations/transitions";
import type { SceneAndMetadata } from "./configuration";
import { transitionDuration } from "./configuration";
import { getAudioSource } from "./layout/music";

type TAudioTrack = {
  from: number;
  src: string;
  duration: number;
  loudParts: [number, number][];
};

const FADE = 30;

const AudioClip: React.FC<{
  src: string;
  loudParts: [number, number][];
}> = ({ src, loudParts }) => {
  const { durationInFrames } = useVideoConfig();

  return (
    <Audio
      volume={(f) => {
        let isLoudPart: null | [number, number] = null;
        for (let i = 0; i < loudParts.length; i++) {
          // @ts-expect-error
          const [from, to] = loudParts[i];
          if (f >= from && f <= to) {
            isLoudPart = [from, to];
            break;
          }
        }

        const regularVolume = interpolate(
          f,
          [0, FADE, durationInFrames - FADE, durationInFrames - 1],
          [0, 0.04, 0.04, 0],
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
              isLoudPart[0] + FADE,
              isLoudPart[1] - FADE,
              isLoudPart[1],
            ],
            [regularVolume, 1, 1, regularVolume],
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
    const isTransitioningOut = getIsTransitioningOut({
      sceneAndMetadata: scene,
      nextScene: scenesAndMetadata[i + 1] ?? null,
    });
    if (isTransitioningOut) {
      addedUpDurations -= transitionDuration;
    }

    const isLoud = isATextCard(scene.scene);

    const { music } = scene.scene;

    if (music === "previous") {
      if (audioClips.length > 0) {
        (audioClips[audioClips.length - 1] as TAudioTrack).duration +=
          metadataForScene.durationInFrames;
        if (isTransitioningOut) {
          (audioClips[audioClips.length - 1] as TAudioTrack).duration -=
            transitionDuration;
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
                return [l[0] - clip.from, l[1] - clip.from];
              })}
            />
          </Sequence>
        );
      })}
    </>
  );
};
