import React from "react";
import { useCurrentFrame } from "remotion";
import type { ChapterType } from "./generate";

export const Chapter: React.FC<{
  chapter: ChapterType;
  startFrom: number;
}> = ({ chapter, startFrom }) => {
  const frame = useCurrentFrame() + startFrom;
  const isCurrent = frame >= chapter.start && frame <= chapter.end;

  return (
    <div
      style={{
        backgroundColor: isCurrent ? "#0b84f3" : "white",
        padding: "12px 20px",
        fontSize: 40,
        fontFamily: "GT Planar",
        borderRadius: 20,
        border: "5px solid black",
        marginTop: 4,
        marginBottom: 4,
        fontWeight: "500",
        color: isCurrent ? "white" : "black",
      }}
    >
      {chapter.title}
    </div>
  );
};
