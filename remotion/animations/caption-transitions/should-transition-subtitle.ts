import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";

// An inline subtitle transition:
// - The subtitle stays at the same position and is the same subtitle type

// Animation may be ensure they don't overlap or to resize the box
export const shouldInlineTransitionSubtitles = ({
  currentScene,
  nextScene,
}: {
  currentScene: VideoSceneAndMetadata;
  nextScene: SceneAndMetadata | null;
}) => {
  const currentSubtitleType = currentScene.layout.subtitleType;
  if (nextScene === null) {
    return false;
  }

  if (nextScene.type !== "video-scene") {
    return false;
  }

  const nextSubtitleType = nextScene.layout.subtitleType;

  if (currentSubtitleType === "square" && nextSubtitleType === "square") {
    // In square layout, we resize the box if the aspect ratio of the videos has changed.
    // While resizing the box, the subtitles fade out.

    const nextSubtitleLayout = nextScene.layout.subtitleLayout;
    const currentSubtitleLayout = currentScene.layout.subtitleLayout;

    const layoutsAreTheSameBox =
      nextSubtitleLayout.width === currentSubtitleLayout.width &&
      nextSubtitleLayout.height === currentSubtitleLayout.height &&
      nextSubtitleLayout.left === currentSubtitleLayout.left &&
      nextSubtitleLayout.top === currentSubtitleLayout.top;

    return (
      nextScene.webcamPosition === currentScene.webcamPosition &&
      Boolean(currentScene.videos.display) ===
        Boolean(nextScene.videos.display) &&
      !layoutsAreTheSameBox
    );
  }

  // Should transition to ensure subtitles don't overlap each other.
  return currentSubtitleType === nextSubtitleType;
};
