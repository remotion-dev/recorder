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
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {chapterScenes.map((chapterScene, i) => {
        const previousChapterScene = chapterScenes[i - 1] ?? null;

        return (
          <ChapterSceneComponent
            key={chapterScene.chapterId + chapterScene.webcamIndex}
            chapterScene={chapterScene}
            previousChapterScene={previousChapterScene}
            amountOfChapters={chapters.length}
          />
        );
      })}
    </AbsoluteFill>
  );
};
