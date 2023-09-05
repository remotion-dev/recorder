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
    durationInFrames: 20,
  });

  const translateX = interpolate(jumpIn, [0, 1], [-width, 0]);

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
        {chapters.map((chapter) => {
          return (
            <Chapter key={chapter.id} startFrom={startFrom} chapter={chapter} />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
