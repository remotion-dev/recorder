import React from "react";
import { AbsoluteFill, Audio, Sequence } from "remotion";
import type { z } from "zod";
import type {
  Pair,
  SceneMetadata,
  videoConf,
  SceneType,
} from "./configuration";
import { titleHideDuration } from "./configuration";
import { titleDuration } from "./configuration";
import { Title } from "./Title";
import { Scene } from "./Scene";
import { getAudioSource } from "./layout/music";

export type AllProps = z.infer<typeof videoConf> & {
  metadata: SceneMetadata[];
  pairs: Pair[];
  prefix: string;
};

export const shouldEnter = (index: number, scenes: SceneType[]) => {
  if (index === 0) {
    return false;
  }

  return scenes[index - 1].type === "title";
};

export const shouldExit = (index: number, scenes: SceneType[]) => {
  if (index === scenes.length - 1) {
    return false;
  }

  return scenes[index + 1].type === "title";
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

        const yo = addedUpDurations;
        addedUpDurations += metadataForScene.durationInFrames;

        const isFirstScene = i === 0;

        if (scene.type === "title") {
          return (
            <Sequence
              key={scene.title}
              from={yo - (isFirstScene ? 0 : titleHideDuration)}
              durationInFrames={
                titleDuration +
                titleHideDuration +
                (isFirstScene ? 0 : titleHideDuration)
              }
            >
              <Title subtitle={scene.subtitle} title={scene.title} />
            </Sequence>
          );
        }

        videoCounter += 1;
        const pair = pairs[videoCounter];
        return (
          <Scene
            key={videoCounter}
            start={yo}
            pair={pair}
            conf={scenes[i]}
            metadata={metadataForScene}
            index={videoCounter}
            shouldEnter={shouldEnter(i, scenes)}
            canvasSize={layout}
            shouldExit={shouldExit(i, scenes)}
          />
        );
      })}
      {music !== "none" && <Audio src={getAudioSource(music)} volume={0.08} />}
    </AbsoluteFill>
  );
};
