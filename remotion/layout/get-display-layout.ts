import {
  getSafeSpace,
  type CanvasLayout,
  type Dimensions,
} from "../../config/layout";
import type { FinalWebcamPosition } from "../../config/scenes";
import { isWebCamAtBottom } from "../animations/webcam-transitions/helpers";
import { borderRadius } from "./get-layout";
import { getBottomSafeSpace } from "./get-safe-space";
import type { Layout } from "./layout-types";

const overrideYForAltLayouts = ({
  webcamPosition,
  canvasLayout,
  canvasSize,
  displayHeight,
}: {
  webcamPosition: FinalWebcamPosition;
  canvasLayout: CanvasLayout;
  canvasSize: Dimensions;
  displayHeight: number;
}): number => {
  if (canvasLayout === "landscape") {
    return (
      (canvasSize.height - displayHeight - getBottomSafeSpace(canvasLayout)) /
        2 +
      getSafeSpace(canvasLayout) / 2
    );
  }

  if (isWebCamAtBottom(webcamPosition)) {
    return getSafeSpace(canvasLayout);
  }

  return canvasSize.height - displayHeight - getSafeSpace(canvasLayout);
};

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
  return {
    left: (canvasSize.width - displaySize.width) / 2,
    top: overrideYForAltLayouts({
      webcamPosition,
      canvasLayout,
      canvasSize,
      displayHeight: displaySize.height,
    }),
    width: displaySize.width,
    height: displaySize.height,
    borderRadius,
    opacity: 1,
  };
};
