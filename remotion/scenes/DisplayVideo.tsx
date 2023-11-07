import { OffthreadVideo, useVideoConfig } from "remotion";
import { getDisplayTranslation } from "../animations/camera-scene-transitions";
import type { SceneAndMetadata, VideoSceneAndMetadata } from "../configuration";

export const DisplayVideo: React.FC<{
  scene: VideoSceneAndMetadata;
  enter: number;
  exit: number;
  nextScene: SceneAndMetadata | null;
  previousScene: SceneAndMetadata | null;
  startFrom: number;
  endAt: number | undefined;
}> = ({ scene, enter, exit, nextScene, previousScene, endAt, startFrom }) => {
  if (scene.layout.displayLayout === null) {
    throw new Error("No display");
  }

  if (scene.pair.display === null) {
    throw new Error("No display");
  }

  const { width } = useVideoConfig();

  const displayTranslation = getDisplayTranslation({
    enter,
    exit,
    width,
    nextScene,
    previousScene,
    currentScene: scene,
  });

  return (
    <div
      style={{
        width: scene.layout.displayLayout.width,
        height: scene.layout.displayLayout.height,
        left: scene.layout.displayLayout.x,
        top: scene.layout.displayLayout.y,
        position: "absolute",
        borderRadius: scene.layout.displayLayout.borderRadius,
        opacity: displayTranslation.opacity,
        translate: `${displayTranslation.translationX}px ${displayTranslation.translationY}px`,
      }}
    >
      <OffthreadVideo
        startFrom={startFrom}
        endAt={endAt}
        src={scene.pair.display.src}
        style={{
          maxWidth: "100%",
          borderRadius: scene.layout.displayLayout.borderRadius,
        }}
      />
    </div>
  );
};
