import type { CanvasLayout, Dimensions } from "../../config/layout";
import { getSafeSpace } from "../../config/layout";
import type { FinalWebcamPosition, SceneVideos } from "../../config/scenes";
import {
  isWebCamAtBottom,
  isWebCamRight,
} from "../animations/webcam-transitions";
import type { SubtitleType } from "../captions/Segment";
import {
  getSubtitlesFontSize,
  getSubtitlesLines,
  getSubtitlesType,
} from "../captions/Segment";
import { getSubsLayout } from "../captions/subs-layout";
import { getDimensionsForLayout } from "./dimensions";
import { getDisplayLayout } from "./get-display-layout";
import { getDisplaySize } from "./get-display-size";
import { getBottomSafeSpace } from "./get-safe-space";
import { getWebcamSize } from "./get-webcam-size";
import type { Layout } from "./layout-types";

export const borderRadius = 20;

const squareFullscreenWebcamLayout = ({
  canvasSize,
  webcamSize,
  webcamPosition,
}: {
  canvasSize: Dimensions;
  webcamSize: Dimensions;
  webcamPosition: FinalWebcamPosition;
}) => {
  const aspectRatio = webcamSize.width / webcamSize.height;

  const actualWidth = canvasSize.width - getSafeSpace("square") * 2;

  const height = actualWidth / aspectRatio;
  const isTopAligned = !isWebCamAtBottom(webcamPosition);

  // TODO: Will look weird with vertical video
  return {
    left: getSafeSpace("square"),
    top: isTopAligned
      ? getSafeSpace("square")
      : canvasSize.height - height - getSafeSpace("square"),
    width: actualWidth,
    height,
    borderRadius,
    opacity: 1,
  };
};

const widescreenFullscreenLayout = ({
  canvasSize,
}: {
  canvasSize: Dimensions;
}): Layout => {
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
  webcamPosition: FinalWebcamPosition;
  canvasLayout: CanvasLayout;
  canvasSize: Dimensions;
}): Layout => {
  if (webcamPosition === "bottom-right") {
    return {
      ...webcamSize,
      left: canvasSize.width - webcamSize.width - getSafeSpace(canvasLayout),
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
      left: getSafeSpace(canvasLayout),
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
      left: getSafeSpace(canvasLayout),
      top: getSafeSpace(canvasLayout),
      borderRadius,
      opacity: 1,
    };
  }

  if (webcamPosition === "top-right") {
    return {
      ...webcamSize,
      left: canvasSize.width - webcamSize.width - getSafeSpace(canvasLayout),
      top: getSafeSpace(canvasLayout),
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

  const actualWidth = canvasSize.width - getSafeSpace(canvasLayout) * 2;

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
  subtitleType: SubtitleType;
  subtitleFontSize: number;
  subtitleLines: number;
};

export const getLayout = ({
  canvasLayout,
  videos,
  webcamPosition,
}: {
  videos: SceneVideos;
  canvasLayout: CanvasLayout;
  webcamPosition: FinalWebcamPosition;
}): CameraSceneLayout => {
  const canvasSize = getDimensionsForLayout(canvasLayout);

  if (!videos.display) {
    const webcamLayout =
      canvasLayout === "square"
        ? squareFullscreenWebcamLayout({
            canvasSize,
            webcamPosition,
            webcamSize: getFullScreenWebcamSize({
              canvasSize,
              canvasLayout,
              webcamVideoResolution: videos.webcam,
            }),
          })
        : widescreenFullscreenLayout({
            canvasSize,
          });

    const subtitleType = getSubtitlesType({
      canvasLayout,
      displayLayout: null,
    });

    const subtitleFontSize = getSubtitlesFontSize(subtitleType, null);

    const subLayout = getSubsLayout({
      canvasLayout,
      canvasSize,
      displayLayout: null,
      subtitleType,
      webcamLayout,
      webcamPosition,
      fontSize: subtitleFontSize,
    });

    const subtitleLines = getSubtitlesLines({
      boxHeight: subLayout.height,
      fontSize: subtitleFontSize,
      subtitleType,
    });

    return {
      displayLayout: null,
      webcamLayout,
      subLayout,
      subtitleType,
      subtitleFontSize,
      subtitleLines,
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

    const subtitleType = getSubtitlesType({
      canvasLayout,
      displayLayout,
    });

    const subtitleFontSize = getSubtitlesFontSize(subtitleType, displayLayout);
    const subtitleLines = getSubtitlesLines({
      boxHeight: displayLayout.height,
      fontSize: subtitleFontSize,
      subtitleType,
    });

    return {
      displayLayout,
      webcamLayout,
      subLayout: getSubsLayout({
        canvasLayout,
        canvasSize,
        displayLayout,
        subtitleType,
        webcamLayout,
        webcamPosition,
        fontSize: subtitleFontSize,
      }),
      subtitleType,
      subtitleFontSize,
      subtitleLines,
    };
  }

  if (canvasLayout === "landscape") {
    const totalWidth =
      displaySize.width + webcamSize.width + getSafeSpace(canvasLayout);

    const totalHeight = Math.max(displaySize.height, webcamSize.height);

    const left = (canvasSize.width - totalWidth) / 2;
    const top =
      (canvasSize.height - totalHeight) / 2 -
      (getBottomSafeSpace(canvasLayout) - getSafeSpace(canvasLayout)) / 2;

    const displayLayout: Layout = {
      borderRadius,
      height: displaySize.height,
      width: displaySize.width,
      opacity: 1,
      left: isWebCamRight(webcamPosition)
        ? left
        : left + getSafeSpace("landscape") + webcamSize.width,
      top,
    };

    const webcamLayout: Layout = {
      borderRadius,
      height: webcamSize.height,
      width: webcamSize.width,
      opacity: 1,
      left: isWebCamRight(webcamPosition)
        ? left + displaySize.width + getSafeSpace("landscape")
        : left,
      top: isWebCamAtBottom(webcamPosition)
        ? top + displaySize.height - webcamSize.height
        : top,
    };

    const subtitleType = getSubtitlesType({
      canvasLayout,
      displayLayout,
    });

    const subtitleFontSize = getSubtitlesFontSize(subtitleType, displayLayout);

    const subtitleLines = getSubtitlesLines({
      boxHeight: displayLayout.height,
      fontSize: subtitleFontSize,
      subtitleType,
    });

    return {
      displayLayout,
      webcamLayout,
      subLayout: getSubsLayout({
        canvasLayout,
        canvasSize,
        displayLayout,
        subtitleType,
        webcamLayout,
        webcamPosition,
        fontSize: subtitleFontSize,
      }),
      subtitleType,
      subtitleFontSize,
      subtitleLines,
    };
  }

  throw new Error("Unknown canvas layout: " + canvasLayout);
};
