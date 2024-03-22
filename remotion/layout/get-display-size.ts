import type { CanvasLayout, Dimensions } from "../../config/layout";
import {
  getSafeSpace,
  LANDSCAPE_DISPLAY_MAX_WIDTH_OF_CANVAS,
} from "../../config/layout";
import { getBottomSafeSpace } from "./get-safe-space";

const getMaxHeight = ({
  canvasSize,
  canvasLayout,
  bottomSafeSpace,
}: {
  canvasSize: Dimensions;
  canvasLayout: CanvasLayout;
  bottomSafeSpace: number;
}) => {
  const withoutSafeAreas =
    canvasSize.height - bottomSafeSpace - getSafeSpace(canvasLayout);

  if (canvasLayout === "square") {
    const threeFifths = withoutSafeAreas * (3 / 5);

    return threeFifths;
  }

  return withoutSafeAreas;
};

const getMaxWidth = ({
  canvasSize,
  canvasLayout,
}: {
  canvasSize: Dimensions;
  canvasLayout: CanvasLayout;
}) => {
  const withoutSafeArea = canvasSize.width - getSafeSpace(canvasLayout) * 2;
  const fourFifths = canvasSize.width * LANDSCAPE_DISPLAY_MAX_WIDTH_OF_CANVAS;
  if (canvasLayout === "landscape") {
    return fourFifths;
  }

  return withoutSafeArea;
};

export const getDisplaySize = ({
  canvasLayout,
  canvasSize,
  videoHeight,
  videoWidth,
}: {
  canvasLayout: CanvasLayout;
  canvasSize: Dimensions;
  videoWidth: number;
  videoHeight: number;
}): Dimensions => {
  const bottomSafeSpace = getBottomSafeSpace(canvasLayout);

  const maxHeight = getMaxHeight({ canvasSize, canvasLayout, bottomSafeSpace });
  const maxWidth = getMaxWidth({ canvasSize, canvasLayout });

  const heightRatio = maxHeight / videoHeight;
  const widthRatio = maxWidth / videoWidth;

  const ratio = Math.min(heightRatio, widthRatio);

  const newWidth = videoWidth * ratio;
  const newHeight = videoHeight * ratio;

  return {
    width: newWidth,
    height: newHeight,
  };
};
