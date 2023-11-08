import {
  getIsTransitioningIn,
  getSumUpDuration,
} from "../animations/transitions";
import type { SceneAndMetadata, VideoSceneAndMetadata } from "../configuration";
import { transitionDuration } from "../configuration";

export type WebcamInformation = {
  scene: VideoSceneAndMetadata;
  start: number;
  end: number;
};

export type ChapterType = {
  title: string;
  start: number;
  end: number;
  id: number;
  index: number;
  webcamPositions: WebcamInformation[];
};

export const generateChapters = ({
  scenes,
}: {
  scenes: SceneAndMetadata[];
}) => {
  let passedDuration = 0;
  const chapters: ChapterType[] = [];

  for (let i = 0; i < scenes.length; i++) {
    const sceneAndMetadata = scenes[i] as SceneAndMetadata;
    const previousScene = scenes[i - 1] ?? null;

    const isTransitioningIn = getIsTransitioningIn({
      scene: sceneAndMetadata,
      previousScene,
    });
    const sumUpDuration = getSumUpDuration({
      scene: sceneAndMetadata,
      previousScene,
    });

    if (
      sceneAndMetadata.type === "video-scene" &&
      sceneAndMetadata.scene.newChapter
    ) {
      let start = passedDuration;

      const end = start + sumUpDuration;
      if (isTransitioningIn) {
        start -= transitionDuration;
      }

      const chapter: ChapterType = {
        title: sceneAndMetadata.scene.newChapter,
        start,
        end,
        id: passedDuration,
        index: chapters.length,
        webcamPositions: [
          {
            start,
            end,
            scene: sceneAndMetadata,
          },
        ],
      };

      chapters.push(chapter);
    } else if (chapters.length > 0) {
      const lastChapter = chapters[chapters.length - 1] as ChapterType;
      if (sceneAndMetadata.type === "video-scene") {
        const lastWebcamPosition = lastChapter.webcamPositions[
          lastChapter.webcamPositions.length - 1
        ] as WebcamInformation;
        if (
          sceneAndMetadata.finalWebcamPosition ===
          lastWebcamPosition.scene.finalWebcamPosition
        ) {
          lastWebcamPosition.scene.scene.transitionToNextScene =
            sceneAndMetadata.scene.transitionToNextScene;
          lastWebcamPosition.end += sumUpDuration;
        } else {
          lastChapter.webcamPositions.push({
            start: isTransitioningIn
              ? lastChapter.end - transitionDuration
              : lastChapter.end,
            end: lastChapter.end + sumUpDuration,
            scene: sceneAndMetadata,
          });
        }
      }

      lastChapter.end += sumUpDuration;
    }

    if (
      sceneAndMetadata.type === "video-scene" &&
      sceneAndMetadata.scene.stopChapteringAfterThis
    ) {
      break;
    }

    passedDuration += sumUpDuration;
  }

  return chapters;
};
