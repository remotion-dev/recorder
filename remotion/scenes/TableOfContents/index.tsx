import { loadFont } from "@remotion/google-fonts/RobotoCondensed";
import React from "react";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";
import type { ChapterType } from "../../chapters/make-chapters";
import { COLORS } from "../../colors";
import type { Theme } from "../../configuration";
import { TableOfContentItem } from "./item";

loadFont();

export const TableOfContents: React.FC<{
  chapters: ChapterType[];
  enter: number;
  exit: number;
  theme: Theme;
}> = ({ chapters, theme, enter, exit }) => {
  const { width } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS[theme].BACKGROUND,
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
      <strong
        style={{
          fontFamily: "GT Planar",
          fontSize: 46,
          marginBottom: 30,
        }}
      >
        Table of contents
      </strong>
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
