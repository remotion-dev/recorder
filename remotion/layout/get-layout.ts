import type { CanvasSize, Dimensions, WebcamPosition } from "../configuration";
import { getBottomSafeSpace } from "./get-safe-space";

export const borderRadius = 10;

type Layout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const frameWidth = 0;

const webcamRatio = 400 / 350;

export const safeSpace = 10;

const wideLayout = ({
  videoWidth,
  videoHeight,
  canvasWidth,
  canvasHeight,
  canvasSize,
}: {
  videoWidth: number;
  videoHeight: number;
  canvasWidth: number;
  canvasHeight: number;
  canvasSize: CanvasSize;
}): Layout => {
  const bottomSafeSpace = getBottomSafeSpace(canvasSize);

  const maxHeight = canvasHeight - bottomSafeSpace - safeSpace;
  const maxWidth = canvasWidth - safeSpace * 2;

  const heightRatio = maxHeight / (videoHeight + frameWidth * 2);
  const widthRatio = maxWidth / (videoWidth + frameWidth * 2);

  const ratio = Math.min(heightRatio, widthRatio);

  const newWidth = (videoWidth + frameWidth * 2) * ratio;
  const newHeight = (videoHeight + frameWidth * 2) * ratio;

  const x = (canvasWidth - newWidth) / 2;
  const y = (canvasHeight - newHeight - bottomSafeSpace) / 2 + safeSpace / 2;

  return {
    x,
    y,
    width: newWidth,
    height: newHeight,
  };
};

const shiftDisplayLayoutBasedOnWebcamPosition = ({
  layout,
  webcamPosition,
  webcamSize,
}: {
  layout: Layout;
  webcamPosition: WebcamPosition;
  webcamSize: Dimensions;
}): Layout => {
  if (webcamPosition === "bottom-right" || webcamPosition === "top-right") {
    return {
      ...layout,
      x: layout.x - webcamSize.width / 2 - safeSpace / 2,
    };
  }

  if (webcamPosition === "bottom-left" || webcamPosition === "top-left") {
    return {
      ...layout,
      x: layout.x + webcamSize.width / 2 + safeSpace / 2,
    };
  }

  return layout;
};

const makeWebcamLayoutBasedOnWebcamPosition = ({
  webcamSize,
  webcamPosition,
  layout,
  canvasSize,
}: {
  webcamSize: Dimensions;
  webcamPosition: WebcamPosition;
  layout: CanvasSize;
  canvasSize: Dimensions;
}): Layout => {
  if (webcamPosition === "bottom-right") {
    return {
      ...webcamSize,
      x: canvasSize.width - webcamSize.width - safeSpace,
      y: canvasSize.height - webcamSize.height - getBottomSafeSpace(layout),
    };
  }

  if (webcamPosition === "bottom-left") {
    return {
      ...webcamSize,
      x: safeSpace,
      y: canvasSize.height - webcamSize.height - getBottomSafeSpace(layout),
    };
  }

  if (webcamPosition === "top-left") {
    return {
      ...webcamSize,
      x: safeSpace,
      y: safeSpace,
    };
  }

  if (webcamPosition === "top-right") {
    return {
      ...webcamSize,
      x: canvasSize.width - webcamSize.width - safeSpace,
      y: safeSpace,
    };
  }

  return {
    height: webcamSize.height,
    width: webcamSize.width,
    x: 0,
    y: 0,
  };
};

const getWebcamSize = ({
  displayLayout,
  canvasWidth,
}: {
  displayLayout: Layout;
  canvasWidth: number;
}): Dimensions => {
  const remainingWidth = canvasWidth - displayLayout.width - safeSpace * 3;
  const height = webcamRatio * remainingWidth;

  return {
    width: remainingWidth,
    height,
  };
};

export const getLayout = ({
  display,
  webcam,
  canvasHeight,
  canvasWidth,
  canvasSize,
  webcamPosition,
}: {
  display: Dimensions | null;
  webcam: Dimensions | null;
  canvasWidth: number;
  canvasHeight: number;
  canvasSize: CanvasSize;
  webcamPosition: WebcamPosition;
}): { webcamLayout: Layout | null; displayLayout: Layout | null } => {
  const displayLayout = display
    ? wideLayout({
        videoWidth: display.width,
        videoHeight: display.height,
        canvasWidth,
        canvasHeight,
        canvasSize,
      })
    : null;

  const webcamSize: Dimensions = displayLayout
    ? getWebcamSize({
        canvasWidth,
        displayLayout,
      })
    : { height: 0, width: 0 };

  const webcamLayout = webcam
    ? display
      ? makeWebcamLayoutBasedOnWebcamPosition({
          webcamPosition,
          canvasSize: { height: canvasHeight, width: canvasWidth },
          layout: canvasSize,
          webcamSize,
        })
      : wideLayout({
          videoWidth: webcam.width,
          videoHeight: webcam.height,
          canvasWidth,
          canvasHeight,
          canvasSize,
        })
    : null;

  return {
    displayLayout: displayLayout
      ? shiftDisplayLayoutBasedOnWebcamPosition({
          layout: displayLayout,
          webcamPosition,
          webcamSize,
        })
      : null,
    webcamLayout,
  };
};
