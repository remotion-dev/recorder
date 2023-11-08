import React from "react";
import { Sequence } from "remotion";
import { transitionIn, transitionOut } from "../animations/chapter-transition";
import type { ChapterScene } from "./narrow-down";
import { SelectedChapters } from "./SelectedChapters";

export const ChapterSceneComponent: React.FC<{
  chapterScene: ChapterScene;
  previousChapterScene: ChapterScene | null;
  amountOfChapters: number;
}> = ({ chapterScene, amountOfChapters, previousChapterScene }) => {
  const {
    scene: currentScene,
    nextScene,
    previousScene,
  } = chapterScene.webcamInformation;

  const outTransition = transitionOut({
    currentScene,
    nextScene,
  });

  const inTransition = transitionIn({
    currentScene,
    previousScene,
  });

  const isSameWebcamPositionAsBefore =
    previousScene !== null &&
    previousScene.type === "video-scene" &&
    previousScene.finalWebcamPosition === currentScene.finalWebcamPosition;

  const isSameWebcamPositionAsNext =
    nextScene !== null &&
    nextScene.type === "video-scene" &&
    nextScene.finalWebcamPosition === currentScene.finalWebcamPosition;

  const isDifferentChapterThanPrevious =
    previousChapterScene?.chapterId !== chapterScene.chapterId;

  const noTransition =
    previousScene !== null &&
    previousScene.type === "video-scene" &&
    !previousScene.scene.transitionToNextScene;

  const shouldSlideY =
    chapterScene.chapterIndex > 1 &&
    chapterScene.chapterIndex < amountOfChapters - 1 &&
    isDifferentChapterThanPrevious &&
    noTransition &&
    isSameWebcamPositionAsBefore;

  const shouldSlideHighlight =
    isDifferentChapterThanPrevious &&
    noTransition &&
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
          chapterScene.chapterIndex < amountOfChapters - 2 &&
          outTransition === "none" &&
          isSameWebcamPositionAsNext
        }
        chapterScene={chapterScene}
        shouldSlideY={shouldSlideY}
        shouldSlideHighlight={shouldSlideHighlight}
      />
    </Sequence>
  );
};
