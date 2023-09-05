import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { CanvasLayout } from "../configuration";
import { WideLayoutChapter } from "./Chapter";
import type { ChapterType } from "./generate";
import { narrowDownChapters } from "./narrow-down";

export const WideScreenChapters: React.FC<{
  chapters: ChapterType[];
  startFrom: number;
  canvasLayout: CanvasLayout;
}> = ({ chapters, startFrom, canvasLayout }) => {
  const frame = useCurrentFrame();
  const absoluteFrame = frame + startFrom;
  const { fps, width, durationInFrames } = useVideoConfig();

  const activeChapter =
    chapters.find((chapter) => {
      return chapter.start <= absoluteFrame && absoluteFrame < chapter.end;
    })?.index ?? -1;

  const shouldJumpIn = activeChapter === 0;
  const shouldJumpOut = activeChapter === chapters.length - 1;

  const jumpIn = shouldJumpIn
    ? spring({
        fps,
        frame,
        config: {
          damping: 200,
        },
        durationInFrames: 10,
      })
    : 1;

  const jumpOut = shouldJumpOut
    ? spring({
        fps,
        frame,
        config: {
          damping: 200,
        },
        durationInFrames: 10,
        delay: 60,
      })
    : 0;

  const translateX = interpolate(jumpIn - jumpOut, [0, 1], [-width, 0]);
  const shownChapters = narrowDownChapters(chapters, activeChapter);

  if (activeChapter === -1) {
    return null;
  }

  const shouldAnimateIn =
    activeChapter > 0 && chapters[activeChapter].start === startFrom;
  const shouldAnimateOut =
    startFrom + durationInFrames === chapters[activeChapter].end;

  console.log({ shouldAnimateOut });

  return (
    <AbsoluteFill
      style={{
        alignItems: "flex-start",
        padding: 25,
        transform: `translateX(${translateX}px)`,
      }}
    >
      <div
        style={{
          filter:
            canvasLayout === "wide"
              ? undefined
              : "drop-shadow(0 0 200px rgba(0, 0, 0, 0.4))",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {shownChapters.map((chapter) => {
          return (
            <WideLayoutChapter
              key={chapter.id}
              activeIndex={activeChapter}
              chapter={chapter}
              firstIndex={shownChapters[0].index}
              lastIndex={shownChapters[shownChapters.length - 1].index}
              shouldAnimateIn={shouldAnimateIn}
              shouldAnimateOut={shouldAnimateOut}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
