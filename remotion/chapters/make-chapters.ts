import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../config/scenes";
import { TRANSITION_DURATION } from "../../config/transitions";
import {
  getShouldTransitionIn,
  getSumUpDuration,
} from "../animations/transitions";

export type SimpleWebcamInformation = {
  scene: VideoSceneAndMetadata;
  start: number;
  end: number;
  previousScene: SceneAndMetadata | null;
  nextScene: SceneAndMetadata | null;
};

export type WebcamInformation = SimpleWebcamInformation & {
  previousScene: SceneAndMetadata | null;
  nextScene: SceneAndMetadata | null;
};

export type ChapterType = {
  title: string;
  start: number;
  end: number;
  id: number;
  index: number;
  webcamPositions: WebcamInformation[];
};

export const makeChapters = ({ scenes }: { scenes: SceneAndMetadata[] }) => {
  let passedDuration = 0;
  const chapters: ChapterType[] = [];

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i] as SceneAndMetadata;
    const previousScene = scenes[i - 1] ?? null;

    const isTransitioningIn = getShouldTransitionIn({
      scene,
      previousScene,
    });
    const sumUpDuration = getSumUpDuration({
      scene,
      previousScene,
    });

    if (scene.type === "video-scene" && scene.scene.newChapter) {
      let start = passedDuration;

      const end = start + sumUpDuration;
      if (isTransitioningIn) {
        start -= TRANSITION_DURATION;
      }

      const chapter: ChapterType = {
        title: scene.scene.newChapter,
        start,
        end,
        id: passedDuration,
        index: chapters.length,
        webcamPositions: [
          {
            start,
            end,
            scene,
            nextScene: scenes[i + 1] ?? null,
            previousScene: scenes[i - 1] ?? null,
          },
        ],
      };

      chapters.push(chapter);
    } else if (chapters.length > 0) {
      const lastChapter = chapters[chapters.length - 1] as ChapterType;
      if (scene.type === "video-scene") {
        lastChapter.webcamPositions.push({
          start: isTransitioningIn
            ? lastChapter.end - TRANSITION_DURATION
            : lastChapter.end,
          end: lastChapter.end + sumUpDuration,
          scene,
          nextScene: scenes[i + 1] ?? null,
          previousScene: scenes[i - 1] ?? null,
        });
      }

      lastChapter.end += sumUpDuration;
    }

    if (scene.type === "video-scene" && scene.scene.stopChapteringAfterThis) {
      break;
    }

    passedDuration += sumUpDuration;
  }

  return chapters;
};
