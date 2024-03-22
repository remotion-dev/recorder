import type { WebcamPosition } from "../../config/scenes";
import type { CanvasLayout } from "../configuration";
import type { Dimensions } from "./layout-types";
import { safeSpace } from "./safe-space";

export const overrideYForAltLayouts = ({
  y,
  webcamPosition,
  canvasLayout,
  canvasSize,
  newHeight,
}: {
  y: number;
  webcamPosition: WebcamPosition;
  canvasLayout: CanvasLayout;
  canvasSize: Dimensions;
  newHeight: number;
}): number => {
  if (canvasLayout === "landscape") {
    return y;
  }

  if (webcamPosition === "top-left") {
    return canvasSize.height - newHeight - safeSpace(canvasLayout);
  }

  if (webcamPosition === "top-right") {
    return canvasSize.height - newHeight - safeSpace(canvasLayout);
  }

  if (webcamPosition === "bottom-left") {
    return safeSpace(canvasLayout);
  }

  if (webcamPosition === "bottom-right") {
    return safeSpace(canvasLayout);
  }

  return y;
};
