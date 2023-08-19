import type { CanvasLayout } from "../configuration";

export const getBottomSafeSpace = (canvasSize: CanvasLayout) => {
  if (canvasSize === "wide") {
    return 140;
  }

  if (canvasSize === "square") {
    return 160;
  }

  return 120;
};
