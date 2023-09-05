import { truthy } from "../truthy";
import type { ChapterType } from "./generate";

const maxOtherChapters = 2;

export const narrowDownChapters = (
  chapters: ChapterType[],
  activeChapterIndex: number
): ChapterType[] => {
  const availableChaptersAfter = chapters.filter((_, i) => {
    return i > activeChapterIndex;
  });

  const chaptersBefore = chapters
    .filter((_, i) => {
      return i < activeChapterIndex;
    })
    .slice(availableChaptersAfter.length === 0 ? -2 : -1);

  const availableToTake = maxOtherChapters - chaptersBefore.length;

  const chaptersAfter = availableChaptersAfter.slice(0, availableToTake);

  const activeChapter = chapters[activeChapterIndex];

  return [...chaptersBefore, activeChapter, ...chaptersAfter].filter(truthy);
};
