import { interpolateStyles } from "@remotion/animation-utils";
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type {
  CanvasLayout,
  SceneAndMetadata,
  Theme,
  VideoSceneAndMetadata,
} from "../config/scenes";
import { TRANSITION_DURATION } from "../config/transitions";
import { getSceneEnter, getSceneExit } from "./animations/scene-transitions";
import {
  getShouldTransitionIn,
  getShouldTransitionOut,
} from "./animations/transitions";
import type { ChapterType } from "./chapters/make-chapters";
import { CameraScene } from "./scenes/Camera/CameraScene";
import { EndCard } from "./scenes/EndCard";
import { TableOfContents } from "./scenes/TableOfContents";
import { Title } from "./scenes/Title/Title";
import { TitleCard } from "./scenes/TitleCard/TitleCard";
import { UpdateScene } from "./scenes/Update/UpdateScene";

type Props = {
  sceneAndMetadata: SceneAndMetadata;
  previousScene: SceneAndMetadata | null;
  nextScene: SceneAndMetadata | null;
  index: number;
  canvasLayout: CanvasLayout;
  chapters: ChapterType[];
  theme: Theme;
};

const InnerScene: React.FC<Props> = ({
  canvasLayout,
  chapters,
  nextScene,
  previousScene,
  sceneAndMetadata,
  theme,
}) => {
  if (sceneAndMetadata.scene.type === "title") {
    return (
      <Title
        subtitle={sceneAndMetadata.scene.subtitle}
        title={sceneAndMetadata.scene.title}
      />
    );
  }

  if (sceneAndMetadata.scene.type === "remotionupdate") {
    return <UpdateScene />;
  }

  if (sceneAndMetadata.scene.type === "titlecard") {
    return (
      <TitleCard
        title={sceneAndMetadata.scene.title}
        image={sceneAndMetadata.scene.image}
        youTubePlug={sceneAndMetadata.scene.youTubePlug}
      />
    );
  }

  if (sceneAndMetadata.scene.type === "endcard") {
    return (
      <EndCard
        theme={theme}
        platform={sceneAndMetadata.scene.platform}
        canvasLayout={canvasLayout}
        channel={sceneAndMetadata.scene.channel}
        links={sceneAndMetadata.scene.links}
      />
    );
  }

  if (sceneAndMetadata.scene.type === "tableofcontents") {
    return <TableOfContents theme={theme} chapters={chapters} />;
  }

  return (
    <CameraScene
      shouldEnter={getShouldTransitionIn({
        scene: sceneAndMetadata,
        previousScene,
      })}
      canvasLayout={canvasLayout}
      shouldExit={getShouldTransitionOut({
        sceneAndMetadata,
        nextScene,
      })}
      nextScene={nextScene}
      previousScene={previousScene}
      sceneAndMetadata={sceneAndMetadata as VideoSceneAndMetadata}
      theme={theme}
      chapters={chapters}
    />
  );
};

const SceneWithTransition: React.FC<Props> = (props) => {
  const { fps, durationInFrames, width } = useVideoConfig();
  const frame = useCurrentFrame();
  const shouldEnter = getShouldTransitionIn({
    scene: props.sceneAndMetadata,
    previousScene: props.previousScene,
  });
  const shouldExit = getShouldTransitionOut({
    sceneAndMetadata: props.sceneAndMetadata,
    nextScene: props.nextScene,
  });

  const enter = shouldEnter
    ? spring({
        fps,
        frame,
        config: {
          damping: 200,
        },
        durationInFrames: TRANSITION_DURATION,
      })
    : 1;

  const exit = shouldExit
    ? spring({
        fps,
        frame,
        config: {
          damping: 200,
        },
        durationInFrames: TRANSITION_DURATION,
        delay: durationInFrames - TRANSITION_DURATION,
      })
    : 0;

  const startStyle = getSceneEnter({
    currentScene: props.sceneAndMetadata,
    previousScene: props.previousScene,
    width,
  });
  const endStyle = getSceneExit({
    currentScene: props.sceneAndMetadata,
    nextScene: props.nextScene,
    width,
  });

  const style = interpolateStyles(
    enter + exit,
    [0, 1, 2],
    [
      startStyle,
      {
        left: 0,
      },
      endStyle,
    ],
  );

  return (
    <AbsoluteFill style={style}>
      <InnerScene {...props} />
    </AbsoluteFill>
  );
};

export const Scene: React.FC<Props> = ({
  index,
  nextScene,
  previousScene,
  sceneAndMetadata,
  canvasLayout,
  chapters,
  theme,
}) => {
  const chapter =
    sceneAndMetadata.scene.type === "videoscene"
      ? sceneAndMetadata.scene.newChapter
      : "";

  return (
    <Sequence
      name={`Scene ${index} ${chapter ? `(${chapter})` : ""}`}
      from={sceneAndMetadata.from}
      durationInFrames={Math.max(1, sceneAndMetadata.durationInFrames)}
    >
      <SceneWithTransition
        canvasLayout={canvasLayout}
        chapters={chapters}
        nextScene={nextScene}
        index={index}
        previousScene={previousScene}
        sceneAndMetadata={sceneAndMetadata}
        theme={theme}
      />
    </Sequence>
  );
};
