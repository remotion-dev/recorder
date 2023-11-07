import { OffthreadVideo, useVideoConfig } from "remotion";
import { getDisplayPosition } from "../animations/camera-scene-transitions";
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

  const displayTranslation = getDisplayPosition({
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
        left: displayTranslation.translationX,
        top: displayTranslation.translationY,
        position: "absolute",
        borderRadius: scene.layout.displayLayout.borderRadius,
        opacity: displayTranslation.opacity,
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
