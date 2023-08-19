import type { CanvasSize } from "../configuration";

export const getBottomSafeSpace = (canvasSize: CanvasSize) => {
  if (canvasSize === "wide") {
    return 120;
  }

  if (canvasSize === "square") {
    return 160;
  }

  return 120;
};
