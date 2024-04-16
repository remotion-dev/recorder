import React, { useMemo } from "react";
import { AbsoluteFill, Sequence } from "remotion";
import type { CanvasLayout } from "../config/layout";
import type { SceneAndMetadata, SceneType } from "../config/scenes";
import type { Theme } from "../config/themes";
import { COLORS } from "../config/themes";
import { AudioTrack } from "./audio/AudioTrack";
import { captionEditorPortal } from "./captions/Editor/layout";
import { makeChapters } from "./chapters/make-chapters";
import { NoDataScene } from "./scenes/Camera/NoDataScene";
import { Scene } from "./scenes/Scene";

export type MainProps = {
  canvasLayout: CanvasLayout;
  scenes: SceneType[];
  scenesAndMetadata: SceneAndMetadata[];
  theme: Theme;
};

export const Main: React.FC<MainProps> = ({
  scenesAndMetadata,
  canvasLayout,
  theme,
  scenes,
}) => {
  const chapters = useMemo(() => {
    return makeChapters({ scenes: scenesAndMetadata });
  }, [scenesAndMetadata]);

  const displayNoSceneDefinedIndicator = useMemo(() => {
    return scenesAndMetadata.length === 0 && scenes.length === 0;
  }, [scenes.length, scenesAndMetadata.length]);

  const displayNoVideosIndicator = useMemo(() => {
    return (
      scenesAndMetadata.length === 0 && scenes.length > scenesAndMetadata.length
    );
  }, [scenes.length, scenesAndMetadata.length]);

  if (displayNoVideosIndicator) {
    return (
      <AbsoluteFill
        style={{
          background: COLORS[theme].BACKGROUND,
        }}
      >
        <NoDataScene theme={theme} type="no-videos" />
      </AbsoluteFill>
    );
  }

  if (displayNoSceneDefinedIndicator) {
    return <NoDataScene type="no-scene" theme={theme} />;
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
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            index={i}
            nextScene={scenesAndMetadata[i + 1] ?? null}
            previousScene={scenesAndMetadata[i - 1] ?? null}
            chapters={chapters}
            canvasLayout={canvasLayout}
            sceneAndMetadata={sceneAndMetadata}
            theme={theme}
          />
        );
      })}

      {scenes.length > scenesAndMetadata.length && scenesAndMetadata ? (
        <Sequence
          name="No more videos"
          from={lastSceneFrame}
          durationInFrames={120}
        >
          <NoDataScene theme={theme} type="no-more-videos" />
        </Sequence>
      ) : null}
      <AudioTrack scenesAndMetadata={scenesAndMetadata} />
      <div ref={captionEditorPortal} />
    </AbsoluteFill>
  );
};
