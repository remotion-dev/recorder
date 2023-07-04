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
import { Pair, SceneMetadata, videoConf } from "./configuration";
import { Intro } from "./Intro";
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

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "white",
      }}
    >
      <Sequence durationInFrames={60}>
        <Intro subtitle={subtitle} title={title}></Intro>
      </Sequence>
      {pairs.map((pair, i) => {
        const yo = addedUpDurations;
        addedUpDurations += metadata[i].durationInFrames;
        return (
          <Scene
            key={i}
            start={yo}
            pair={pair}
            conf={scenes[i]}
            metadata={metadata[i]}
            index={i}
          ></Scene>
        );
      })}
    </AbsoluteFill>
  );
};
