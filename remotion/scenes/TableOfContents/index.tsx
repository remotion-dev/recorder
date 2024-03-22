import { loadFont } from "@remotion/google-fonts/RobotoCondensed";
import React from "react";
import { AbsoluteFill } from "remotion";
import type { Theme } from "../../../config/scenes";
import type { ChapterType } from "../../chapters/make-chapters";
import { COLORS } from "../../colors";
import { TableOfContentItem } from "./item";

loadFont();

export const TableOfContents: React.FC<{
  chapters: ChapterType[];
  theme: Theme;
}> = ({ chapters, theme }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS[theme].BACKGROUND,

        justifyContent: "center",
        paddingLeft: 80,
        paddingRight: 80,
        color: COLORS[theme].ENDCARD_TEXT_COLOR,
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
