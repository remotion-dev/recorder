import React, { useMemo } from "react";
import { AbsoluteFill, Sequence } from "remotion";
import {
  getIsTransitioningIn,
  getIsTransitioningOut,
} from "./animations/transitions";
import { AudioTrack } from "./AudioTrack";
import { generateChapters } from "./chapters/make-chapters";
import { WideScreenChapters } from "./chapters/WideScreenChapters";
import { COLORS } from "./colors";
import type {
  CanvasLayout,
  SceneAndMetadata,
  SceneType,
  VideoSceneAndMetadata,
} from "./configuration";
import { transitionDuration } from "./configuration";
import { CameraScene } from "./scenes/CameraScene";
import { EndCard } from "./scenes/EndCard";
import { Title } from "./scenes/Title";
import { TitleCard } from "./scenes/TitleCard";
import { UpdateScene } from "./scenes/UpdateScene";

export type AllProps = {
  prefix: string;
  canvasLayout: CanvasLayout;
  scenes: SceneType[];
  scenesAndMetadata: SceneAndMetadata[];
};

export const All: React.FC<AllProps> = ({
  scenesAndMetadata,
  canvasLayout,
}) => {
  let addedUpDurations = 0;
  let videoCounter = -1;

  const chapters = useMemo(() => {
    return generateChapters({ scenes: scenesAndMetadata });
  }, [scenesAndMetadata]);

  return (
    <AbsoluteFill
      style={{
        background: COLORS.BACKGROUND,
      }}
    >
      {scenesAndMetadata.map((sceneAndMetadata, i) => {
        const isTransitioningIn = getIsTransitioningIn({
          scene: sceneAndMetadata,
          previousScene: scenesAndMetadata[i - 1] ?? null,
        });
        const isTransitioningOut = getIsTransitioningOut({
          sceneAndMetadata,
          nextScene: scenesAndMetadata[i + 1] ?? null,
        });

        const from = addedUpDurations;
        addedUpDurations += sceneAndMetadata.durationInFrames;
        if (isTransitioningOut) {
          addedUpDurations -= transitionDuration;
        }

        if (sceneAndMetadata.scene.type === "title") {
          return (
            <Sequence
              key={sceneAndMetadata.scene.title}
              from={from}
              durationInFrames={sceneAndMetadata.scene.durationInFrames}
            >
              <Title
                durationInFrames={sceneAndMetadata.scene.durationInFrames}
                subtitle={sceneAndMetadata.scene.subtitle}
                title={sceneAndMetadata.scene.title}
              />
            </Sequence>
          );
        }

        if (sceneAndMetadata.scene.type === "remotionupdate") {
          return (
            <Sequence
              key={"update"}
              from={from}
              durationInFrames={sceneAndMetadata.scene.durationInFrames}
            >
              <UpdateScene />
            </Sequence>
          );
        }

        if (sceneAndMetadata.scene.type === "titlecard") {
          return (
            <Sequence
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              from={from}
              durationInFrames={sceneAndMetadata.scene.durationInFrames}
            >
              <TitleCard
                durationInFrames={sceneAndMetadata.scene.durationInFrames}
                title={sceneAndMetadata.scene.title}
                image={sceneAndMetadata.scene.image}
                youTubePlug={sceneAndMetadata.scene.youTubePlug}
              />
            </Sequence>
          );
        }

        if (sceneAndMetadata.scene.type === "endcard") {
          return (
            <Sequence
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              from={from}
              durationInFrames={sceneAndMetadata.scene.durationInFrames}
            >
              <EndCard
                platform={sceneAndMetadata.scene.platform}
                canvasLayout={canvasLayout}
                channel={sceneAndMetadata.scene.channel}
                isTransitioningIn={isTransitioningIn}
                links={sceneAndMetadata.scene.links}
              />
            </Sequence>
          );
        }

        videoCounter += 1;
        const { durationInFrames } = sceneAndMetadata;

        return (
          <Sequence
            key={videoCounter}
            name={`Scene ${i}`}
            from={from}
            durationInFrames={Math.max(1, durationInFrames)}
          >
            <CameraScene
              shouldEnter={isTransitioningIn}
              canvasLayout={canvasLayout}
              shouldExit={isTransitioningOut}
              nextScene={scenesAndMetadata[i + 1] ?? null}
              previousScene={scenesAndMetadata[i - 1] ?? null}
              sceneAndMetadata={sceneAndMetadata as VideoSceneAndMetadata}
            />
          </Sequence>
        );
      })}
      {canvasLayout === "wide" ? (
        <WideScreenChapters chapters={chapters} />
      ) : null}
      <AudioTrack scenesAndMetadata={scenesAndMetadata} />
    </AbsoluteFill>
  );
};
