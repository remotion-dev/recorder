import type { CanvasLayout } from "../configuration";
import { safeSpace } from "./get-layout";

export const getBottomSafeSpace = (canvasLayout: CanvasLayout) => {
  if (canvasLayout === "landscape") {
    return 140;
  }

  return safeSpace(canvasLayout);
};
