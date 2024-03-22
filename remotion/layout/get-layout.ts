import type { CanvasLayout, Dimensions } from "../../config/layout";
import type { SceneVideos, WebcamPosition } from "../../config/scenes";
import {
  isWebCamAtBottom,
  isWebCamRight,
} from "../animations/webcam-transitions";
import { getSubtitlesType } from "../Subs/Segment";
import { getSubsLayout } from "../Subs/subs-layout";
import { getDimensionsForLayout } from "./dimensions";
import { getDisplayLayout } from "./get-display-layout";
import { getDisplaySize } from "./get-display-size";
import { getBottomSafeSpace } from "./get-safe-space";
import { getWebcamSize } from "./get-webcam-size";
import type { Layout } from "./layout-types";
import { safeSpace } from "./safe-space";

export const borderRadius = 20;

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
      left: safeSpace(canvasLayout),
      top: isTopAligned
        ? safeSpace(canvasLayout)
        : canvasSize.height - height - safeSpace(canvasLayout),
      width: actualWidth,
      height,
      borderRadius,
      opacity: 1,
    };
  }

  return {
    left: 0,
    top: 0,
    width: canvasSize.width,
    height: canvasSize.height,
    borderRadius: 0,
    opacity: 1,
  };
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
      left: canvasSize.width - webcamSize.width - safeSpace(canvasLayout),
      top:
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
      left: safeSpace(canvasLayout),
      top:
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
      left: safeSpace(canvasLayout),
      top: safeSpace(canvasLayout),
      borderRadius,
      opacity: 1,
    };
  }

  if (webcamPosition === "top-right") {
    return {
      ...webcamSize,
      left: canvasSize.width - webcamSize.width - safeSpace(canvasLayout),
      top: safeSpace(canvasLayout),
      borderRadius,
      opacity: 1,
    };
  }

  return {
    height: webcamSize.height,
    width: webcamSize.width,
    left: 0,
    top: 0,
    borderRadius,
    opacity: 1,
  };
};

const getFullScreenWebcamSize = ({
  webcamVideoResolution,
  canvasSize,
  canvasLayout,
}: {
  webcamVideoResolution: Dimensions;
  canvasSize: Dimensions;
  canvasLayout: CanvasLayout;
}) => {
  const aspectRatio =
    webcamVideoResolution.width / webcamVideoResolution.height;

  const actualWidth = canvasSize.width - safeSpace(canvasLayout) * 2;

  const actualHeight = actualWidth / aspectRatio;

  return {
    height: actualHeight,
    width: actualWidth,
  };
};

export type CameraSceneLayout = {
  webcamLayout: Layout;
  displayLayout: Layout | null;
  subLayout: Layout;
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
  if (!videos.display) {
    const webcamLayout = fullscreenLayout({
      canvasSize,
      canvasLayout,
      webcamSize: getFullScreenWebcamSize({
        canvasSize,
        canvasLayout,
        webcamVideoResolution: videos.webcam,
      }),
      webcamPosition,
    });
    const subtitleType = getSubtitlesType({
      canvasLayout,
      displayLayout: null,
    });

    return {
      displayLayout: null,
      webcamLayout,
      subLayout: getSubsLayout({
        canvasLayout,
        canvasSize,
        displayLayout: null,
        subtitleType,
        webcamLayout,
        webcamPosition,
      }),
    };
  }

  const displaySize = getDisplaySize({
    canvasLayout,
    canvasSize,
    videoHeight: videos.display.height,
    videoWidth: videos.display.width,
  });

  const webcamSize: Dimensions = getWebcamSize({
    canvasSize,
    canvasLayout,
    displaySize,
  });

  if (canvasLayout === "square") {
    const displayLayout = getDisplayLayout({
      canvasSize,
      canvasLayout,
      webcamPosition,
      displaySize,
    });

    const webcamLayout = makeWebcamLayoutBasedOnWebcamPosition({
      webcamPosition,
      canvasSize,
      canvasLayout,
      webcamSize,
    });

    return {
      displayLayout,
      webcamLayout,
      subLayout: getSubsLayout({
        canvasLayout,
        canvasSize,
        displayLayout,
        subtitleType: getSubtitlesType({ canvasLayout, displayLayout }),
        webcamLayout,
        webcamPosition,
      }),
    };
  }

  if (canvasLayout === "landscape") {
    const totalWidth =
      displaySize.width + webcamSize.width + safeSpace(canvasLayout);

    const totalHeight = Math.max(displaySize.height, webcamSize.height);

    const left = (canvasSize.width - totalWidth) / 2;
    const top =
      (canvasSize.height - totalHeight) / 2 -
      (getBottomSafeSpace(canvasLayout) - safeSpace(canvasLayout)) / 2;

    const displayLayout: Layout = {
      borderRadius,
      height: displaySize.height,
      width: displaySize.width,
      opacity: 1,
      left: isWebCamRight(webcamPosition)
        ? left
        : left + safeSpace("landscape") + webcamSize.width,
      top,
    };

    const webcamLayout: Layout = {
      borderRadius,
      height: webcamSize.height,
      width: webcamSize.width,
      opacity: 1,
      left: isWebCamRight(webcamPosition)
        ? left + displaySize.width + safeSpace("landscape")
        : left,
      top: isWebCamAtBottom(webcamPosition)
        ? top + displaySize.height - webcamSize.height
        : top,
    };

    return {
      displayLayout,
      webcamLayout,
      subLayout: getSubsLayout({
        canvasLayout,
        canvasSize,
        displayLayout,
        subtitleType: getSubtitlesType({ canvasLayout, displayLayout }),
        webcamLayout,
        webcamPosition,
      }),
    };
  }

  throw new Error("Unknown canvas layout: " + canvasLayout);
};
