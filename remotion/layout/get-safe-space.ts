import type { CanvasSize } from "../configuration";

export const getBottomSafeSpace = (canvasSize: CanvasSize) => {
  if (canvasSize === "wide") {
    return 140;
  }

  if (canvasSize === "square") {
    return 160;
  }

  return 120;
};
