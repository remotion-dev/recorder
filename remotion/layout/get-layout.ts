import type { CanvasLayout, Dimensions } from "../../config/layout";
import { getSafeSpace } from "../../config/layout";
import type { FinalWebcamPosition, SceneVideos } from "../../config/scenes";
import { isWebCamAtBottom } from "../animations/webcam-transitions/helpers";
import type { SubtitleType } from "../captions/Segment";
import {
  getSubtitlesFontSize,
  getSubtitlesLines,
  getSubtitlesType,
} from "../captions/Segment";
import { getSubsLayout } from "../captions/subs-layout";
import { getDimensionsForLayout } from "./dimensions";
import {
  getLandscapeDisplayAndWebcamLayout,
  getSquareBRollLayout,
  getSquareDisplayLayout,
} from "./get-display-layout";
import { getDisplaySize } from "./get-display-size";
import { getBottomSafeSpace } from "./get-safe-space";
import { getWebcamSize } from "./get-webcam-size";
import type {
  BRollEnterDirection,
  BRollType,
  Layout,
  RecordingsLayout,
} from "./layout-types";

export const borderRadius = 20;

const squareFullscreenWebcamLayout = ({
  canvasSize,
  webcamSize,
  webcamPosition,
}: {
  canvasSize: Dimensions;
  webcamSize: Dimensions;
  webcamPosition: FinalWebcamPosition;
}): {
  webcamLayout: Layout;
  bRollLayout: Layout;
  bRollEnterDirection: BRollEnterDirection;
} => {
  const aspectRatio = webcamSize.width / webcamSize.height;

  const maxWidth = canvasSize.width - getSafeSpace("square") * 2;
  // Video can take up 75% of the height to leave place for the subtitles
  const maxHeight = (canvasSize.height - getSafeSpace("square") * 2) * 0.75;

  const provisionalHeight = maxWidth / aspectRatio;
  const width =
    provisionalHeight > maxHeight ? maxHeight * aspectRatio : maxWidth;
  const height = width / aspectRatio;

  const left = (canvasSize.width - width) / 2;
  const top = isWebCamAtBottom(webcamPosition)
    ? canvasSize.height - height - getSafeSpace("square")
    : getSafeSpace("square");

  const webcamLayout: Layout = {
    left,
    top,
    width,
    height,
    borderRadius,
    opacity: 1,
  };

  const bRollLayout: Layout = {
    left: getSafeSpace("square"),
    top,
    width: canvasSize.width - getSafeSpace("square") * 2,
    height,
    borderRadius,
    opacity: 1,
  };

  return {
    webcamLayout,
    bRollLayout,
    bRollEnterDirection: isWebCamAtBottom(webcamPosition) ? "bottom" : "top",
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

const getSquareBentoBoxWebcamLayout = ({
  webcamSize,
  webcamPosition,
  canvasSize,
}: {
  webcamSize: Dimensions;
  webcamPosition: FinalWebcamPosition;
  canvasSize: Dimensions;
}): Layout => {
  if (webcamPosition === "bottom-right") {
    return {
      ...webcamSize,
      left: canvasSize.width - webcamSize.width - getSafeSpace("square"),
      top: canvasSize.height - webcamSize.height - getBottomSafeSpace("square"),
      borderRadius,
      opacity: 1,
    };
  }

  if (webcamPosition === "bottom-left") {
    return {
      ...webcamSize,
      left: getSafeSpace("square"),
      top: canvasSize.height - webcamSize.height - getBottomSafeSpace("square"),
      borderRadius,
      opacity: 1,
    };
  }

  if (webcamPosition === "top-left") {
    return {
      ...webcamSize,
      left: getSafeSpace("square"),
      top: getSafeSpace("square"),
      borderRadius,
      opacity: 1,
    };
  }

  if (webcamPosition === "top-right") {
    return {
      ...webcamSize,
      left: canvasSize.width - webcamSize.width - getSafeSpace("square"),
      top: getSafeSpace("square"),
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
  bRollLayout: Layout;
  bRollType: BRollType;
  subtitleLayout: Layout;
  subtitleType: SubtitleType;
  subtitleFontSize: number;
  subtitleLines: number;
  bRollEnterDirection: BRollEnterDirection;
};

const getDisplayAndWebcamLayout = ({
  canvasSize,
  webcamPosition,
  canvasLayout,
  videos,
}: {
  canvasSize: Dimensions;
  webcamPosition: FinalWebcamPosition;
  canvasLayout: CanvasLayout;
  videos: SceneVideos;
}): RecordingsLayout => {
  if (!videos.display) {
    if (canvasLayout === "square") {
      const fullscreenWebcamSize = getFullScreenWebcamSize({
        canvasSize,
        canvasLayout,
        webcamVideoResolution: videos.webcam,
      });

      const { webcamLayout, bRollLayout, bRollEnterDirection } =
        squareFullscreenWebcamLayout({
          canvasSize,
          webcamPosition,
          webcamSize: fullscreenWebcamSize,
        });

      return {
        displayLayout: null,
        webcamLayout,
        bRollLayout,
        bRollEnterDirection,
      };
    }

    if (canvasLayout === "landscape") {
      const webcamLayout = widescreenFullscreenLayout({
        canvasSize,
      });

      return {
        displayLayout: null,
        bRollLayout: webcamLayout,
        webcamLayout,
        bRollEnterDirection: "top",
      };
    }

    throw new Error(`Unknown canvas layout: ${canvasLayout}`);
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
    const displayLayout = getSquareDisplayLayout({
      canvasSize,
      webcamPosition,
      displaySize,
    });

    const { bRollLayout, bRollEnterDirection } = getSquareBRollLayout({
      canvasSize,
      displaySize,
      webcamPosition,
    });

    const webcamLayout = getSquareBentoBoxWebcamLayout({
      webcamPosition,
      canvasSize,
      webcamSize,
    });

    return {
      displayLayout,
      webcamLayout,
      bRollLayout,
      bRollEnterDirection,
    };
  }

  if (canvasLayout === "landscape") {
    return getLandscapeDisplayAndWebcamLayout({
      displaySize,
      webcamSize,
      canvasLayout,
      canvasSize,
      webcamPosition,
    });
  }

  throw new Error(`Unknown canvas layout: ${canvasLayout}`);
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

  const { displayLayout, webcamLayout, bRollLayout, bRollEnterDirection } =
    getDisplayAndWebcamLayout({
      canvasSize,
      webcamPosition,
      canvasLayout,
      videos,
    });

  const subtitleType = getSubtitlesType({
    canvasLayout,
    displayLayout,
  });

  const subtitleFontSize = getSubtitlesFontSize(subtitleType, displayLayout);
  const subtitleLayout = getSubsLayout({
    canvasLayout,
    canvasSize,
    displayLayout,
    subtitleType,
    webcamLayout,
    webcamPosition,
    fontSize: subtitleFontSize,
  });

  const subtitleLines = getSubtitlesLines({
    boxHeight: subtitleLayout.height,
    fontSize: subtitleFontSize,
    subtitleType,
  });

  const bRollType =
    canvasLayout === "landscape" && videos.display === null ? "fade" : "scale";

  return {
    displayLayout,
    webcamLayout,
    bRollLayout,
    subtitleLayout,
    subtitleType,
    subtitleFontSize,
    subtitleLines,
    bRollEnterDirection,
    bRollType,
  };
};
