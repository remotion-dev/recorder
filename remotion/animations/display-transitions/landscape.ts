import { getSafeSpace } from "../../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import type { LayoutAndFade } from "../../layout/layout-types";
import { isWebCamRight } from "../webcam-transitions/helpers";

export const getLandscapeDisplayEnterOrExit = ({
  currentScene,
  otherScene,
  canvasWidth,
}: {
  otherScene: SceneAndMetadata | null;
  currentScene: VideoSceneAndMetadata;
  canvasWidth: number;
}): LayoutAndFade => {
  if (
    currentScene.type !== "video-scene" ||
    currentScene.layout.displayLayout === null
  ) {
    throw new Error("no transitions on non-video scenes");
  }

  if (otherScene === null || otherScene.type !== "video-scene") {
    return {
      layout: currentScene.layout.displayLayout,
      shouldFadeRecording: false,
    };
  }

  if (otherScene.layout.displayLayout === null) {
    // landscape, Slide in from left
    if (isWebCamRight(currentScene.webcamPosition)) {
      return {
        layout: {
          ...currentScene.layout.displayLayout,
          left:
            -currentScene.layout.displayLayout.width -
            getSafeSpace("landscape"),
          top: 0,
        },
        shouldFadeRecording: false,
      };
    }

    // landscape, Slide in from right
    return {
      layout: {
        ...currentScene.layout.displayLayout,
        left: canvasWidth + getSafeSpace("landscape"),
        top: 0,
      },
      shouldFadeRecording: false,
    };
  }

  return {
    layout: otherScene.layout.displayLayout,
    shouldFadeRecording: true,
  };
};
