import { getIsTransitioningIn } from "../animations/transitions";
import type {
  SceneMetadata,
  SceneType,
  WebcamPosition,
} from "../configuration";
import { transitionDuration } from "../configuration";

export type ChapterType = {
  title: string;
  start: number;
  end: number;
  id: number;
  index: number;
  webcamPosition: WebcamPosition;
};

export const generateChapters = (
  scenes: SceneType[],
  metadatas: (SceneMetadata | null)[]
) => {
  let passedDuration = 0;
  const chapters: ChapterType[] = [];

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const metadata = metadatas[i];

    if (scene.type === "scene" && scene.newChapter) {
      if (!metadata) {
        throw new Error("expected metadata to be defined");
      }

      let start = passedDuration;
      if (getIsTransitioningIn(scenes, i)) {
        start -= transitionDuration;
      }

      const chapter: ChapterType = {
        title: scene.newChapter,
        start,
        end: passedDuration + metadata.sumUpDuration,
        id: passedDuration,
        index: chapters.length,
        webcamPosition: scene.webcamPosition,
      };

      chapters.push(chapter);
    } else if (chapters.length > 0) {
      chapters[chapters.length - 1].end += metadata?.sumUpDuration ?? 0;
    }

    if (scene.type === "scene" && scene.stopChapteringAfterThis) {
      break;
    }

    if (metadata) {
      passedDuration += metadata.sumUpDuration;
    }
  }

  return chapters;
};
