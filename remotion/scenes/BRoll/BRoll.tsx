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
import type { CanvasLayout, Dimensions } from "../../../config/layout";
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

function getMaxImageSize({
  containerWidth,
  containerHeight,
  imageHeight,
  imageWidth,
}: {
  containerWidth: number;
  containerHeight: number;
  imageWidth: number;
  imageHeight: number;
}): Dimensions {
  const containerRatio = containerWidth / containerHeight;
  const imageRatio = imageWidth / imageHeight;

  let maxWidth: number;
  let maxHeight: number;

  if (imageRatio > containerRatio) {
    // Image is more landscape than the container
    maxWidth = containerWidth;
    maxHeight = maxWidth / imageRatio;
  } else {
    // Image is more portrait than the container or the same aspect ratio
    maxHeight = containerHeight;
    maxWidth = maxHeight * imageRatio;
  }

  return {
    width: Math.floor(maxWidth),
    height: Math.floor(maxHeight),
  };
}

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

  const biggestLayout = useMemo(() => {
    return getMaxImageSize({
      containerHeight: bRollLayout.height,
      containerWidth: bRollLayout.width,
      imageHeight: bRoll.assetHeight,
      imageWidth: bRoll.assetWidth,
    });
  }, [
    bRoll.assetHeight,
    bRoll.assetWidth,
    bRollLayout.height,
    bRollLayout.width,
  ]);

  const style = useMemo(() => {
    return {
      borderRadius: bRollLayout.borderRadius,
      overflow: "hidden",
      boxShadow: "0 0 50px rgba(0, 0, 0, 0.2)",
      height: biggestLayout.height,
      width: biggestLayout.width,
      aspectRatio: bRoll.assetWidth / bRoll.assetHeight,
    };
  }, [
    bRoll.assetHeight,
    bRoll.assetWidth,
    bRollLayout.borderRadius,
    biggestLayout.height,
    biggestLayout.width,
  ]);

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
