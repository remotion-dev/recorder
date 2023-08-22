import type {
  CanvasLayout,
  Dimensions,
  WebcamPosition,
} from "../configuration";
import { getBottomSafeSpace } from "./get-safe-space";

export const borderRadius = 20;

export type Layout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const frameWidth = 0;

const webcamRatio = 400 / 350;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const safeSpace = (_canvasLayout: CanvasLayout) => 30;
export const tallLayoutVerticalSafeSpace = 300;

const overrideYForAltLayouts = ({
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
  if (canvasLayout === "wide") {
    return y;
  }

  if (canvasLayout === "tall") {
    return tallLayoutVerticalSafeSpace;
  }

  if (webcamPosition === "top-left") {
    return canvasSize.height - newHeight - safeSpace(canvasLayout);
  }

  if (webcamPosition === "top-right") {
    return canvasSize.height - newHeight - safeSpace(canvasLayout);
  }

  if (webcamPosition === "bottom-left") {
    return safeSpace(canvasLayout);
  }

  if (webcamPosition === "bottom-right") {
    return safeSpace(canvasLayout);
  }

  return y;
};

const fullscreenLayout = ({
  canvasSize,
  canvasLayout,
}: {
  canvasSize: Dimensions;
  canvasLayout: CanvasLayout;
}) => {
  return {
    x: safeSpace(canvasLayout),
    y: safeSpace(canvasLayout),
    width: canvasSize.width - safeSpace(canvasLayout) * 2,
    height: canvasSize.height - safeSpace(canvasLayout) * 2,
  };
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

  const maxHeight =
    canvasSize.height - bottomSafeSpace - safeSpace(canvasLayout);
  const maxWidth = canvasSize.width - safeSpace(canvasLayout) * 2;

  const heightRatio = maxHeight / (videoHeight + frameWidth * 2);
  const widthRatio = maxWidth / (videoWidth + frameWidth * 2);

  const ratio = Math.min(heightRatio, widthRatio);

  const newWidth = (videoWidth + frameWidth * 2) * ratio;
  const newHeight = (videoHeight + frameWidth * 2) * ratio;

  const x = (canvasSize.width - newWidth) / 2;
  const y =
    (canvasSize.height - newHeight - bottomSafeSpace) / 2 +
    safeSpace(canvasLayout) / 2;

  return {
    x,
    y: overrideYForAltLayouts({
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
  canvasLayout,
}: {
  layout: Layout;
  webcamPosition: WebcamPosition;
  webcamSize: Dimensions;
  canvasLayout: CanvasLayout;
}): Layout => {
  if (canvasLayout === "square") {
    return layout;
  }

  if (webcamPosition === "bottom-right" || webcamPosition === "top-right") {
    return {
      ...layout,
      x: layout.x - webcamSize.width / 2 - safeSpace(canvasLayout) / 2,
    };
  }

  if (webcamPosition === "bottom-left" || webcamPosition === "top-left") {
    return {
      ...layout,
      x: layout.x + webcamSize.width / 2 + safeSpace(canvasLayout) / 2,
    };
  }

  return layout;
};

const makeWebcamLayoutBasedOnWebcamPosition = ({
  webcamSize,
  webcamPosition,
  canvasLayout,
  canvasSize,
  webcamVideoDimensions,
}: {
  webcamSize: Dimensions;
  webcamPosition: WebcamPosition;
  canvasLayout: CanvasLayout;
  canvasSize: Dimensions;
  webcamVideoDimensions: Dimensions;
}): Layout => {
  if (canvasLayout === "tall") {
    const ratio = webcamVideoDimensions.height / webcamVideoDimensions.width;
    const width = canvasSize.width - safeSpace(canvasLayout) * 2;
    const height = width * ratio;

    return {
      width,
      height,
      x: safeSpace(canvasLayout),
      y: canvasSize.height - height - safeSpace(canvasLayout),
    };
  }

  if (webcamPosition === "bottom-right") {
    return {
      ...webcamSize,
      x: canvasSize.width - webcamSize.width - safeSpace(canvasLayout),
      y:
        canvasSize.height -
        webcamSize.height -
        getBottomSafeSpace(canvasLayout),
    };
  }

  if (webcamPosition === "bottom-left") {
    return {
      ...webcamSize,
      x: safeSpace(canvasLayout),
      y:
        canvasSize.height -
        webcamSize.height -
        getBottomSafeSpace(canvasLayout),
    };
  }

  if (webcamPosition === "top-left") {
    return {
      ...webcamSize,
      x: safeSpace(canvasLayout),
      y: safeSpace(canvasLayout),
    };
  }

  if (webcamPosition === "top-right") {
    return {
      ...webcamSize,
      x: canvasSize.width - webcamSize.width - safeSpace(canvasLayout),
      y: safeSpace(canvasLayout),
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
  canvasSize,
  canvasLayout,
}: {
  displayLayout: Layout;
  canvasSize: Dimensions;
  canvasLayout: CanvasLayout;
}): Dimensions => {
  if (canvasLayout === "square") {
    const remainingHeight =
      canvasSize.height - displayLayout.height - safeSpace(canvasLayout) * 3;

    return {
      height: remainingHeight,
      width: remainingHeight * (1 / webcamRatio),
    };
  }

  const remainingWidth =
    canvasSize.width - displayLayout.width - safeSpace(canvasLayout) * 3;
  const height = webcamRatio * remainingWidth;

  return {
    width: remainingWidth,
    height,
  };
};

export const getLayout = ({
  display,
  webcam,
  canvasSize,
  canvasLayout,
  webcamPosition,
}: {
  display: Dimensions | null;
  webcam: Dimensions;
  canvasSize: Dimensions;
  canvasLayout: CanvasLayout;
  webcamPosition: WebcamPosition;
}): { webcamLayout: Layout; displayLayout: Layout | null } => {
  const displayLayout = display
    ? wideLayout({
        videoWidth: display.width,
        videoHeight: display.height,
        canvasSize,
        canvasLayout,
        webcamPosition,
      })
    : null;

  const webcamSize: Dimensions = displayLayout
    ? getWebcamSize({
        canvasSize,
        canvasLayout,
        displayLayout,
      })
    : { height: 0, width: 0 };

  const webcamLayout = display
    ? makeWebcamLayoutBasedOnWebcamPosition({
        webcamPosition,
        canvasSize,
        canvasLayout,
        webcamSize,
        webcamVideoDimensions: webcam,
      })
    : fullscreenLayout({
        canvasSize,
        canvasLayout,
      });

  console.log({ webcamLayout, displayLayout });

  return {
    displayLayout: displayLayout
      ? shiftDisplayLayoutBasedOnWebcamPosition({
          layout: displayLayout,
          webcamPosition,
          webcamSize,
          canvasLayout,
        })
      : null,
    webcamLayout,
  };
};
