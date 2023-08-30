import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import type { z } from "zod";
import {
  getIsTransitioningIn,
  getIsTransitioningOut,
} from "./animations/transitions";
import { AudioTrack } from "./AudioTrack";
import type { Pair, SceneMetadata, videoConf } from "./configuration";
import { transitionDuration } from "./configuration";
import { CameraScene } from "./scenes/CameraScene";
import { EndCard } from "./scenes/EndCard";
import { Title } from "./scenes/Title";
import { TitleCard } from "./scenes/TitleCard";

export type AllProps = z.infer<typeof videoConf> & {
  metadata: SceneMetadata[];
  pairs: Pair[];
  prefix: string;
};

export const All: React.FC<AllProps> = ({
  pairs,
  metadata,
  scenes,
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

        const from = addedUpDurations;
        addedUpDurations += metadataForScene.durationInFrames;
        if (isTransitioningOut) {
          addedUpDurations -= transitionDuration;
        }

        if (scene.type === "title") {
          return (
            <Sequence
              key={scene.title}
              from={from}
              durationInFrames={scene.durationInFrames}
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
              durationInFrames={scene.durationInFrames}
            >
              <TitleCard
                durationInFrames={scene.durationInFrames}
                title={scene.title}
                image={scene.image}
                youTubePlug={scene.youTubePlug}
              />
            </Sequence>
          );
        }

        if (scene.type === "endcard") {
          return (
            <Sequence
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              from={from}
              durationInFrames={scene.durationInFrames}
            >
              <EndCard channel={scene.channel} />
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
            metadata={metadataForScene}
            index={i}
            shouldEnter={isTransitioningIn}
            canvasLayout={layout}
            shouldExit={isTransitioningOut}
            nextScene={
              scenes[i + 1] && metadata[i + 1]
                ? { scene: scenes[i + 1], metadata: metadata[i + 1] }
                : null
            }
            previousScene={
              scenes[i - 1]
                ? { scene: scenes[i - 1], metadata: metadata[i - 1] }
                : null
            }
            scene={scene}
          />
        );
      })}
      <AudioTrack metadata={metadata} scenes={scenes} />
    </AbsoluteFill>
  );
};
