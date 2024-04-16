import type { CanvasLayout, Dimensions } from "../../config/layout";
import { getSafeSpace } from "../../config/layout";
import type { FinalWebcamPosition } from "../../config/scenes";

export const overrideYForAltLayouts = ({
  y,
  webcamPosition,
  canvasLayout,
  canvasSize,
  newHeight,
}: {
  y: number;
  webcamPosition: FinalWebcamPosition;
  canvasLayout: CanvasLayout;
  canvasSize: Dimensions;
  newHeight: number;
}): number => {
  if (canvasLayout === "landscape") {
    return y;
  }

  if (webcamPosition === "top-left") {
    return canvasSize.height - newHeight - getSafeSpace(canvasLayout);
  }

  if (webcamPosition === "top-right") {
    return canvasSize.height - newHeight - getSafeSpace(canvasLayout);
  }

  if (webcamPosition === "bottom-left") {
    return getSafeSpace(canvasLayout);
  }

  if (webcamPosition === "bottom-right") {
    return getSafeSpace(canvasLayout);
  }

  return y;
};
