import type { CanvasLayout, WebcamPosition } from "../../config/scenes";
import { borderRadius } from "../layout/get-layout";
import { getBottomSafeSpace } from "../layout/get-safe-space";
import type { Dimensions, Layout } from "../layout/layout-types";
import { safeSpace } from "../layout/safe-space";
import type { SubtitleType } from "./Segment";
import { getSubtitlesFontSize } from "./Segment";

export const getSubsLayout = ({
  subtitleType,
  canvasLayout,
  canvasSize,
  webcamLayout,
  webcamPosition,
  displayLayout,
}: {
  subtitleType: SubtitleType;
  canvasLayout: CanvasLayout;
  canvasSize: Dimensions;
  webcamLayout: Layout;
  webcamPosition: WebcamPosition;
  displayLayout: Dimensions | null;
}): Layout => {
  if (subtitleType === "overlayed-center") {
    const height = getSubtitlesFontSize(subtitleType, displayLayout) * 2;
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
    const isTopAligned =
      webcamPosition === "top-left" || webcamPosition === "top-right";

    return {
      height:
        canvasSize.height - webcamLayout.height - safeSpace(canvasLayout) * 3,
      top: isTopAligned
        ? webcamLayout.height + safeSpace(canvasLayout) * 2
        : safeSpace(canvasLayout),
      left: safeSpace(canvasLayout),
      width: canvasSize.width - safeSpace(canvasLayout) * 2,
      borderRadius,
      opacity: 1,
    };
  }

  return {
    height: webcamLayout.height,
    top: webcamLayout.top,
    left:
      webcamPosition === "bottom-left" || webcamPosition === "top-left"
        ? webcamLayout.width + safeSpace(canvasLayout) * 2
        : safeSpace(canvasLayout),
    width: canvasSize.width - webcamLayout.width - safeSpace(canvasLayout) * 3,
    borderRadius,
    opacity: 1,
  };
};
