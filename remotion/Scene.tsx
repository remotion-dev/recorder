import React from "react";
import { Sequence } from "remotion";
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
import { CameraScene } from "./scenes/CameraScene";
import { EndCard } from "./scenes/EndCard";
import { TableOfContents } from "./scenes/TableOfContents";
import { Title } from "./scenes/Title";
import { TitleCard } from "./scenes/TitleCard";
import { UpdateScene } from "./scenes/UpdateScene";

export const Scene: React.FC<{
  sceneAndMetadata: SceneAndMetadata;
  previousScene: SceneAndMetadata | null;
  nextScene: SceneAndMetadata | null;
  index: number;
  canvasLayout: CanvasLayout;
  chapters: ChapterType[];
}> = ({
  index,
  nextScene,
  previousScene,
  sceneAndMetadata,
  canvasLayout,
  chapters,
}) => {
  const isTransitioningIn = getIsTransitioningIn({
    scene: sceneAndMetadata,
    previousScene,
  });
  const isTransitioningOut = getIsTransitioningOut({
    sceneAndMetadata,
    nextScene,
  });

  if (sceneAndMetadata.scene.type === "title") {
    return (
      <Sequence
        key={sceneAndMetadata.scene.title}
        from={sceneAndMetadata.from}
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
        from={sceneAndMetadata.from}
        durationInFrames={sceneAndMetadata.scene.durationInFrames}
      >
        <UpdateScene />
      </Sequence>
    );
  }

  if (sceneAndMetadata.scene.type === "titlecard") {
    return (
      <Sequence
        from={sceneAndMetadata.from}
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
        from={sceneAndMetadata.from}
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

  if (sceneAndMetadata.scene.type === "tableofcontents") {
    return (
      <Sequence
        from={sceneAndMetadata.from}
        durationInFrames={sceneAndMetadata.scene.durationInFrames}
      >
        <TableOfContents
          isTransitioningIn={isTransitioningIn}
          chapters={chapters}
          isTransitioningOut={isTransitioningOut}
        />
      </Sequence>
    );
  }

  const { durationInFrames } = sceneAndMetadata;

  return (
    <Sequence
      name={`Scene ${index}`}
      from={sceneAndMetadata.from}
      durationInFrames={Math.max(1, durationInFrames)}
    >
      <CameraScene
        shouldEnter={isTransitioningIn}
        canvasLayout={canvasLayout}
        shouldExit={isTransitioningOut}
        nextScene={nextScene}
        previousScene={previousScene}
        sceneAndMetadata={sceneAndMetadata as VideoSceneAndMetadata}
      />
    </Sequence>
  );
};
