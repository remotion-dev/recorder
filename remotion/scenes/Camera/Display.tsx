import { useMemo } from "react";
import { OffthreadVideo, useCurrentFrame, useVideoConfig } from "remotion";
import type { CanvasLayout } from "../../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import { getDisplayPosition } from "../../animations/display-transitions";
import type { BRollEnterDirection, Layout } from "../../layout/layout-types";
import { BRollStack } from "../BRoll/BRollStack";
import { ScaleDownIfBRollRequiresIt } from "../BRoll/ScaleDownWithBRoll";

const outer: React.CSSProperties = {
  position: "absolute",
  display: "flex",
};

export const Display: React.FC<{
  scene: VideoSceneAndMetadata;
  enterProgress: number;
  exitProgress: number;
  nextScene: SceneAndMetadata | null;
  previousScene: SceneAndMetadata | null;
  startFrom: number;
  endAt: number | undefined;
  canvasLayout: CanvasLayout;
  bRollLayout: Layout;
  bRollEnterDirection: BRollEnterDirection;
}> = ({
  scene,
  enterProgress,
  exitProgress,
  nextScene,
  canvasLayout,
  previousScene,
  endAt,
  startFrom,
  bRollLayout,
  bRollEnterDirection,
}) => {
  if (scene.layout.displayLayout === null) {
    throw new Error("No display");
  }

  if (scene.pair.display === null) {
    throw new Error("No display");
  }

  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const displayLayout = useMemo(() => {
    return getDisplayPosition({
      enterProgress,
      exitProgress,
      canvasWidth: width,
      nextScene,
      previousScene,
      currentScene: scene,
      canvasHeight: height,
      canvasLayout,
    });
  }, [
    canvasLayout,
    enterProgress,
    exitProgress,
    height,
    nextScene,
    previousScene,
    scene,
    width,
  ]);

  return (
    <div style={outer}>
      <ScaleDownIfBRollRequiresIt
        canvasLayout={canvasLayout}
        bRollEnterDirection={bRollEnterDirection}
        bRolls={scene.bRolls}
        bRollLayout={bRollLayout}
        bRollType={scene.layout.bRollType}
        frame={frame}
        style={{
          position: "absolute",
          ...displayLayout,
        }}
      >
        <OffthreadVideo
          muted
          startFrom={startFrom}
          endAt={endAt}
          src={scene.pair.display.src}
          style={{
            width: displayLayout.width,
            height: displayLayout.height,
            borderRadius: displayLayout.borderRadius,
            objectFit: "cover",
          }}
        />
      </ScaleDownIfBRollRequiresIt>
      <BRollStack
        bRollEnterDirection={bRollEnterDirection}
        bRolls={scene.bRolls}
        bRollLayout={bRollLayout}
        canvasLayout={canvasLayout}
      />
    </div>
  );
};
