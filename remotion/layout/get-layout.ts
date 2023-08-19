import type React from "react";
import type { CanvasSize, WebcamPosition } from "../configuration";
import { getBottomSafeSpace } from "./get-safe-space";

export const frameWidth = 0;
export const borderRadius = 10;

type Layout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

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
  const safeSpace = 10;

  const bottomSafeSpace = getBottomSafeSpace(canvasSize);

  const maxHeight = canvasHeight - bottomSafeSpace - safeSpace;
  const maxWidth = canvasWidth - safeSpace * 2;

  const heightRatio = maxHeight / (videoHeight + frameWidth * 2);
  const widthRatio = maxWidth / (videoWidth + frameWidth * 2);

  const ratio = Math.min(heightRatio, widthRatio);

  const newWidth = (videoWidth + frameWidth * 2) * ratio;
  const newHeight = (videoHeight + frameWidth * 2) * ratio;

  const x = (canvasWidth - newWidth) / 2;
  const y = (canvasHeight - newHeight - bottomSafeSpace) / 2;

  return {
    x,
    y,
    width: newWidth,
    height: newHeight,
  };
};

export const getLayout = ({
  display,
  webcam,
  canvasHeight,
  canvasWidth,
  canvasSize,
}: {
  display: {
    width: number;
    height: number;
  } | null;
  webcam: {
    width: number;
    height: number;
  } | null;
  canvasWidth: number;
  canvasHeight: number;
  canvasSize: CanvasSize;
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

  const webcamLayout = webcam
    ? display
      ? { width: 350, height: 400, x: 0, y: 0 }
      : wideLayout({
          videoWidth: webcam.width,
          videoHeight: webcam.height,
          canvasWidth,
          canvasHeight,
          canvasSize,
        })
    : null;

  return { displayLayout, webcamLayout };
};

export const webCamCSS = (
  webcamPosition: WebcamPosition,
  canvasSize: CanvasSize
): React.CSSProperties => {
  if (webcamPosition === "bottom-left") {
    return {
      left: 40,
      bottom: 40 + getBottomSafeSpace(canvasSize),
    };
  }

  if (webcamPosition === "bottom-right") {
    return {
      right: 40,
      bottom: 40 + getBottomSafeSpace(canvasSize),
    };
  }

  if (webcamPosition === "top-left") {
    return {
      top: 40,
      left: 40,
    };
  }

  if (webcamPosition === "top-right") {
    return {
      top: 40,
      right: 40,
    };
  }

  if (webcamPosition === "center") {
    return {
      justifyContent: "center",
      alignItems: "center",
      padding: 40,
      width: "100%",
      height: "100%",
      paddingBottom: getBottomSafeSpace(canvasSize),
    };
  }

  return {
    justifyContent: "flex-start",
    alignItems: "flex-end",
    padding: 40,
    paddingBottom: getBottomSafeSpace(canvasSize),
  };
};
