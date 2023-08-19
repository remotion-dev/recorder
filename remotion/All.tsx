import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import type { z } from "zod";
import type { Pair, SceneMetadata, videoConf } from "./configuration";
import { titleDuration } from "./configuration";
import { Title } from "./Title";
import { Scene } from "./Scene";
import { getAudioSource } from "./layout/music";

export type AllProps = z.infer<typeof videoConf> & {
  metadata: SceneMetadata[];
  pairs: Pair[];
  prefix: string;
};

export const All: React.FC<AllProps> = ({ pairs, metadata, scenes, music }) => {
  let addedUpDurations = 0;
  let videoCounter = -1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "white",
      }}
    >
      {scenes.map((scene, i) => {
        const metadataForScene = metadata[i];
        if (!metadataForScene) {
          return null;
        }

        const yo = addedUpDurations;
        addedUpDurations += metadataForScene.durationInFrames;

        if (scene.type === "title") {
          return (
            <Sequence
              key={scene.title}
              from={yo}
              durationInFrames={titleDuration + 20}
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
            prevWasTitle={i === 0 ? false : scenes[i - 1].type === "title"}
          />
        );
      })}
      {music !== "none" && <Audio src={getAudioSource(music)} volume={0.08} />}
    </AbsoluteFill>
  );
};
