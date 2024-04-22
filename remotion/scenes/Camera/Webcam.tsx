import React, { useMemo } from "react";
import { OffthreadVideo, useCurrentFrame, useVideoConfig } from "remotion";
import type { CanvasLayout } from "../../../config/layout";
import type {
  BRollWithDimensions,
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import { getWebcamLayout } from "../../animations/webcam-transitions";
import type {
  BRollEnterDirection,
  BRollType,
  Layout,
} from "../../layout/layout-types";
import { BRollStack } from "../BRoll/BRollStack";
import { ScaleDownIfBRollRequiresIt } from "../BRoll/ScaleDownWithBRoll";

const outer: React.CSSProperties = {
  position: "absolute",
  display: "flex",
};

export const Webcam: React.FC<{
  webcamLayout: Layout;
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
  webcamLayout,
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

  const webcamStyle = useMemo(() => {
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
      ...webcamStyle,
    };
  }, [webcamStyle]);

  const style: React.CSSProperties = useMemo(() => {
    return {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
      borderRadius: webcamLayout.borderRadius,
      overflow: "hidden",
      transformOrigin: "50% 0%",
    };
  }, [webcamLayout.borderRadius]);

  return (
    <div style={outer}>
      <ScaleDownIfBRollRequiresIt
        canvasLayout={canvasLayout}
        bRollEnterDirection={bRollEnterDirection}
        bRolls={bRolls}
        bRollLayout={bRollLayout}
        frame={frame}
        style={container}
        bRollType={bRollType}
      >
        <OffthreadVideo
          startFrom={startFrom}
          endAt={endAt}
          style={style}
          src={currentScene.pair.webcam.src}
        />
      </ScaleDownIfBRollRequiresIt>
      <BRollStack
        canvasLayout={canvasLayout}
        bRollEnterDirection={bRollEnterDirection}
        bRolls={bRolls}
        bRollLayout={bRollLayout}
      />
    </div>
  );
};
