import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { CanvasLayout } from "../../../config/layout";
import type {
  BRollWithDimensions,
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import { getWebcamLayout } from "../../animations/webcam-transitions";
import { shouldEnableSceneBackgroundBlur } from "../../layout/blur";
import type {
  BRollEnterDirection,
  BRollType,
  Layout,
} from "../../layout/layout-types";
import { BRollStack } from "../BRoll/BRollStack";
import { ScaleDownIfBRollRequiresIt } from "../BRoll/ScaleDownWithBRoll";
import { VideoWithBlur } from "./VideoWithBlur";

export const Webcam: React.FC<{
  enterProgress: number;
  exitProgress: number;
  startFrom: number;
  endAt: number | undefined;
  canvasLayout: CanvasLayout;
  nextScene: SceneAndMetadata | null;
  previousScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  bRolls: BRollWithDimensions[];
  bRollLayout: Layout;
  bRollEnterDirection: BRollEnterDirection;
  bRollType: BRollType;
}> = ({
  enterProgress,
  exitProgress,
  startFrom,
  endAt,
  nextScene,
  previousScene,
  canvasLayout,
  currentScene,
  bRolls,
  bRollLayout,
  bRollEnterDirection,
  bRollType,
}) => {
  const frame = useCurrentFrame();
  const { height, width } = useVideoConfig();

  const webcamLayout = useMemo(() => {
    return getWebcamLayout({
      enterProgress,
      exitProgress,
      canvasHeight: height,
      canvasWidth: width,
      currentScene,
      nextScene,
      previousScene,
      canvasLayout,
    });
  }, [
    canvasLayout,
    currentScene,
    enterProgress,
    exitProgress,
    height,
    nextScene,
    previousScene,
    width,
  ]);

  const container: React.CSSProperties = useMemo(() => {
    return {
      overflow: "hidden",
      position: "relative",
      ...webcamLayout,
    };
  }, [webcamLayout]);

  return (
    <>
      <div style={container}>
        <ScaleDownIfBRollRequiresIt
          bRolls={bRolls}
          frame={frame}
          bRollType={bRollType}
        >
          <VideoWithBlur
            startFrom={startFrom}
            endAt={endAt}
            src={currentScene.cameras.webcam.src}
            containerLayout={webcamLayout}
            videoSize={currentScene.videos.webcam}
            enableBlur={shouldEnableSceneBackgroundBlur(
              currentScene,
              canvasLayout,
            )}
          />
        </ScaleDownIfBRollRequiresIt>
      </div>
      <BRollStack
        canvasLayout={canvasLayout}
        bRollEnterDirection={bRollEnterDirection}
        bRolls={bRolls}
        bRollLayout={bRollLayout}
      />
    </>
  );
};
