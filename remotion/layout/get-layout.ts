import type {
  CanvasLayout,
  Dimensions,
  SceneVideos,
  WebcamPosition,
} from "../configuration";
import { getDimensionsForLayout } from "./dimensions";
import { getBottomSafeSpace } from "./get-safe-space";

export const borderRadius = 20;

export type Layout = {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: number;
  opacity: number;
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
  if (canvasLayout === "landscape") {
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
  canvasLayout,
  webcamSize,
  webcamPosition,
}: {
  canvasSize: Dimensions;
  canvasLayout: CanvasLayout;
  webcamSize: Dimensions;
  webcamPosition: WebcamPosition;
}): Layout => {
  if (canvasLayout === "square") {
    const aspectRatio = webcamSize.width / webcamSize.height;

    const actualWidth = canvasSize.width - safeSpace(canvasLayout) * 2;

    const height = actualWidth / aspectRatio;
    const isTopAligned =
      webcamPosition === "top-left" || webcamPosition === "top-right";

    // TODO: Will look weird with vertical video
    return {
      x: safeSpace(canvasLayout),
      y: isTopAligned
        ? safeSpace(canvasLayout)
        : canvasSize.height - height - safeSpace(canvasLayout),
      width: actualWidth,
      height,
      borderRadius,
      opacity: 1,
    };
  }

  return {
    x: 0,
    y: 0,
    width: canvasSize.width,
    height: canvasSize.height,
    borderRadius: 0,
    opacity: 1,
  };
};

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

const getMaxWidth = ({
  canvasSize,
  canvasLayout,
}: {
  canvasSize: Dimensions;
  canvasLayout: CanvasLayout;
}) => {
  const withoutSafeArea = canvasSize.width - safeSpace(canvasLayout) * 2;
  const fourFifths = canvasSize.width * (4 / 5);
  if (canvasLayout === "landscape") {
    return fourFifths;
  }

  return withoutSafeArea;
};

const getDisplayLayout = ({
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

  const maxHeight = getMaxHeight({ canvasSize, canvasLayout, bottomSafeSpace });
  const maxWidth = getMaxWidth({ canvasSize, canvasLayout });

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
    opacity: 1,
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
      opacity: 1,
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
      opacity: 1,
    };
  }

  if (webcamPosition === "top-left") {
    return {
      ...webcamSize,
      x: safeSpace(canvasLayout),
      y: safeSpace(canvasLayout),
      borderRadius,
      opacity: 1,
    };
  }

  if (webcamPosition === "top-right") {
    return {
      ...webcamSize,
      x: canvasSize.width - webcamSize.width - safeSpace(canvasLayout),
      y: safeSpace(canvasLayout),
      borderRadius,
      opacity: 1,
    };
  }

  return {
    height: webcamSize.height,
    width: webcamSize.width,
    x: 0,
    y: 0,
    borderRadius,
    opacity: 1,
  };
};

const getWebcamSize = ({
  displayLayout,
  canvasSize,
  canvasLayout,
  webcamSize,
}: {
  displayLayout: Layout | null;
  canvasSize: Dimensions;
  canvasLayout: CanvasLayout;
  webcamSize: Dimensions;
}): Dimensions => {
  if (displayLayout === null) {
    const aspectRatio = webcamSize.width / webcamSize.height;

    const actualWidth = canvasSize.width - safeSpace(canvasLayout) * 2;

    const actualHeight = actualWidth / aspectRatio;

    return {
      height: actualHeight,
      width: actualWidth,
    };
  }

  if (canvasLayout === "square") {
    const remainingHeight =
      canvasSize.height - displayLayout.height - safeSpace(canvasLayout) * 3;

    return {
      height: remainingHeight,
      width: remainingHeight * (1 / webcamRatio),
    };
  }

  if (canvasLayout === "landscape") {
    const remainingWidth =
      canvasSize.width - displayLayout.width - safeSpace(canvasLayout) * 3;
    const maxWidth = 450;
    const width = Math.min(remainingWidth, maxWidth);

    const height = webcamRatio * width;

    return {
      width,
      height,
    };
  }

  throw new Error("Invalid canvas layout");
};

export type CameraSceneLayout = {
  webcamLayout: Layout;
  displayLayout: Layout | null;
};

export const getLayout = ({
  canvasLayout,
  videos,
  webcamPosition,
}: {
  videos: SceneVideos;
  canvasLayout: CanvasLayout;
  webcamPosition: WebcamPosition;
}): CameraSceneLayout => {
  const canvasSize = getDimensionsForLayout(canvasLayout);
  const displayLayout = videos.display
    ? getDisplayLayout({
        videoWidth: videos.display.width,
        videoHeight: videos.display.height,
        canvasSize,
        canvasLayout,
        webcamPosition,
      })
    : null;

  const webcamSize: Dimensions = getWebcamSize({
    canvasSize,
    canvasLayout,
    displayLayout,
    webcamSize: videos.webcam,
  });

  const webcamLayout = videos.display
    ? makeWebcamLayoutBasedOnWebcamPosition({
        webcamPosition,
        canvasSize,
        canvasLayout,
        webcamSize,
      })
    : fullscreenLayout({
        canvasSize,
        canvasLayout,
        webcamSize,
        webcamPosition,
      });

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
