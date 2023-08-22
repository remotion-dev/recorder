import React from "react";
import { AbsoluteFill, Audio, Sequence } from "remotion";
import type { z } from "zod";
import type {
  Pair,
  SceneMetadata,
  videoConf,
  SceneType,
} from "./configuration";
import { transitionDuration } from "./configuration";
import { Title } from "./scenes/Title";
import { CameraScene } from "./scenes/CameraScene";
import { getAudioSource } from "./layout/music";
import {
  getIsTransitioningIn,
  getIsTransitioningOut,
} from "./animations/transitions";
import { TitleCard } from "./scenes/TitleCard";

export type AllProps = z.infer<typeof videoConf> & {
  metadata: SceneMetadata[];
  pairs: Pair[];
  prefix: string;
};

const isATextCard = (scene: SceneType) => {
  return scene.type === "title" || scene.type === "titlecard";
};

export const shouldEnter = (index: number, scenes: SceneType[]) => {
  if (index === 0) {
    return false;
  }

  return isATextCard(scenes[index - 1]);
};

export const All: React.FC<AllProps> = ({
  pairs,
  metadata,
  scenes,
  music,
  layout,
}) => {
  let addedUpDurations = 0;
  let videoCounter = -1;

  return (
    <AbsoluteFill
      style={{
        backgroundImage: "linear-gradient(to right, white, white)",
      }}
    >
      {scenes.map((scene, i) => {
        const metadataForScene = metadata[i];
        if (!metadataForScene) {
          return null;
        }

        const isTransitioningIn = getIsTransitioningIn(scenes, i);
        const isTransitioningOut = getIsTransitioningOut(scenes, i);

        const from =
          addedUpDurations - (isTransitioningIn ? transitionDuration : 0);
        const extraDuration =
          (isTransitioningIn ? transitionDuration : 0) +
          (isTransitioningOut ? transitionDuration : 0);
        addedUpDurations += metadataForScene.durationInFrames;

        if (scene.type === "title") {
          return (
            <Sequence
              key={scene.title}
              from={from}
              durationInFrames={scene.durationInFrames + extraDuration}
            >
              <Title
                durationInFrames={scene.durationInFrames}
                subtitle={scene.subtitle}
                title={scene.title}
              />
            </Sequence>
          );
        }

        if (scene.type === "titlecard") {
          return (
            <Sequence
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              from={from}
              durationInFrames={scene.durationInFrames + extraDuration}
            >
              <TitleCard
                durationInFrames={scene.durationInFrames}
                title={scene.title}
              />
            </Sequence>
          );
        }

        videoCounter += 1;
        const pair = pairs[videoCounter];
        return (
          <CameraScene
            key={videoCounter}
            start={from}
            pair={pair}
            conf={scenes[i]}
            metadata={metadataForScene}
            index={videoCounter}
            shouldEnter={isTransitioningIn}
            canvasSize={layout}
            shouldExit={isTransitioningOut}
          />
        );
      })}
      {music !== "none" && <Audio src={getAudioSource(music)} volume={0.05} />}
    </AbsoluteFill>
  );
};
