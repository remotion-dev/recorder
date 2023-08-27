import { interpolate } from "remotion";
import type { CanvasLayout, WebcamPosition } from "../configuration";
import type { Layout } from "../layout/get-layout";

export const getDisplayTranslation = ({
  enter,
  exit,
  width,
  nextLayout,
  previousLayout,
  currentLayout,
}: {
  enter: number;
  exit: number;
  width: number;
  previousLayout: Layout | null;
  nextLayout: Layout | null;
  currentLayout: Layout | null;
}) => {
  const enterStartX =
    currentLayout && previousLayout
      ? previousLayout.x - currentLayout.x
      : width;

  const enterStartY =
    currentLayout && previousLayout ? previousLayout.y - currentLayout.y : 0;

  const exitEndX =
    currentLayout && nextLayout ? nextLayout.x - currentLayout.x : -width;

  const exitEndY =
    currentLayout && nextLayout ? nextLayout.y - currentLayout.y : 0;

  const startOpacity = currentLayout && previousLayout ? 0 : 1;

  const enterX = interpolate(enter, [0, 1], [enterStartX, 0]);
  const enterY = interpolate(enter, [0, 1], [enterStartY, 0]);

  const exitX = interpolate(exit, [0, 1], [0, exitEndX]);
  const exitY = interpolate(exit, [0, 1], [0, exitEndY]);

  const opacity = interpolate(enter, [0, 0.5], [startOpacity, 1]);

  const translationX = enterX + exitX;
  const translationY = enterY + exitY;

  return {
    translationX: Math.round(translationX),
    translationY: Math.round(translationY),
    opacity,
  };
};

const isWebCamAtBottom = (webcamPosition: WebcamPosition) => {
  return webcamPosition === "bottom-left" || webcamPosition === "bottom-right";
};

const isWebCamRight = (webcamPosition: WebcamPosition) => {
  return webcamPosition === "top-right" || webcamPosition === "bottom-right";
};

const getWebcamEndOffset = ({
  nextLayout,
  nextWebcamPosition,
  webcamPosition,
  currentLayout,
  width,
  height,
  canvasLayout,
}: {
  nextLayout: Layout | null;
  nextWebcamPosition: WebcamPosition | null;
  webcamPosition: WebcamPosition;
  currentLayout: Layout;
  width: number;
  height: number;
  canvasLayout: CanvasLayout;
}): { endX: number; endY: number } => {
  if (!nextLayout || !nextWebcamPosition) {
    return {
      endX: -width,
      endY: 0,
    };
  }

  const samePositionHorizontal =
    isWebCamAtBottom(nextWebcamPosition) === isWebCamAtBottom(webcamPosition);
  const isSamePositionVertical =
    isWebCamRight(nextWebcamPosition) === isWebCamRight(webcamPosition);

  if (canvasLayout === "wide") {
    if (!isSamePositionVertical) {
      return {
        endX: isWebCamRight(webcamPosition) ? width : -width,
        endY: 0,
      };
    }

    if (!samePositionHorizontal) {
      return {
        endX: 0,
        endY: nextLayout.y - currentLayout.y,
      };
    }

    return {
      endX: -width,
      endY: 0,
    };
  }

  return {
    endX: samePositionHorizontal ? nextLayout.x - currentLayout.x : 0,
    endY: samePositionHorizontal
      ? 0
      : isWebCamAtBottom(webcamPosition)
      ? height
      : -height,
  };
};

const getWebCamStartOffset = ({
  previousLayout,
  previousWebcamPosition,
  webcamPosition,
  currentLayout,
  width,
  height,
  canvasLayout,
}: {
  previousLayout: Layout | null;
  previousWebcamPosition: WebcamPosition | null;
  webcamPosition: WebcamPosition;
  currentLayout: Layout;
  width: number;
  height: number;
  canvasLayout: CanvasLayout;
}): { startX: number; startY: number } => {
  if (!previousLayout || !previousWebcamPosition) {
    return {
      startX: width,
      startY: 0,
    };
  }

  const samePositionHorizontal =
    isWebCamAtBottom(previousWebcamPosition) ===
    isWebCamAtBottom(webcamPosition);
  const isSamePositionVertical =
    isWebCamRight(previousWebcamPosition) === isWebCamRight(webcamPosition);

  if (canvasLayout === "wide") {
    if (!isSamePositionVertical) {
      return {
        startX: isWebCamRight(webcamPosition) ? width : -width,
        startY: 0,
      };
    }

    if (!samePositionHorizontal) {
      return {
        startX: 0,
        startY: previousLayout.y - currentLayout.y,
      };
    }

    return {
      startX: width,
      startY: 0,
    };
  }

  return {
    startX: samePositionHorizontal ? previousLayout.x - currentLayout.x : 0,
    startY: samePositionHorizontal
      ? 0
      : isWebCamAtBottom(webcamPosition)
      ? height
      : -height,
  };
};

