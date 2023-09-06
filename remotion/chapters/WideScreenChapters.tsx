import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import type { ChapterType } from "./make-chapters";
import { makeChapterScences } from "./narrow-down";
import { SelectedChapters } from "./SelectedChapters";

export const WideScreenChapters: React.FC<{
  chapters: ChapterType[];
}> = ({ chapters }) => {
  const frame = useCurrentFrame();

  const activeChapter =
    chapters.find((chapter) => {
      return chapter.start <= frame && frame < chapter.end;
    })?.index ?? -1;

  if (activeChapter === -1) {
    return null;
  }

  const chapterScenes = makeChapterScences(chapters);

  return (
    <AbsoluteFill>
      {chapterScenes.map((chapterScene) => {
        return (
          <Sequence
            key={chapterScene.chapterId}
            from={chapterScene.start}
            durationInFrames={chapterScene.end - chapterScene.start}
          >
            <SelectedChapters
              shouldJumpIn={chapterScene.chapterIndex === 0}
              shownChapters={chapterScene.shownChapters}
              shouldJumpOut={chapterScene.chapterIndex === chapters.length - 1}
              activeIndex={chapterScene.chapterIndex}
              shouldFadeFirstOut={
                chapterScene.chapterIndex > 0 &&
                chapterScene.chapterIndex < chapters.length - 2
              }
              shouldFadeLastIn={
                chapterScene.chapterIndex > 1 &&
                chapterScene.chapterIndex < chapters.length - 1
              }
              slideY={
                chapterScene.chapterIndex > 1 &&
                chapterScene.chapterIndex < chapters.length - 1
              }
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
