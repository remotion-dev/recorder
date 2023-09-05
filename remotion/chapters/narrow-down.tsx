import type { ChapterType } from "./generate";

const maxOtherChapters = 4;

export const narrowDownChapters = (
  chapters: ChapterType[],
  activeChapterIndex: number
): ChapterType[] => {
  const chaptersBefore = chapters
    .filter((_, i) => {
      return i < activeChapterIndex;
    })
    .slice(-2);

  const availableToTake = maxOtherChapters - chaptersBefore.length;

  const chaptersAfter = chapters
    .filter((_, i) => {
      return i > activeChapterIndex;
    })
    .slice(0, availableToTake);

  const activeChapter = chapters[activeChapterIndex];

  return [...chaptersBefore, activeChapter, ...chaptersAfter];
};
