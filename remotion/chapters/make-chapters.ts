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

    if (
      sceneAndMetadata.type === "video-scene" &&
      sceneAndMetadata.scene.newChapter
    ) {
      let start = passedDuration;

      const end =
        start +
        getSumUpDuration({
          scene: sceneAndMetadata,
          previousScene: scenes[i - 1] ?? null,
        });
      if (
        getIsTransitioningIn({
          scene: sceneAndMetadata,
          previousScene: scenes[i - 1] ?? null,
        })
      ) {
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
            webcamPosition: sceneAndMetadata.scene.webcamPosition,
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
        if (
          sceneAndMetadata.scene.webcamPosition ===
          (
            lastChapter.webcamPositions[
              lastChapter.webcamPositions.length - 1
            ] as WebcamInformation
          ).webcamPosition
        ) {
          (
            lastChapter.webcamPositions[
              lastChapter.webcamPositions.length - 1
            ] as WebcamInformation
          ).transitionToNextScene =
            sceneAndMetadata.scene.transitionToNextScene;
          (
            lastChapter.webcamPositions[
              lastChapter.webcamPositions.length - 1
            ] as WebcamInformation
          ).end += getSumUpDuration({
            scene: sceneAndMetadata,
            previousScene: scenes[i - 1] ?? null,
          });
        } else {
          lastChapter.webcamPositions.push({
            start: lastChapter.end,
            end:
              lastChapter.end +
              getSumUpDuration({
                scene: sceneAndMetadata,
                previousScene: scenes[i - 1] ?? null,
              }),
            webcamPosition: sceneAndMetadata.scene.webcamPosition,
            layout: sceneAndMetadata.layout,
            transitionToNextScene: sceneAndMetadata.scene.transitionToNextScene,
          });
        }
      }

      lastChapter.end += getSumUpDuration({
        scene: sceneAndMetadata,
        previousScene: scenes[i - 1] ?? null,
      });
    }

    if (
      sceneAndMetadata.type === "video-scene" &&
      sceneAndMetadata.scene.stopChapteringAfterThis
    ) {
      break;
    }

    passedDuration += getSumUpDuration({
      scene: sceneAndMetadata,
      previousScene: scenes[i - 1] ?? null,
    });
  }

  return chapters;
};
