import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import type { z } from "zod";
import type { Pair, SceneMetadata, videoConf } from "./configuration";
import { titleDuration } from "./configuration";
import { Title } from "./Title";
import { Scene } from "./Scene";

export type AllProps = z.infer<typeof videoConf> & {
  metadata: SceneMetadata[];
  pairs: Pair[];
  prefix: string;
};

export const All: React.FC<AllProps> = ({ pairs, metadata, scenes }) => {
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

        if (scene.isTitle) {
          return (
            <Sequence
              key={scene.isTitle.title}
              from={yo}
              durationInFrames={titleDuration + 20}
            >
              <Title
                subtitle={scene.isTitle.subtitle}
                title={scene.isTitle.title}
              />
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
            prevWasTitle={i === 0 ? false : scenes[i - 1].isTitle !== null}
          />
        );
      })}
    </AbsoluteFill>
  );
};
