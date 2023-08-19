import type { CanvasLayout } from "../configuration";
import { safeSpace } from "./get-layout";

export const getBottomSafeSpace = (canvasSize: CanvasLayout) => {
  if (canvasSize === "wide") {
    return 140;
  }

  if (canvasSize === "square") {
    return safeSpace;
  }

  return 120;
};
