import { OffthreadVideo, useVideoConfig } from "remotion";
import { getDisplayPosition } from "../../animations/display-transitions";
import type {
  CanvasLayout,
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../configuration";

export const Screen: React.FC<{
  scene: VideoSceneAndMetadata;
  enter: number;
  exit: number;
  nextScene: SceneAndMetadata | null;
  previousScene: SceneAndMetadata | null;
  startFrom: number;
  endAt: number | undefined;
  canvasLayout: CanvasLayout;
}> = ({
  scene,
  enter,
  exit,
  nextScene,
  canvasLayout,
  previousScene,
  endAt,
  startFrom,
}) => {
  if (scene.layout.displayLayout === null) {
    throw new Error("No display");
  }

  if (scene.pair.display === null) {
    throw new Error("No display");
  }

  const { width, height } = useVideoConfig();

  const displayTranslation = getDisplayPosition({
    enterProgress: enter,
    exitProgress: exit,
    width,
    nextScene,
    previousScene,
    currentScene: scene,
    height,
    canvasLayout,
  });

  return (
    <div
      style={{
        width: displayTranslation.width,
        height: displayTranslation.height,
        left: displayTranslation.left,
        top: displayTranslation.top,
        position: "absolute",
        borderRadius: scene.layout.displayLayout.borderRadius,
        opacity: displayTranslation.opacity,
        background: "black",
      }}
    >
      <OffthreadVideo
        startFrom={startFrom}
        endAt={endAt}
        src={scene.pair.display.src}
        style={{
          width: displayTranslation.width,
          height: displayTranslation.height,
          objectFit: "cover",
          borderRadius: scene.layout.displayLayout.borderRadius,
        }}
      />
    </div>
  );
};
