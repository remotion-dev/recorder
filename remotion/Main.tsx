import React, { useMemo } from "react";
import { AbsoluteFill, Sequence } from "remotion";
import type { Platform } from "../config/endcard";
import type { CanvasLayout } from "../config/layout";
import type { SceneAndMetadata, SelectableScene } from "../config/scenes";
import type { Theme } from "../config/themes";
import { COLORS } from "../config/themes";
import { AudioTrack } from "./audio/AudioTrack";
import { captionEditorPortal } from "./captions/Editor/layout";
import { makeChapters } from "./chapters/make-chapters";
import { Scene } from "./scenes/Scene";
import { NoDataScene } from "./scenes/VideoScene/NoDataScene";

export type MainProps = {
  canvasLayout: CanvasLayout;
  scenes: SelectableScene[];
  scenesAndMetadata: SceneAndMetadata[];
  theme: Theme;
  platform: Platform;
};

export const Main: React.FC<MainProps> = ({
  scenesAndMetadata,
  canvasLayout,
  theme,
  platform,
  scenes,
}) => {
  const chapters = useMemo(() => {
    return makeChapters({ scenes: scenesAndMetadata, canvasLayout });
  }, [canvasLayout, scenesAndMetadata]);

  const displayNoSceneDefinedIndicator = useMemo(() => {
    return scenesAndMetadata.length === 0 && scenes.length === 0;
  }, [scenes.length, scenesAndMetadata.length]);

  const displayNoVideosIndicator = useMemo(() => {
    return (
      scenesAndMetadata.length === 0 && scenes.length > scenesAndMetadata.length
    );
  }, [scenes.length, scenesAndMetadata.length]);

  if (displayNoVideosIndicator) {
    return <NoDataScene theme={theme} />;
  }

  if (displayNoSceneDefinedIndicator) {
    return <NoDataScene theme={theme} />;
  }

  const lastSceneIndex = scenesAndMetadata[
    scenesAndMetadata.length - 1
  ] as SceneAndMetadata;
  const lastSceneFrame =
    lastSceneIndex.from + lastSceneIndex.durationInFrames - 1;

  return (
    <AbsoluteFill
      style={{
        background: COLORS[theme].BACKGROUND,
      }}
    >
      {scenesAndMetadata.map((sceneAndMetadata, i) => {
        return (
          <Scene
            key={i}
            index={i}
            nextScene={scenesAndMetadata[i + 1] ?? null}
            previousScene={scenesAndMetadata[i - 1] ?? null}
            chapters={chapters}
            canvasLayout={canvasLayout}
            sceneAndMetadata={sceneAndMetadata}
            theme={theme}
            platform={platform}
          />
        );
      })}

      {scenes.length > scenesAndMetadata.length && scenesAndMetadata ? (
        <Sequence
          name="No more videos"
          from={lastSceneFrame}
          durationInFrames={120}
        >
          <NoDataScene theme={theme} />
        </Sequence>
      ) : null}
      <AudioTrack
        scenesAndMetadata={scenesAndMetadata}
        canvasLayout={canvasLayout}
      />
      <div ref={captionEditorPortal} />
    </AbsoluteFill>
  );
};
