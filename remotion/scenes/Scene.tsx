import { interpolateStyles } from "@remotion/animation-utils";
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Platform } from "../../config/endcard";
import type { CanvasLayout } from "../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../config/scenes";
import type { Theme } from "../../config/themes";
import { SCENE_TRANSITION_DURATION } from "../../config/transitions";
import { getSceneEnter, getSceneExit } from "../animations/scene-transitions";
import {
  getShouldTransitionIn,
  getShouldTransitionOut,
} from "../animations/transitions";
import type { ChapterType } from "../chapters/make-chapters";
import { CameraScene } from "./Camera/CameraScene";
import { SoundEffects } from "./Camera/SoundEffects";
import { EndCard } from "./EndCard";
import { NoRecordingsScene } from "./Placeholders/NoRecordingsScene";
import { RecorderScene } from "./Recorder";
import { TableOfContents } from "./TableOfContents";
import { Title } from "./Title/Title";

type Props = {
  sceneAndMetadata: SceneAndMetadata;
  previousScene: SceneAndMetadata | null;
  nextScene: SceneAndMetadata | null;
  index: number;
  canvasLayout: CanvasLayout;
  chapters: ChapterType[];
  theme: Theme;
  platform: Platform;
};

const InnerScene: React.FC<
  Props & {
    enterProgress: number;
    exitProgress: number;
  }
> = ({
  canvasLayout,
  chapters,
  nextScene,
  previousScene,
  sceneAndMetadata,
  theme,
  enterProgress,
  exitProgress,
  platform,
}) => {
  if (sceneAndMetadata.scene.type === "title") {
    return (
      <Title
        subtitle={sceneAndMetadata.scene.subtitle}
        title={sceneAndMetadata.scene.title}
        theme={theme}
      />
    );
  }

  if (sceneAndMetadata.scene.type === "recorder") {
    return <RecorderScene theme={theme} />;
  }

  if (sceneAndMetadata.scene.type === "endcard") {
    return (
      <EndCard
        theme={theme}
        platform={platform}
        canvasLayout={canvasLayout}
        channel={sceneAndMetadata.scene.channel}
        links={sceneAndMetadata.scene.links}
      />
    );
  }

  if (sceneAndMetadata.scene.type === "tableofcontents") {
    return <TableOfContents theme={theme} chapters={chapters} />;
  }

  if (sceneAndMetadata.scene.type === "norecordings") {
    // TODO: Implement no more recordings
    return <NoRecordingsScene type="none" />;
  }

  if (sceneAndMetadata.scene.type === "nomorerecordings") {
    return <NoRecordingsScene type="no-more" />;
  }

  // TODO: Implement no scenes

  if (sceneAndMetadata.scene.type === "videoscene") {
    return (
      <CameraScene
        enterProgress={enterProgress}
        canvasLayout={canvasLayout}
        exitProgress={exitProgress}
        nextScene={nextScene}
        previousScene={previousScene}
        sceneAndMetadata={sceneAndMetadata as VideoSceneAndMetadata}
        theme={theme}
        chapters={chapters}
        willTransitionToNextScene={getShouldTransitionOut({
          nextScene,
          sceneAndMetadata,
          canvasLayout,
        })}
      />
    );
  }

  throw new Error(
    "Scene type not implemented in Scene.tsx: " +
      // @ts-expect-error If this gives a TS error, then you need to implement a new scene type
      sceneAndMetadata.scene.type,
  );
};

const SceneWithTransition: React.FC<Props> = (props) => {
  const { fps, durationInFrames, width } = useVideoConfig();
  const frame = useCurrentFrame();
  const shouldEnter = getShouldTransitionIn({
    scene: props.sceneAndMetadata,
    previousScene: props.previousScene,
    canvasLayout: props.canvasLayout,
  });

  const shouldExit = getShouldTransitionOut({
    sceneAndMetadata: props.sceneAndMetadata,
    nextScene: props.nextScene,
    canvasLayout: props.canvasLayout,
  });
  const enter = shouldEnter
    ? spring({
        fps,
        frame,
        config: {
          damping: 200,
        },
        durationInFrames: SCENE_TRANSITION_DURATION,
      })
    : 1;

  const exit = shouldExit
    ? spring({
        fps,
        frame,
        config: {
          damping: 200,
        },
        durationInFrames: SCENE_TRANSITION_DURATION,
        delay: durationInFrames - SCENE_TRANSITION_DURATION,
      })
    : 0;

  const startStyle = getSceneEnter({
    currentScene: props.sceneAndMetadata,
    previousScene: props.previousScene,
    canvasWidth: width,
  });
  const endStyle = getSceneExit({
    currentScene: props.sceneAndMetadata,
    nextScene: props.nextScene,
    canvasWidth: width,
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
      <InnerScene {...props} enterProgress={enter} exitProgress={exit} />
      <SoundEffects
        previousScene={props.previousScene}
        sceneAndMetadata={props.sceneAndMetadata}
        shouldEnter={shouldEnter}
      />
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
  platform,
}) => {
  const chapter =
    sceneAndMetadata.scene.type === "videoscene"
      ? sceneAndMetadata.scene.newChapter
      : undefined;

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
        platform={platform}
      />
    </Sequence>
  );
};
