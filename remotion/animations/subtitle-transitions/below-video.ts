import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../../config/scenes";
import type { Layout } from "../../layout/layout-types";
import { isShrinkingToMiniature } from "../webcam-transitions/helpers";

export const belowVideoSubtitleEnterOrExit = ({
  otherScene,
  scene,
}: {
  otherScene: SceneAndMetadata | null;
  scene: VideoSceneAndMetadata;
}): Layout => {
  if (otherScene === null) {
    return scene.layout.subLayout;
  }

  if (otherScene.type !== "video-scene") {
    return {
      ...scene.layout.subLayout,
      top: scene.layout.subLayout.top + 500,
    };
  }

  if (isShrinkingToMiniature({ firstScene: otherScene, secondScene: scene })) {
    return {
      ...scene.layout.subLayout,
      top: scene.layout.subLayout.top + 500,
    };
  }

  return scene.layout.subLayout;
};
