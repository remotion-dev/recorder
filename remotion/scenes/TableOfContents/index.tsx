import React from "react";
import { AbsoluteFill } from "remotion";
import {
  REGULAR_FONT_FAMILY,
  REGULAR_FONT_WEIGHT,
} from "../../../config/fonts";
import type { Theme } from "../../../config/themes";
import { COLORS } from "../../../config/themes";
import type { ChapterType } from "../../chapters/make-chapters";
import { TableOfContentItem } from "./item";

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
          fontFamily: REGULAR_FONT_FAMILY,
          fontWeight: REGULAR_FONT_WEIGHT,
          fontSize: 46,
          marginBottom: 30,
        }}
      >
        Table of contents
      </strong>
      {chapters.map((chapter) => {
        return (
          <TableOfContentItem
            key={chapter.index}
            startTime={chapter.start}
            title={chapter.title}
          />
        );
      })}
    </AbsoluteFill>
  );
};
