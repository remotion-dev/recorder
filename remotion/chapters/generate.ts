import { getIsTransitioningIn } from "../animations/transitions";
import type {
  SceneMetadata,
  SceneType,
  WebcamPosition,
} from "../configuration";
import { transitionDuration } from "../configuration";

type WebcamInformtion = {
  webcamPosition: WebcamPosition;
  start: number;
  end: number;
};

export type ChapterType = {
  title: string;
  start: number;
  end: number;
  id: number;
  index: number;
  webcamPositions: WebcamInformtion[];
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

      const end = start + metadata.sumUpDuration;
      const chapter: ChapterType = {
        title: scene.newChapter,
        start,
        end,
        id: passedDuration,
        index: chapters.length,
        webcamPositions: [
          {
            start,
            webcamPosition: scene.webcamPosition,
            end,
          },
        ],
      };

      chapters.push(chapter);
    } else if (chapters.length > 0) {
      const lastChapter = chapters[chapters.length - 1];
      if (scene.type === "scene") {
        if (
          scene.webcamPosition ===
          lastChapter.webcamPositions[lastChapter.webcamPositions.length - 1]
            .webcamPosition
        ) {
          lastChapter.end += metadata?.sumUpDuration ?? 0;
          continue;
        } else {
          lastChapter.webcamPositions.push({
            start: lastChapter.end,
            end: lastChapter.end + (metadata?.sumUpDuration ?? 0),
            webcamPosition: scene.webcamPosition,
          });
        }
      }

      lastChapter.end += metadata?.sumUpDuration ?? 0;
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
