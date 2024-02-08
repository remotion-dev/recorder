import type { CanvasLayout } from "../configuration";
import { getBottomSafeSpace } from "./get-safe-space";
import type { Dimensions } from "./layout-types";
import { safeSpace } from "./safe-space";

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
    canvasSize.height - bottomSafeSpace - safeSpace(canvasLayout);

  if (canvasLayout === "square") {
    const threeFifths = withoutSafeAreas * (3 / 5);

    return threeFifths;
  }

  return withoutSafeAreas;
};

const LANDSCAPE_DISPLAY_MAX_WIDTH_OF_CANVAS = 0.77;

const getMaxWidth = ({
  canvasSize,
  canvasLayout,
}: {
  canvasSize: Dimensions;
  canvasLayout: CanvasLayout;
}) => {
  const withoutSafeArea = canvasSize.width - safeSpace(canvasLayout) * 2;
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
