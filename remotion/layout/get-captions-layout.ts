import type { CanvasLayout, Dimensions } from "../../config/layout";
import { getSafeSpace } from "../../config/layout";
import type { FinalWebcamPosition } from "../../config/scenes";
import {} from "../animations/webcam-transitions";
import {
  isWebCamAtBottom,
  isWebCamRight,
} from "../animations/webcam-transitions/helpers";
import type { SubtitleType } from "../captions/Segment";
import { borderRadius } from "./get-layout";
import { getBottomSafeSpace } from "./get-safe-space";
import type { Layout } from "./layout-types";

export const getCaptionsLayout = ({
  subtitleType,
  canvasLayout,
  canvasSize,
  webcamLayout,
  webcamPosition,
  displayLayout,
  fontSize,
}: {
  subtitleType: SubtitleType;
  canvasLayout: CanvasLayout;
  canvasSize: Dimensions;
  webcamLayout: Layout;
  webcamPosition: FinalWebcamPosition;
  displayLayout: Dimensions | null;
  fontSize: number;
}): Layout => {
  if (subtitleType === "overlayed-center") {
    const height = fontSize * 2;
    const width = (canvasSize.width / 3) * 2;
    const x = (canvasSize.width - width) / 2;

    return {
      height,
      top: canvasSize.height - getBottomSafeSpace("square") * 3 - height,
      borderRadius,
      width,
      left: x,
      opacity: 1,
    };
  }

  if (canvasLayout === "landscape") {
    const height = getBottomSafeSpace(canvasLayout);
    return {
      height,
      left: canvasSize.width / 6,
      top: canvasSize.height - height,
      width: (canvasSize.width / 3) * 2,
      borderRadius: 0,
      opacity: 1,
    };
  }

  if (displayLayout === null) {
    const isTopAligned = !isWebCamAtBottom(webcamPosition);

    return {
      height:
        canvasSize.height -
        webcamLayout.height -
        getSafeSpace(canvasLayout) * 3,
      top: isTopAligned
        ? webcamLayout.height + getSafeSpace(canvasLayout) * 2
        : getSafeSpace(canvasLayout),
      left: getSafeSpace(canvasLayout),
      width: canvasSize.width - getSafeSpace(canvasLayout) * 2,
      borderRadius,
      opacity: 1,
    };
  }

  return {
    height: webcamLayout.height,
    top: webcamLayout.top,
    left: isWebCamRight(webcamPosition)
      ? getSafeSpace(canvasLayout)
      : webcamLayout.width + getSafeSpace(canvasLayout) * 2,
    width:
      canvasSize.width - webcamLayout.width - getSafeSpace(canvasLayout) * 3,
    borderRadius,
    opacity: 1,
  };
};
