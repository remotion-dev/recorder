import type { CanvasLayout } from "../../config/layout";
import { safeSpace } from "./safe-space";

export const getBottomSafeSpace = (canvasLayout: CanvasLayout) => {
  if (canvasLayout === "landscape") {
    return 140;
  }

  return safeSpace(canvasLayout);
};
