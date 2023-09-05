import type { SceneMetadata, SceneType } from "../configuration";

export type ChapterType = {
  title: string;
  start: number;
  end: number;
  id: number;
  index: number;
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

      const chapter: ChapterType = {
        title: scene.newChapter,
        start: passedDuration,
        end: passedDuration + metadata.sumUpDuration,
        id: passedDuration,
        index: chapters.length,
      };

      chapters.push(chapter);
    } else if (chapters.length > 0) {
      chapters[chapters.length - 1].end += metadata?.sumUpDuration ?? 0;
    }

    if (metadata) {
      passedDuration += metadata.sumUpDuration;
    }
  }

  return chapters;
};
