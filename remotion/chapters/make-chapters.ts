import { getIsTransitioningIn } from "../animations/transitions";
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
    const sceneAndMetadata = scenes[i];

    if (
      sceneAndMetadata.type === "video-scene" &&
      sceneAndMetadata.scene.newChapter
    ) {
      let start = passedDuration;

      const end = start + sceneAndMetadata.sumUpDuration;
      if (
        getIsTransitioningIn(
          scenes.map((s) => s.scene),
          i,
        )
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
      const lastChapter = chapters[chapters.length - 1];
      if (sceneAndMetadata.type === "video-scene") {
        if (
          sceneAndMetadata.scene.webcamPosition ===
          lastChapter.webcamPositions[lastChapter.webcamPositions.length - 1]
            .webcamPosition
        ) {
          lastChapter.webcamPositions[
            lastChapter.webcamPositions.length - 1
          ].transitionToNextScene =
            sceneAndMetadata.scene.transitionToNextScene;
          lastChapter.webcamPositions[
            lastChapter.webcamPositions.length - 1
          ].end += sceneAndMetadata.sumUpDuration ?? 0;
        } else {
          lastChapter.webcamPositions.push({
            start: lastChapter.end,
            end: lastChapter.end + (sceneAndMetadata.sumUpDuration ?? 0),
            webcamPosition: sceneAndMetadata.scene.webcamPosition,
            layout: sceneAndMetadata.layout,
            transitionToNextScene: sceneAndMetadata.scene.transitionToNextScene,
          });
        }
      }

      lastChapter.end += sceneAndMetadata.sumUpDuration ?? 0;
    }

    if (
      sceneAndMetadata.type === "video-scene" &&
      sceneAndMetadata.scene.stopChapteringAfterThis
    ) {
      break;
    }

    passedDuration += sceneAndMetadata.sumUpDuration;
  }

  return chapters;
};
