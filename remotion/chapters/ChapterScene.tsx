import React from "react";
import { Sequence } from "remotion";
import { transitionIn, transitionOut } from "../animations/chapter-transition";
import type { ChapterScene } from "./narrow-down";
import { SelectedChapters } from "./SelectedChapters";

export const ChapterSceneComponent: React.FC<{
  scene: ChapterScene;
  amountOfChapters: number;
  nextScene: ChapterScene | null;
  previousScene: ChapterScene | null;
}> = ({ scene, amountOfChapters, nextScene, previousScene }) => {
  const outTransition = transitionOut({
    currentScene: scene.webcamInformation.scene,
    nextScene: nextScene ? nextScene.webcamInformation.scene : null,
  });

  const inTransition = transitionIn({
    currentScene: scene.webcamInformation.scene,
    previousScene: previousScene ? previousScene.webcamInformation.scene : null,
  });

  const isSameWebcamPositionAsBefore =
    previousScene?.webcamInformation?.scene.finalWebcamPosition ===
    scene.webcamInformation.scene.finalWebcamPosition;

  const isSameWebcamPositionAsNext =
    nextScene?.webcamInformation?.scene.finalWebcamPosition ===
    scene.webcamInformation.scene.finalWebcamPosition;

  const isDifferentChapterThanPrevious =
    previousScene?.chapterId !== scene.chapterId;

  const noTransition =
    previousScene !== null &&
    !previousScene.webcamInformation.scene.scene.transitionToNextScene;

  const shouldSlideY =
    scene.chapterIndex > 1 &&
    scene.chapterIndex < amountOfChapters - 1 &&
    isDifferentChapterThanPrevious &&
    noTransition &&
    isSameWebcamPositionAsBefore;

  const shouldSlideHighlight =
    isDifferentChapterThanPrevious &&
    noTransition &&
    isSameWebcamPositionAsBefore;

  return (
    <Sequence
      key={scene.chapterId + scene.webcamIndex}
      from={scene.start}
      durationInFrames={scene.end - scene.start}
    >
      <SelectedChapters
        inTransition={inTransition}
        outTransition={outTransition}
        shownChapters={scene.shownChapters}
        activeIndex={scene.chapterIndex}
        shouldFadeFirstOut={
          scene.chapterIndex > 0 &&
          scene.chapterIndex < amountOfChapters - 2 &&
          outTransition === "none" &&
          isSameWebcamPositionAsNext
        }
        chapterScene={scene}
        shouldSlideY={shouldSlideY}
        shouldSlideHighlight={shouldSlideHighlight}
      />
    </Sequence>
  );
};
