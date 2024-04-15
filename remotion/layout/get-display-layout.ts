import type { CanvasLayout, Dimensions } from "../../config/layout";
import { getSafeSpace } from "../../config/layout";
import type { FinalWebcamPosition } from "../../config/scenes";
import { borderRadius } from "./get-layout";
import { getBottomSafeSpace } from "./get-safe-space";
import type { Layout } from "./layout-types";
import { overrideYForAltLayouts } from "./override-y-for-alt-layouts";

export const getDisplayLayout = ({
  canvasSize,
  canvasLayout,
  webcamPosition,
  displaySize,
}: {
  canvasSize: Dimensions;
  canvasLayout: CanvasLayout;
  webcamPosition: FinalWebcamPosition;
  displaySize: Dimensions;
}): Layout => {
  const bottomSafeSpace = getBottomSafeSpace(canvasLayout);

  const newWidth = displaySize.width;
  const newHeight = displaySize.height;

  const x = (canvasSize.width - newWidth) / 2;
  const y =
    (canvasSize.height - newHeight - bottomSafeSpace) / 2 +
    getSafeSpace(canvasLayout) / 2;

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
