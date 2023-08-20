import type { CanvasLayout } from "../configuration";
import { safeSpace } from "./get-layout";

export const getBottomSafeSpace = (canvasLayout: CanvasLayout) => {
  if (canvasLayout === "wide") {
    return 140;
  }

  if (canvasLayout === "square") {
    return safeSpace(canvasLayout);
  }

  return 120;
};
