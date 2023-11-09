import { loadFont } from "@remotion/google-fonts/RobotoCondensed";
import React from "react";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";
import type { ChapterType } from "../../chapters/make-chapters";
import { COLORS } from "../../colors";
import { TableOfContentItem } from "./item";

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
        justifyContent: "center",
        paddingLeft: 80,
        paddingRight: 80,
      }}
    >
      {chapters.map((chapter) => {
        return (
          <TableOfContentItem
            key={chapter.id}
            startTime={chapter.start}
            title={chapter.title}
          />
        );
      })}
    </AbsoluteFill>
  );
};
