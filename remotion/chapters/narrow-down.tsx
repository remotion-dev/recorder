import { truthy } from "../truthy";
import type { ChapterType, WebcamInformtion } from "./make-chapters";

const maxOtherChapters = 2;

export type ChapterScene = {
  chapterId: number;
  webcamInformation: WebcamInformtion;
  shownChapters: ChapterType[];
  start: number;
  end: number;
  chapterIndex: number;
  webcamIndex: number;
};

const narrowDownChapters = (
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

export const makeChapterScences = (chapters: ChapterType[]): ChapterScene[] => {
  return chapters
    .map((chapter, i) => {
      const shownChapters = narrowDownChapters(chapters, i);

      return chapter.webcamPositions.map((webcamInformation, index) => {
        return {
          chapterId: chapter.id,
          webcamInformation,
          shownChapters,
          start: webcamInformation.start,
          end: webcamInformation.end,
          chapterIndex: chapter.index,
          webcamIndex: index,
        };
      });
    })
    .flat(1);
};
