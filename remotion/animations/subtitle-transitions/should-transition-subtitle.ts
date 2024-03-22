import type { CanvasLayout } from "../../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import { getSubtitlesType } from "../../Subs/Segment";

// An inline subtitle transition:
// - The subtitle stays at the same position and is the same subtitle type

// Animation may be ensure they don't overlap or to resize the box
export const shouldInlineTransitionSubtitles = ({
  currentScene,
  nextScene,
  canvasLayout,
}: {
  currentScene: VideoSceneAndMetadata;
  nextScene: SceneAndMetadata | null;
  canvasLayout: CanvasLayout;
}) => {
  const currentSubtitleType = getSubtitlesType({
    canvasLayout,
    displayLayout: currentScene.layout.displayLayout,
  });
  if (nextScene === null) {
    return false;
  }

  if (nextScene.type !== "video-scene") {
    return false;
  }

  const nextSubtitleType = getSubtitlesType({
    canvasLayout,
    displayLayout: nextScene.layout.displayLayout,
  });

  if (currentSubtitleType === "boxed" && nextSubtitleType === "boxed") {
    // In boxed layout, we resize the box if the aspect ratio of the videos has changed.
    // While resizing the box, the subtitles fade out.

    const nextSubLayout = nextScene.layout.subLayout;
    const currentSubLayout = currentScene.layout.subLayout;

    const layoutsAreTheSameBox =
      nextSubLayout.width === currentSubLayout.width &&
      nextSubLayout.height === currentSubLayout.height &&
      nextSubLayout.left === currentSubLayout.left &&
      nextSubLayout.top === currentSubLayout.top;

    return (
      nextScene.finalWebcamPosition === currentScene.finalWebcamPosition &&
      Boolean(currentScene.videos.display) ===
        Boolean(nextScene.videos.display) &&
      !layoutsAreTheSameBox
    );
  }

  // Should transition to ensure subtitles don't overlap each other.
  return currentSubtitleType === nextSubtitleType;
};
