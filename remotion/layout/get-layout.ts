import type React from "react";
import type { WebcamPosition } from "../configuration";

export const safeSpaceBottom = 120;
export const frameWidth = 10;
export const borderRadius = 10;

type Layout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const wideLayout = (
  width: number,
  height: number,
  canvasWidth: number,
  canvasHeight: number
): Layout => {
  const safeSpace = 50;

  const maxHeight = canvasHeight - safeSpaceBottom - safeSpace;
  const maxWidth = canvasWidth - safeSpace * 2;

  const heightRatio = maxHeight / (height + frameWidth * 2);
  const widthRatio = maxWidth / (width + frameWidth * 2);

  const ratio = Math.min(heightRatio, widthRatio);

  const newWidth = (width + frameWidth * 2) * ratio;
  const newHeight = (height + frameWidth * 2) * ratio;

  const x = (canvasWidth - newWidth) / 2;
  const y = (canvasHeight - newHeight - safeSpaceBottom) / 2;

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
}): { webcamLayout: Layout | null; displayLayout: Layout | null } => {
  const displayLayout = display
    ? wideLayout(display.width, display.height, canvasWidth, canvasHeight)
    : null;

  const webcamLayout = webcam
    ? display
      ? { width: 350, height: 400, x: 0, y: 0 }
      : wideLayout(webcam.width, webcam.height, canvasWidth, canvasHeight)
    : null;

  return { displayLayout, webcamLayout };
};

export const webCamCSS = (
  webcamPosition: WebcamPosition
): React.CSSProperties => {
  if (webcamPosition === "bottom-left") {
    return {
      left: 40,
      bottom: 40 + safeSpaceBottom,
    };
  }

  if (webcamPosition === "bottom-right") {
    return {
      right: 40,
      bottom: 40 + safeSpaceBottom,
    };
  }

  if (webcamPosition === "top-left") {
    return {
      top: 40,
      left: 40,
    };
  }

  if (webcamPosition === "center") {
    return {
      justifyContent: "center",
      alignItems: "center",
      padding: 40,
      width: "100%",
      height: "100%",
      paddingBottom: safeSpaceBottom,
    };
  }

  return {
    justifyContent: "flex-start",
    alignItems: "flex-end",
    padding: 40,
    paddingBottom: safeSpaceBottom,
  };
};