export const getWebcamTranslation = ({
  enter,
  exit,
  width,
  height,
  webcamPosition,
  currentLayout,
  nextLayout,
  previousLayout,
  nextWebcamPosition,
  previousWebcamPosition,
  canvasLayout,
}: {
  enter: number;
  exit: number;
  width: number;
  height: number;
  webcamPosition: WebcamPosition;
  previousWebcamPosition: WebcamPosition | null;
  previousLayout: Layout | null;
  nextLayout: Layout | null;
  nextWebcamPosition: WebcamPosition | null;
  currentLayout: Layout;
  canvasLayout: CanvasLayout;
}) => {
  const { startX, startY } = getWebCamStartOffset({
    previousLayout,
    previousWebcamPosition,
    webcamPosition,
    currentLayout,
    width,
    height,
    canvasLayout,
  });

  const { endX, endY } = getWebcamEndOffset({
    nextLayout,
    nextWebcamPosition,
    webcamPosition,
    currentLayout,
    width,
    height,
    canvasLayout,
  });

  const enterX = interpolate(enter, [0, 1], [startX, 0]);
  const enterY = interpolate(enter, [0, 1], [startY, 0]);
  const exitX = interpolate(exit, [0, 1], [0, endX]);
  const exitY = interpolate(exit, [0, 1], [0, endY]);

  return { translationX: exitX + enterX, translationY: enterY + exitY };
};

const getSubtitleExit = ({
  exit,
  width,
  height,
  webcamPosition,
  canvasLayout,
  nextWebcamPosition,
}: {
  exit: number;
  width: number;
  height: number;
  webcamPosition: WebcamPosition;
  canvasLayout: CanvasLayout;
  nextWebcamPosition: WebcamPosition | null;
}) => {
  if (nextWebcamPosition === null) {
    return {
      translationX: interpolate(exit, [0, 1], [0, -width]),
      translationY: 0,
    };
  }

  const isSamePositionVertical =
    isWebCamRight(nextWebcamPosition) === isWebCamRight(webcamPosition);
  const isSamePositionHorizontal =
    isWebCamAtBottom(nextWebcamPosition) === isWebCamAtBottom(webcamPosition);

  if (!isSamePositionHorizontal && canvasLayout === "square") {
    return {
      translationX: 0,
      translationY: interpolate(
        exit,
        [0, 1],
        [0, isWebCamAtBottom(webcamPosition) ? height : -height]
      ),
    };
  }

  if (!isSamePositionVertical && canvasLayout === "square") {
    return {
      translationX: interpolate(
        exit,
        [0, 1],
        [0, isWebCamRight(webcamPosition) ? -width : width]
      ),
      translationY: 0,
    };
  }

  return { translationX: 0, translationY: 0 };
};

const getSubtitleEnter = ({
  enter,
  width,
  height,
  webcamPosition,
  canvasLayout,
  prevWebcamPosition,
}: {
  enter: number;
  width: number;
  height: number;
  webcamPosition: WebcamPosition;
  canvasLayout: CanvasLayout;
  prevWebcamPosition: WebcamPosition | null;
}) => {
  if (prevWebcamPosition === null) {
    if (canvasLayout === "wide") {
      return {
        translationX: 0,
        translationY: interpolate(enter, [0, 1], [height, 0]),
      };
    }

    if (canvasLayout === "square") {
      return {
        translationX: interpolate(enter, [0, 1], [width, 0]),
        translationY: 0,
      };
    }

    if (canvasLayout === "tall") {
      return {
        translationX: 0,
        translationY: 0,
      };
    }

    throw new Error("Invalid canvas layout");
  }

  const isSamePositionVertical =
    isWebCamRight(prevWebcamPosition) === isWebCamRight(webcamPosition);
  const isSamePositionHorizontal =
    isWebCamAtBottom(prevWebcamPosition) === isWebCamAtBottom(webcamPosition);

  if (!isSamePositionHorizontal && canvasLayout === "square") {
    return {
      translationX: 0,
      translationY: interpolate(
        enter,
        [0, 1],
        [isWebCamAtBottom(webcamPosition) ? height : -height, 0]
      ),
    };
  }

  if (!isSamePositionVertical && canvasLayout === "square") {
    return {
      translationX: interpolate(
        enter,
        [0, 1],
        [isWebCamRight(webcamPosition) ? -width : width, 0]
      ),
      translationY: 0,
    };
  }

  return { translationX: 0, translationY: 0 };
};

export const getSubtitleTranslation = ({
  enter,
  exit,
  width,
  height,
  webcamPosition,
  canvasLayout,
  nextWebcamPosition,
  prevWebcamPosition,
}: {
  enter: number;
  exit: number;
  width: number;
  height: number;
  webcamPosition: WebcamPosition;
  canvasLayout: CanvasLayout;
  prevWebcamPosition: WebcamPosition | null;
  nextWebcamPosition: WebcamPosition | null;
}) => {
  const _enter = getSubtitleEnter({
    canvasLayout,
    enter,
    height,
    prevWebcamPosition,
    webcamPosition,
    width,
  });
  const _exit = getSubtitleExit({
    canvasLayout,
    exit,
    height,
    nextWebcamPosition,
    webcamPosition,
    width,
  });

  return {
    translationX: _enter.translationX + _exit.translationX,
    translationY: _enter.translationY + _exit.translationY,
  };
};
