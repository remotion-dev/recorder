import type {
  CanvasLayout,
  Dimensions,
  WebcamPosition,
} from "../configuration";
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

const overrideYForSquareLayout = ({
  y,
  webcamPosition,
  canvasLayout,
  canvasSize,
  newHeight,
}: {
  y: number;
  webcamPosition: WebcamPosition;
  canvasLayout: CanvasLayout;
  canvasSize: Dimensions;
  newHeight: number;
}): number => {
  if (canvasLayout !== "square") {
    return y;
  }

  if (webcamPosition === "top-left") {
    return canvasSize.height - newHeight - safeSpace;
  }

  if (webcamPosition === "top-right") {
    return canvasSize.height - newHeight - safeSpace;
  }

  if (webcamPosition === "bottom-left") {
    return safeSpace;
  }

  if (webcamPosition === "bottom-right") {
    return safeSpace;
  }

  return y;
};

const wideLayout = ({
  videoWidth,
  videoHeight,
  canvasSize,
  canvasLayout,
  webcamPosition,
}: {
  videoWidth: number;
  videoHeight: number;
  canvasSize: Dimensions;
  canvasLayout: CanvasLayout;
  webcamPosition: WebcamPosition;
}): Layout => {
  const bottomSafeSpace = getBottomSafeSpace(canvasLayout);

  const maxHeight = canvasSize.height - bottomSafeSpace - safeSpace;
  const maxWidth = canvasSize.width - safeSpace * 2;

  const heightRatio = maxHeight / (videoHeight + frameWidth * 2);
  const widthRatio = maxWidth / (videoWidth + frameWidth * 2);

  const ratio = Math.min(heightRatio, widthRatio);

  const newWidth = (videoWidth + frameWidth * 2) * ratio;
  const newHeight = (videoHeight + frameWidth * 2) * ratio;

  const x = (canvasSize.width - newWidth) / 2;
  const y =
    (canvasSize.height - newHeight - bottomSafeSpace) / 2 + safeSpace / 2;

  return {
    x,
    y: overrideYForSquareLayout({
      y,
      webcamPosition,
      canvasLayout,
      canvasSize,
      newHeight,
    }),
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
  canvasLayout,
  canvasSize,
}: {
  webcamSize: Dimensions;
  webcamPosition: WebcamPosition;
  canvasLayout: CanvasLayout;
  canvasSize: Dimensions;
}): Layout => {
  if (webcamPosition === "bottom-right") {
    return {
      ...webcamSize,
      x: canvasSize.width - webcamSize.width - safeSpace,
      y:
        canvasSize.height -
        webcamSize.height -
        getBottomSafeSpace(canvasLayout),
    };
  }

  if (webcamPosition === "bottom-left") {
    return {
      ...webcamSize,
      x: safeSpace,
      y:
        canvasSize.height -
        webcamSize.height -
        getBottomSafeSpace(canvasLayout),
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
  canvasSize: CanvasLayout;
  webcamPosition: WebcamPosition;
}): { webcamLayout: Layout | null; displayLayout: Layout | null } => {
  const displayLayout = display
    ? wideLayout({
        videoWidth: display.width,
        videoHeight: display.height,
        canvasSize: {
          height: canvasHeight,
          width: canvasWidth,
        },
        canvasLayout: canvasSize,
        webcamPosition,
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
          canvasLayout: canvasSize,
          webcamSize,
        })
      : wideLayout({
          videoWidth: webcam.width,
          videoHeight: webcam.height,
          canvasSize: {
            height: canvasHeight,
            width: canvasWidth,
          },
          webcamPosition,
          canvasLayout: canvasSize,
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
