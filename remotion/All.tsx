import React from "react";
import {
  AbsoluteFill,
  getStaticFiles,
  OffthreadVideo,
  Sequence,
  Series,
  spring,
  StaticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { Pair, SceneMetadata, titleDuration, videoConf } from "./configuration";
import { Title } from "./Title";
import { Scene } from "./Scene";

export type AllProps = z.infer<typeof videoConf> & {
  metadata: SceneMetadata[];
  pairs: Pair[];
  title: string;
  subtitle: string;
  prefix: string;
};

export const All: React.FC<AllProps> = ({
  pairs,
  metadata,
  scenes,
  title,
  subtitle,
}) => {
  let addedUpDurations = 0;
  let videoCounter = -1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "white",
      }}
    >
      {scenes.map((scene, i) => {
        const yo = addedUpDurations;
        addedUpDurations += metadata[i].durationInFrames;

        if (scene.isTitle) {
          return (
            <Sequence from={yo} durationInFrames={titleDuration + 20}>
              <Title
                subtitle={scene.isTitle.subtitle}
                title={scene.isTitle.title}
              ></Title>
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
            metadata={metadata[i]}
            index={videoCounter}
            prevWasTitle={i === 0 ? false : scenes[i - 1].isTitle !== null}
          ></Scene>
        );
      })}
    </AbsoluteFill>
  );
};
