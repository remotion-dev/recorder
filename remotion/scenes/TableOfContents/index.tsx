import { loadFont } from "@remotion/google-fonts/RobotoCondensed";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { ChapterType } from "../../chapters/make-chapters";
import { COLORS } from "../../colors";
import { transitionDuration } from "../../configuration";

loadFont();

export const TableOfContents: React.FC<{
  isTransitioningIn: boolean;
  isTransitioningOut: boolean;
  chapters: ChapterType[];
}> = ({ isTransitioningIn, chapters, isTransitioningOut }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const swipe = isTransitioningIn
    ? spring({
        fps,
        frame,
        config: {
          damping: 200,
        },
        durationInFrames: transitionDuration,
      })
    : 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.BACKGROUND,
        transform: `translateX(${interpolate(swipe, [0, 1], [width, 0])}px)`,
      }}
    >
      {chapters.map((chapter) => {
        return <div key={chapter.id}>{chapter.title}</div>;
      })}
    </AbsoluteFill>
  );
};
