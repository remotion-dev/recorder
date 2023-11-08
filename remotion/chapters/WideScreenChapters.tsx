import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ChapterSceneComponent } from "./ChapterScene";
import type { ChapterType } from "./make-chapters";
import { makeChapterScences } from "./narrow-down";

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
      {chapterScenes.map((chapterScene, i) => {
        const previousScene = chapterScenes[i - 1] ?? null;
        const nextChapterScene = chapterScenes[i + 1] ?? null;

        return (
          <ChapterSceneComponent
            key={chapterScene.chapterId + chapterScene.webcamIndex}
            scene={chapterScene}
            previousScene={previousScene}
            nextScene={nextChapterScene}
            amountOfChapters={chapters.length}
          />
        );
      })}
    </AbsoluteFill>
  );
};
