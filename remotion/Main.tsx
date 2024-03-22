import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import type { CanvasLayout } from "../config/layout";
import type { SceneAndMetadata, SceneType } from "../config/scenes";
import type { Theme } from "../config/themes";
import { COLORS } from "../config/themes";
import { AudioTrack } from "./audio/AudioTrack";
import { subEditorPortal } from "./captions/Editor/layout";
import { makeChapters } from "./chapters/make-chapters";
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
}) => {
  const chapters = useMemo(() => {
    return makeChapters({ scenes: scenesAndMetadata });
  }, [scenesAndMetadata]);

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
      <AudioTrack scenesAndMetadata={scenesAndMetadata} />
      <div ref={subEditorPortal} />
    </AbsoluteFill>
  );
};
