import type { CanvasLayout, WebcamPosition } from "../../config/scenes";
import { borderRadius } from "./get-layout";
import { getBottomSafeSpace } from "./get-safe-space";
import type { Dimensions, Layout } from "./layout-types";
import { overrideYForAltLayouts } from "./override-y-for-alt-layouts";
import { safeSpace } from "./safe-space";

export const getDisplayLayout = ({
  canvasSize,
  canvasLayout,
  webcamPosition,
  displaySize,
}: {
  canvasSize: Dimensions;
  canvasLayout: CanvasLayout;
  webcamPosition: WebcamPosition;
  displaySize: Dimensions;
}): Layout => {
  const bottomSafeSpace = getBottomSafeSpace(canvasLayout);

  const newWidth = displaySize.width;
  const newHeight = displaySize.height;

  const x = (canvasSize.width - newWidth) / 2;
  const y =
    (canvasSize.height - newHeight - bottomSafeSpace) / 2 +
    safeSpace(canvasLayout) / 2;

  return {
    left: x,
    top: overrideYForAltLayouts({
      y,
      webcamPosition,
      canvasLayout,
      canvasSize,
      newHeight,
    }),
    width: newWidth,
    height: newHeight,
    borderRadius,
    opacity: 1,
  };
};
