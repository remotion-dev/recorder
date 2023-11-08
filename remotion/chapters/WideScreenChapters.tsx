import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { transitionIn, transitionOut } from "../animations/chapter-transition";
import type { ChapterType } from "./make-chapters";
import type { ChapterScene } from "./narrow-down";
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
      {chapterScenes.map((chapterScene, i) => {
        const nextChapterScene: ChapterScene | null =
          chapterScenes[i + 1] ?? null;
        const previousScene: ChapterScene | null = chapterScenes[i - 1] ?? null;

        const outTransition = transitionOut({
          currentWebcamPosition:
            chapterScene.webcamInformation.scene.finalWebcamPosition,
          nextScene: nextChapterScene
            ? nextChapterScene.webcamInformation.scene
            : null,
          transitionToNextScene:
            chapterScene.webcamInformation.scene.scene.transitionToNextScene,
        });

        const inTransition = transitionIn({
          currentScene: chapterScene.webcamInformation.scene,
          previousWebcamPosition: previousScene
            ? previousScene.webcamInformation.scene.finalWebcamPosition
            : null,
          previousTransitionToNextScene: previousScene
            ? previousScene.webcamInformation.scene.scene.transitionToNextScene
            : false,
        });

        const isSameWebcamPositionAsBefore =
          previousScene?.webcamInformation?.scene.finalWebcamPosition ===
          chapterScene.webcamInformation.scene.finalWebcamPosition;

        const isSameWebcamPositionAsNext =
          nextChapterScene?.webcamInformation?.scene.finalWebcamPosition ===
          chapterScene.webcamInformation.scene.finalWebcamPosition;

        const isDifferentChapterThanPrevious =
          previousScene?.chapterId !== chapterScene.chapterId;

        const shouldSlideY =
          chapterScene.chapterIndex > 1 &&
          chapterScene.chapterIndex < chapters.length - 1 &&
          isDifferentChapterThanPrevious &&
          inTransition === "none" &&
          isSameWebcamPositionAsBefore;

        const shouldSlideHighlight =
          isDifferentChapterThanPrevious &&
          inTransition === "none" &&
          isSameWebcamPositionAsBefore;

        return (
          <Sequence
            key={chapterScene.chapterId + chapterScene.webcamIndex}
            from={chapterScene.start}
            durationInFrames={chapterScene.end - chapterScene.start}
          >
            <SelectedChapters
              inTransition={inTransition}
              outTransition={outTransition}
              shownChapters={chapterScene.shownChapters}
              activeIndex={chapterScene.chapterIndex}
              shouldFadeFirstOut={
                chapterScene.chapterIndex > 0 &&
                chapterScene.chapterIndex < chapters.length - 2 &&
                outTransition === "none" &&
                isSameWebcamPositionAsNext
              }
              chapterScene={chapterScene}
              shouldSlideY={shouldSlideY}
              shouldSlideHighlight={shouldSlideHighlight}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
