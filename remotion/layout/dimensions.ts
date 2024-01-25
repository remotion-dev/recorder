import type { CanvasLayout, Dimensions } from "../configuration";

export const getDimensionsForLayout = (
  canvasLayout: CanvasLayout,
): Dimensions => {
  if (canvasLayout === "square") {
    return {
      height: 1080,
      width: 1080,
    };
  }

  if (canvasLayout === "portrait") {
    return {
      height: 1860,
      width: 1080,
    };
  }

  return {
    height: 1080,
    width: 1920,
  };
};
