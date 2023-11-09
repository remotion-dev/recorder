import React from "react";
import { Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  getIsTransitioningIn,
  getIsTransitioningOut,
} from "./animations/transitions";
import type { ChapterType } from "./chapters/make-chapters";
import type {
  CanvasLayout,
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "./configuration";
import { transitionDuration } from "./configuration";
import { CameraScene } from "./scenes/CameraScene";
import { EndCard } from "./scenes/EndCard";
import { TableOfContents } from "./scenes/TableOfContents";
import { Title } from "./scenes/Title";
import { TitleCard } from "./scenes/TitleCard";
import { UpdateScene } from "./scenes/UpdateScene";

type Props = {
  sceneAndMetadata: SceneAndMetadata;
  previousScene: SceneAndMetadata | null;
  nextScene: SceneAndMetadata | null;
  index: number;
  canvasLayout: CanvasLayout;
  chapters: ChapterType[];
};

const InnerScene: React.FC<Props> = ({
  canvasLayout,
  chapters,
  nextScene,
  previousScene,
  sceneAndMetadata,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const isTransitioningIn = getIsTransitioningIn({
    scene: sceneAndMetadata,
    previousScene,
  });
  const isTransitioningOut = getIsTransitioningOut({
    sceneAndMetadata,
    nextScene,
  });

  const enter = isTransitioningIn
    ? spring({
        fps,
        frame,
        config: {
          damping: 200,
        },
        durationInFrames: transitionDuration,
      })
    : 1;

  const exit = isTransitioningOut
    ? spring({
        fps,
        frame,
        durationInFrames: transitionDuration,
        config: {
          damping: 200,
        },
        delay: sceneAndMetadata.durationInFrames - transitionDuration,
      })
    : 0;

  if (sceneAndMetadata.scene.type === "title") {
    return (
      <Title
        durationInFrames={sceneAndMetadata.scene.durationInFrames}
        subtitle={sceneAndMetadata.scene.subtitle}
        title={sceneAndMetadata.scene.title}
      />
    );
  }

  if (sceneAndMetadata.scene.type === "remotionupdate") {
    return <UpdateScene enter={enter} exit={exit} />;
  }

  if (sceneAndMetadata.scene.type === "titlecard") {
    return (
      <TitleCard
        title={sceneAndMetadata.scene.title}
        image={sceneAndMetadata.scene.image}
        youTubePlug={sceneAndMetadata.scene.youTubePlug}
        enter={enter}
        exit={exit}
      />
    );
  }

  if (sceneAndMetadata.scene.type === "endcard") {
    return (
      <EndCard
        platform={sceneAndMetadata.scene.platform}
        canvasLayout={canvasLayout}
        channel={sceneAndMetadata.scene.channel}
        isTransitioningIn={isTransitioningIn}
        links={sceneAndMetadata.scene.links}
        enter={enter}
        exit={exit}
      />
    );
  }

  if (sceneAndMetadata.scene.type === "tableofcontents") {
    return <TableOfContents chapters={chapters} enter={enter} exit={exit} />;
  }

  return (
    <CameraScene
      shouldEnter={isTransitioningIn}
      canvasLayout={canvasLayout}
      shouldExit={isTransitioningOut}
      nextScene={nextScene}
      previousScene={previousScene}
      sceneAndMetadata={sceneAndMetadata as VideoSceneAndMetadata}
    />
  );
};

export const Scene: React.FC<Props> = ({
  index,
  nextScene,
  previousScene,
  sceneAndMetadata,
  canvasLayout,
  chapters,
}) => {
  return (
    <Sequence
      name={`Scene ${index}`}
      from={sceneAndMetadata.from}
      durationInFrames={Math.max(1, sceneAndMetadata.durationInFrames)}
    >
      <InnerScene
        canvasLayout={canvasLayout}
        chapters={chapters}
        nextScene={nextScene}
        index={index}
        previousScene={previousScene}
        sceneAndMetadata={sceneAndMetadata}
      />
    </Sequence>
  );
};
