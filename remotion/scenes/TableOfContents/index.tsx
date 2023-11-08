import { loadFont } from "@remotion/google-fonts/RobotoCondensed";
import React from "react";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";
import type { ChapterType } from "../../chapters/make-chapters";
import { COLORS } from "../../colors";

loadFont();

export const TableOfContents: React.FC<{
  chapters: ChapterType[];
  enter: number;
  exit: number;
}> = ({ chapters, enter, exit }) => {
  const { width } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.BACKGROUND,
        transform: `translateX(${interpolate(
          enter + exit,
          [0, 1],
          [width, 0],
        )}px)`,
      }}
    >
      {chapters.map((chapter) => {
        return <div key={chapter.id}>{chapter.title}</div>;
      })}
    </AbsoluteFill>
  );
};
