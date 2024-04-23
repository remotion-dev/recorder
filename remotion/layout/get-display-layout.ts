import type { CanvasLayout } from "../../config/layout";
import { getSafeSpace, type Dimensions } from "../../config/layout";
import type { FinalWebcamPosition } from "../../config/scenes";
import {
  isWebCamAtBottom,
  isWebCamRight,
} from "../animations/webcam-transitions/helpers";
import { borderRadius } from "./get-layout";
import { getBottomSafeSpace } from "./get-safe-space";
import type {
  BRollEnterDirection,
  Layout,
  RecordingsLayout,
} from "./layout-types";

const getYForDisplayLayout = ({
  webcamPosition,
  canvasSize,
  displayHeight,
}: {
  webcamPosition: FinalWebcamPosition;
  canvasSize: Dimensions;
  displayHeight: number;
}): number => {
  if (isWebCamAtBottom(webcamPosition)) {
    return getSafeSpace("square");
  }

  return canvasSize.height - displayHeight - getSafeSpace("square");
};

export const getSquareDisplayLayout = ({
  canvasSize,
  webcamPosition,
  displaySize,
}: {
  canvasSize: Dimensions;
  webcamPosition: FinalWebcamPosition;
  displaySize: Dimensions;
}): Layout => {
  return {
    left: (canvasSize.width - displaySize.width) / 2,
    top: getYForDisplayLayout({
      webcamPosition,
      canvasSize,
      displayHeight: displaySize.height,
    }),
    width: displaySize.width,
    height: displaySize.height,
    borderRadius,
    opacity: 1,
  };
};

export const getSquareBRollLayout = ({
  canvasSize,
  webcamPosition,
  displaySize,
}: {
  canvasSize: Dimensions;
  webcamPosition: FinalWebcamPosition;
  displaySize: Dimensions;
}): { bRollLayout: Layout; bRollEnterDirection: BRollEnterDirection } => {
  return {
    bRollEnterDirection: isWebCamAtBottom(webcamPosition) ? "top" : "bottom",
    bRollLayout: {
      left: getSafeSpace("square"),
      top: getYForDisplayLayout({
        webcamPosition,
        canvasSize,
        displayHeight: displaySize.height,
      }),
      width: canvasSize.width - getSafeSpace("square") * 2,
      height: displaySize.height,
      borderRadius,
      opacity: 1,
    },
  };
};

export const getLandscapeDisplayAndWebcamLayout = ({
  displaySize,
  webcamSize,
  canvasLayout,
  canvasSize,
  webcamPosition,
}: {
  displaySize: Dimensions;
  webcamSize: Dimensions;
  canvasLayout: CanvasLayout;
  canvasSize: Dimensions;
  webcamPosition: FinalWebcamPosition;
}): RecordingsLayout => {
  const totalWidth =
    displaySize.width + webcamSize.width + getSafeSpace(canvasLayout);

  const totalHeight = Math.max(displaySize.height, webcamSize.height);
  const left = (canvasSize.width - totalWidth) / 2;
  const top =
    (canvasSize.height - totalHeight) / 2 -
    (getBottomSafeSpace(canvasLayout) - getSafeSpace(canvasLayout)) / 2;

  const displayLayout: Layout = {
    borderRadius,
    height: displaySize.height,
    width: displaySize.width,
    opacity: 1,
    left: isWebCamRight(webcamPosition)
      ? left
      : left + getSafeSpace("landscape") + webcamSize.width,
    top,
  };

  const webcamLayout: Layout = {
    borderRadius,
    height: webcamSize.height,
    width: webcamSize.width,
    opacity: 1,
    left: isWebCamRight(webcamPosition)
      ? displayLayout.left + displayLayout.width + getSafeSpace("landscape")
      : left,
    top: isWebCamAtBottom(webcamPosition)
      ? top + displaySize.height - webcamSize.height
      : top,
  };

  return {
    displayLayout,
    webcamLayout,
    bRollLayout: displayLayout,
    bRollEnterDirection: isWebCamAtBottom(webcamPosition) ? "top" : "bottom",
  };
};
