import type React from "react";
import type { CanvasLayout, Dimensions } from "../../config/layout";
import type { SceneAndMetadata } from "../../config/scenes";
import { fitElementSizeInContainer } from "./fit-element";
import type { Layout } from "./layout-types";

// Background blur should only be enabled in landscape layout
// when the webcam is in fullscreen
export const shouldEnableSceneBackgroundBlur = (
  scene: SceneAndMetadata,
  canvasLayout: CanvasLayout,
) => {
  if (scene.type !== "video-scene") {
    return false;
  }

  if (scene.layout.displayLayout) {
    return false;
  }

  return canvasLayout === "landscape";
};

export const getBlurLayout = ({
  containerLayout,
  assetSize,
}: {
  containerLayout: Layout;
  assetSize: Dimensions;
}) => {
  const inner = fitElementSizeInContainer({
    containerSize: containerLayout,
    elementSize: assetSize,
  });

  const outerStyle: React.CSSProperties = {
    ...containerLayout,
    left: 0,
    top: 0,
    overflow: "hidden",
  };

  const innerStyle: React.CSSProperties = {
    position: "absolute",
    ...containerLayout,
    ...inner,
  };

  const needsBlur = inner.left > 0.000001 || inner.top > 0.000001;

  return {
    needsBlur,
    outerStyle,
    innerStyle,
    blurStyle: {
      // Chrome has "blur bleed" where it does not blur the edges of the image.
      // Fixing by making the image larger
      width: "110%",
      height: "110%",
      objectFit: "cover",
      filter: "blur(20px)",
      top: "-5%",
      left: "-5%",
      position: "absolute",
    } as React.CSSProperties,
  };
};
