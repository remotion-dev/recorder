import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { AudioTrack } from "./AudioTrack";
import { makeChapters } from "./chapters/make-chapters";
import { WideScreenChapters } from "./chapters/WideScreenChapters";
import { COLORS } from "./colors";
import type {
  CanvasLayout,
  SceneAndMetadata,
  SceneType,
  Theme,
} from "./configuration";
import { Scene } from "./Scene";

export type AllProps = {
  canvasLayout: CanvasLayout;
  scenes: SceneType[];
  scenesAndMetadata: SceneAndMetadata[];
  theme: Theme;
};

export const All: React.FC<AllProps> = ({
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
      {canvasLayout === "landscape" ? (
        <WideScreenChapters chapters={chapters} />
      ) : null}
      <AudioTrack scenesAndMetadata={scenesAndMetadata} />
    </AbsoluteFill>
  );
};
