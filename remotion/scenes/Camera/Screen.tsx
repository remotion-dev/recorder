import { OffthreadVideo, useVideoConfig } from "remotion";
import type { CanvasLayout } from "../../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import { getDisplayPosition } from "../../animations/display-transitions";

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

  const displayStyle = getDisplayPosition({
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
        position: "absolute",
        background: "black",
        ...displayStyle,
      }}
    >
      <OffthreadVideo
        startFrom={startFrom}
        endAt={endAt}
        src={scene.pair.display.src}
        style={{
          width: displayStyle.width,
          height: displayStyle.height,
          borderRadius: displayStyle.borderRadius,
          objectFit: "cover",
        }}
      />
    </div>
  );
};
