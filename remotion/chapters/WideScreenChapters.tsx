import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import type { ChapterType } from "./generate";
import { narrowDownChapters } from "./narrow-down";
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

  return (
    <AbsoluteFill>
      {chapters.map((chapter) => {
        const shownChapters = narrowDownChapters(chapters, chapter.index);

        return (
          <Sequence
            key={chapter.id}
            from={chapter.start}
            durationInFrames={chapter.end - chapter.start}
          >
            <SelectedChapters
              shouldJumpIn={chapter.index === 0}
              shownChapters={shownChapters}
              shouldJumpOut={chapter.index === chapters.length - 1}
              activeIndex={chapter.index}
              shouldFadeFirstOut={
                chapter.index > 0 && chapter.index < chapters.length - 2
              }
              shouldFadeLastIn={
                chapter.index > 1 && chapter.index < chapters.length - 1
              }
              slideY={chapter.index > 1 && chapter.index < chapters.length - 1}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
