import {
  getIsTransitioningIn,
  getSumUpDuration,
} from "../animations/transitions";
import type { SceneAndMetadata, WebcamPosition } from "../configuration";
import { transitionDuration } from "../configuration";
import type { CameraSceneLayout } from "../layout/get-layout";

export type WebcamInformation = {
  webcamPosition: WebcamPosition;
  start: number;
  end: number;
  layout: CameraSceneLayout;
  transitionToNextScene: boolean;
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
            webcamPosition: sceneAndMetadata.finalWebcamPosition,
            end,
            layout: sceneAndMetadata.layout,
            transitionToNextScene: sceneAndMetadata.scene.transitionToNextScene,
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
          lastWebcamPosition.webcamPosition
        ) {
          lastWebcamPosition.transitionToNextScene =
            sceneAndMetadata.scene.transitionToNextScene;
          lastWebcamPosition.end += sumUpDuration;
        } else {
          lastChapter.webcamPositions.push({
            start: isTransitioningIn
              ? lastChapter.end - transitionDuration
              : lastChapter.end,
            end: lastChapter.end + sumUpDuration,
            webcamPosition: sceneAndMetadata.finalWebcamPosition,
            layout: sceneAndMetadata.layout,
            transitionToNextScene: sceneAndMetadata.scene.transitionToNextScene,
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
