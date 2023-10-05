import { getDimensionsForLayout } from "../calc-metadata";
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
  borderRadius: number;
};

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
}: {
  canvasSize: Dimensions;
}): Layout => {
  return {
    x: 0,
    y: 0,
    width: canvasSize.width,
    height: canvasSize.height,
    borderRadius: 0,
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

  const heightRatio = maxHeight / videoHeight;
  const widthRatio = maxWidth / videoWidth;

  const ratio = Math.min(heightRatio, widthRatio);

  const newWidth = videoWidth * ratio;
  const newHeight = videoHeight * ratio;

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
    borderRadius,
  };
};

const shiftLayoutIfTallMode = ({
  canvasLayout,
  layout,
}: {
  layout: Layout;
  canvasLayout: CanvasLayout;
}) => {
  if (canvasLayout !== "tall") {
    return layout;
  }

  return {
    ...layout,
    y:
      layout.y +
      (getDimensionsForLayout("tall").height -
        getDimensionsForLayout("square").height) /
        2,
    height: layout.height,
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
  if (canvasLayout === "square" || canvasLayout === "tall") {
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
}: {
  webcamSize: Dimensions;
  webcamPosition: WebcamPosition;
  canvasLayout: CanvasLayout;
  canvasSize: Dimensions;
}): Layout => {
  if (webcamPosition === "bottom-right") {
    return {
      ...webcamSize,
      x: canvasSize.width - webcamSize.width - safeSpace(canvasLayout),
      y:
        canvasSize.height -
        webcamSize.height -
        getBottomSafeSpace(canvasLayout),
      borderRadius,
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
      borderRadius,
    };
  }

  if (webcamPosition === "top-left") {
    return {
      ...webcamSize,
      x: safeSpace(canvasLayout),
      y: safeSpace(canvasLayout),
      borderRadius,
    };
  }

  if (webcamPosition === "top-right") {
    return {
      ...webcamSize,
      x: canvasSize.width - webcamSize.width - safeSpace(canvasLayout),
      y: safeSpace(canvasLayout),
      borderRadius,
    };
  }

  return {
    height: webcamSize.height,
    width: webcamSize.width,
    x: 0,
    y: 0,
    borderRadius,
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
  if (canvasLayout === "square" || canvasLayout === "tall") {
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

export type CameraSceneLayout = {
  webcamLayout: Layout;
  displayLayout: Layout | null;
};

export const getLayout = ({
  display,
  canvasLayout,
  webcamPosition,
}: {
  display: Dimensions | null;
  canvasLayout: CanvasLayout;
  webcamPosition: WebcamPosition;
}): CameraSceneLayout => {
  const canvasSize = getDimensionsForLayout(canvasLayout);
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
      })
    : fullscreenLayout({
        canvasSize,
      });

  return {
    displayLayout: displayLayout
      ? shiftLayoutIfTallMode({
          canvasLayout,
          layout: shiftDisplayLayoutBasedOnWebcamPosition({
            layout: displayLayout,
            webcamPosition,
            webcamSize,
            canvasLayout,
          }),
        })
      : null,
    webcamLayout: shiftLayoutIfTallMode({
      canvasLayout,
      layout: webcamLayout,
    }),
  };
};
