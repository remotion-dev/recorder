import type { CanvasLayout } from "../../config/scenes";
import type { Dimensions } from "./layout-types";

export const getDimensionsForLayout = (
  canvasLayout: CanvasLayout,
): Dimensions => {
  if (canvasLayout === "square") {
    return {
      height: 1080,
      width: 1080,
    };
  }

  return {
    height: 1080,
    width: 1920,
  };
};
