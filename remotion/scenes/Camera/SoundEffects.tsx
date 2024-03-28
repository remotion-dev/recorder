import { Audio, staticFile } from "remotion";
import type { SceneAndMetadata } from "../../../config/scenes";
import {
  isGrowingFromMiniature,
  isShrinkingToMiniature,
} from "../../animations/webcam-transitions";

export const SoundEffects: React.FC<{
  previousScene: SceneAndMetadata | null;
  sceneAndMetadata: SceneAndMetadata;
  shouldEnter: boolean;
}> = ({ previousScene, sceneAndMetadata, shouldEnter }) => {
  if (!shouldEnter) {
    return null;
  }

  if (
    previousScene &&
    isShrinkingToMiniature({
      firstScene: previousScene,
      secondScene: sceneAndMetadata,
    })
  ) {
    return <Audio src={staticFile("sounds/shrink.m4a")} volume={0.2} />;
  }

  if (
    previousScene &&
    isGrowingFromMiniature({
      firstScene: previousScene,
      secondScene: sceneAndMetadata,
    })
  ) {
    return <Audio src={staticFile("sounds/grow.m4a")} volume={0.2} />;
  }

  return <Audio src={staticFile("sounds/whipwhoosh.mp3")} volume={0.1} />;
};
