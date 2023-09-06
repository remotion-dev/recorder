import { getIsTransitioningIn } from "../animations/transitions";
import type { SceneMetadata, SceneType } from "../configuration";
import { transitionDuration } from "../configuration";

export type ChapterType = {
  title: string;
  start: number;
  end: number;
  id: number;
  index: number;
  shouldSlideFromPrevious: boolean;
  shouldAnimateEnter: boolean;
  shouldAnimateExit: boolean;
};

export const generateChapters = (
  scenes: SceneType[],
  metadatas: (SceneMetadata | null)[]
) => {
  let passedDuration = 0;
  const chapters: ChapterType[] = [];

  let currentTitle: null | string = null;

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const metadata = metadatas[i];

    if (scene.type === "scene" && scene.newChapter) {
      currentTitle = scene.newChapter;
    }

    if (scene.type === "scene") {
      if (!metadata) {
        throw new Error("expected metadata to be defined");
      }

      let start = passedDuration;
      if (getIsTransitioningIn(scenes, i)) {
        start -= transitionDuration;
      }

      if (currentTitle) {
        chapters.push({
          title: currentTitle,
          start,
          end: passedDuration + metadata.sumUpDuration,
          id: passedDuration,
          index: chapters.length,
          shouldSlideFromPrevious: chapters.length > 0,
          shouldAnimateEnter: chapters.length === 0,
          shouldAnimateExit: false,
        });
      }
    }

    if (scene.type === "scene" && scene.stopChapteringAfterThis) {
      break;
    }

    if (metadata) {
      passedDuration += metadata.sumUpDuration;
    }
  }

  if (chapters.length > 0) {
    chapters[chapters.length - 1].shouldAnimateExit = true;
  }

  return chapters;
};
