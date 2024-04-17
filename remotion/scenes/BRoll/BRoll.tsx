import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { CanvasLayout } from "../../../config/layout";
import type { BRollWithDimensions } from "../../../config/scenes";
import { B_ROLL_TRANSITION_DURATION } from "../../../config/transitions";
import type {
  BRollEnterDirection,
  BRollType,
  Layout,
} from "../../layout/layout-types";
import { ScaleDownIfBRollRequiresIt } from "./ScaleDownWithBRoll";

const FadeBRoll: React.FC<{
  bRoll: BRollWithDimensions;
  appearProgress: number;
  disappearProgress: number;
}> = ({ bRoll, appearProgress, disappearProgress }) => {
  const style: React.CSSProperties = useMemo(() => {
    return {
      opacity: appearProgress - disappearProgress,
      objectFit: "cover",
    };
  }, [appearProgress, disappearProgress]);

  return (
    <AbsoluteFill>
      {bRoll.type === "image" ? <Img src={bRoll.source} style={style} /> : null}
      {bRoll.type === "video" ? (
        <OffthreadVideo src={bRoll.source} muted style={style} />
      ) : null}
    </AbsoluteFill>
  );
};

const InnerBRoll: React.FC<{
  bRoll: BRollWithDimensions;
  bRollsBefore: BRollWithDimensions[];
  bRollEnterDirection: BRollEnterDirection;
  bRollType: BRollType;
  bRollLayout: Layout;
  sceneFrame: number;
  canvasLayout: CanvasLayout;
  appearProgress: number;
  disappearProgress: number;
  canvasHeight: number;
}> = ({
  bRoll,
  bRollsBefore,
  bRollLayout,
  bRollType,
  bRollEnterDirection,
  sceneFrame,
  canvasLayout,
  appearProgress,
  disappearProgress,
  canvasHeight,
}) => {
  const bRollContainer: Layout = useMemo(() => {
    return {
      ...bRollLayout,
      display: "flex",
    };
  }, [bRollLayout]);

  const enterPosition = useMemo(() => {
    if (bRollEnterDirection === "top") {
      return -bRollLayout.height;
    }

    if (bRollEnterDirection === "bottom") {
      return canvasHeight;
    }

    throw new Error(`Invalid direction ${bRollEnterDirection}`);
  }, [bRollEnterDirection, bRollLayout.height, canvasHeight]);

  const topOffset = interpolate(
    appearProgress - disappearProgress,
    [0, 1],
    [enterPosition, bRollLayout.top],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const outerStyle: React.CSSProperties = useMemo(() => {
    return {
      ...bRollContainer,
      position: "absolute",
      top: topOffset,
      justifyContent: "center",
      alignItems: "center",
    };
  }, [bRollContainer, topOffset]);

  const style = useMemo(() => {
    return {
      borderRadius: bRollLayout.borderRadius,
      overflow: "hidden",
      boxShadow: "0 0 50px rgba(0, 0, 0, 0.2)",
      maxWidth: "100%",
      maxHeight: "100%",
    };
  }, [bRollLayout.borderRadius]);

  if (bRollType === "fade") {
    return (
      <FadeBRoll
        appearProgress={appearProgress}
        disappearProgress={disappearProgress}
        bRoll={bRoll}
      />
    );
  }

  return (
    <ScaleDownIfBRollRequiresIt
      canvasLayout={canvasLayout}
      frame={sceneFrame}
      bRolls={bRollsBefore}
      bRollLayout={bRollLayout}
      bRollEnterDirection={bRollEnterDirection}
      style={outerStyle}
      bRollType={bRollType}
    >
      {bRoll.type === "image" ? <Img src={bRoll.source} style={style} /> : null}
      {bRoll.type === "video" ? (
        <OffthreadVideo src={bRoll.source} muted style={style} />
      ) : null}
    </ScaleDownIfBRollRequiresIt>
  );
};

const Inner: React.FC<{
  bRoll: BRollWithDimensions;
  bRollsBefore: BRollWithDimensions[];
  bRollEnterDirection: BRollEnterDirection;
  bRollLayout: Layout;
  sceneFrame: number;
  canvasLayout: CanvasLayout;
}> = ({
  bRoll,
  bRollsBefore,
  bRollLayout,
  bRollEnterDirection,
  sceneFrame,
  canvasLayout,
}) => {
  const { fps, height } = useVideoConfig();
  const frame = useCurrentFrame();

  const appear = spring({
    fps,
    frame,
    config: {
      damping: 200,
    },
    durationInFrames: B_ROLL_TRANSITION_DURATION,
  });

  const disappear = spring({
    fps,
    frame,
    delay: bRoll.durationInFrames - B_ROLL_TRANSITION_DURATION,
    config: {
      damping: 200,
    },
    durationInFrames: B_ROLL_TRANSITION_DURATION,
  });

  return (
    <InnerBRoll
      bRoll={bRoll}
      bRollEnterDirection={bRollEnterDirection}
      bRollLayout={bRollLayout}
      bRollsBefore={bRollsBefore}
      canvasLayout={canvasLayout}
      appearProgress={appear}
      disappearProgress={disappear}
      sceneFrame={sceneFrame}
      canvasHeight={height}
      bRollType={canvasLayout === "landscape" ? "fade" : "scale"}
    />
  );
};

export const BRoll: React.FC<{
  bRoll: BRollWithDimensions;
  bRollsBefore: BRollWithDimensions[];
  bRollEnterDirection: BRollEnterDirection;
  sceneFrame: number;
  bRollLayout: Layout;
  canvasLayout: CanvasLayout;
}> = ({
  bRoll,
  bRollsBefore,
  sceneFrame,
  bRollLayout,
  bRollEnterDirection,
  canvasLayout,
}) => {
  if (bRoll.durationInFrames <= 0) {
    return null;
  }

  return (
    <Sequence from={bRoll.from} durationInFrames={bRoll.durationInFrames}>
      <Inner
        sceneFrame={sceneFrame}
        bRollsBefore={bRollsBefore}
        bRoll={bRoll}
        bRollLayout={bRollLayout}
        bRollEnterDirection={bRollEnterDirection}
        canvasLayout={canvasLayout}
      />
    </Sequence>
  );
};
