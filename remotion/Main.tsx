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

  if (scenesAndMetadata.length === 0) {
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

  const lastRealScene = scenesAndMetadata[
    scenesAndMetadata.length - 1
  ] as SceneAndMetadata;
  const lastSceneFrame =
    lastRealScene.from + lastRealScene.durationInFrames - 1;
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
