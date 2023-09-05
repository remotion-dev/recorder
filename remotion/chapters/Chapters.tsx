import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Chapter } from "./Chapter";
import type { ChapterType } from "./generate";
import { narrowDownChapters } from "./narrow-down";

export const Chapters: React.FC<{
  chapters: ChapterType[];
  startFrom: number;
}> = ({ chapters, startFrom }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const jumpIn = spring({
    fps,
    frame,
    config: {
      damping: 200,
    },
    durationInFrames: 15,
  });

  const jumpOut = spring({
    fps,
    frame,
    config: {
      damping: 200,
    },
    durationInFrames: 15,
    delay: 50,
  });

  const absoluteFrame = frame + startFrom;

  const translateX = interpolate(jumpIn - jumpOut, [0, 1], [-width, 0]);

  const activeChapter =
    chapters.find((chapter) => {
      return chapter.start <= absoluteFrame && chapter.end >= absoluteFrame;
    })?.index ?? -1;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "flex-start",
        padding: 25,
        transform: `translateX(${translateX}px)`,
      }}
    >
      <div
        style={{
          filter: "drop-shadow(0 0 200px rgba(0, 0, 0, 0.4))",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {narrowDownChapters(chapters, activeChapter).map((chapter) => {
          return (
            <Chapter
              key={chapter.id}
              activeIndex={activeChapter}
              startFrom={startFrom}
              chapter={chapter}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
