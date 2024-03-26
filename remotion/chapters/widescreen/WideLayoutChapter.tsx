import React, { useMemo } from "react";
import { interpolate } from "remotion";
import { TITLE_FONT_FAMILY, TITLE_FONT_WEIGHT } from "../../../config/fonts";
import { COLORS, Theme } from "../../../config/themes";
import type { ChapterType } from "../make-chapters";

export const CHAPTER_HEIGHT = 80;
export const CHAPTER_VERTICAL_MARGIN = 4;

export const WideLayoutChapter: React.FC<{
  chapter: ChapterType;
  activeIndex: number;
  slideHighlight: boolean;
  enterWithSlide: boolean;
  exitWithSlide: boolean;
  fadeOut: boolean;
  fadeIn: boolean;
  isFirst: boolean;
  isLast: boolean;
  rightAligned: boolean;
  exitProgress: number;
  enterProgress: number;
  theme: Theme;
}> = ({
  chapter,
  activeIndex,
  enterWithSlide,
  slideHighlight,
  fadeOut,
  fadeIn,
  isLast,
  isFirst,
  rightAligned,
  exitProgress,
  enterProgress,
  exitWithSlide,
  theme,
}) => {
  const isPrevious = chapter.index === activeIndex - 1;
  const isCurrent = chapter.index === activeIndex;

  const slide = slideHighlight ? enterProgress : 1;
  const translateY =
    (enterWithSlide
      ? interpolate(
          enterProgress,
          [0, 1],
          [CHAPTER_HEIGHT + CHAPTER_VERTICAL_MARGIN * 2, 0],
        )
      : 0) +
    (exitWithSlide
      ? interpolate(
          exitProgress,
          [0, 1],
          [0, -(CHAPTER_HEIGHT + CHAPTER_VERTICAL_MARGIN * 2)],
        )
      : 0);

  const wipePercentage = interpolate(slide, [0, 1], [0, 100]);
  const previousMaskImage = `linear-gradient(to bottom, transparent ${wipePercentage}%, black ${wipePercentage}%)`;
  const maskImage = `linear-gradient(to bottom, black ${wipePercentage}%, transparent ${wipePercentage}%)`;

  const textStyle: React.CSSProperties = useMemo(() => {
    return {
      padding: "0px 20px",
      fontSize: 36,
      fontFamily: TITLE_FONT_FAMILY,
      fontWeight: TITLE_FONT_WEIGHT,
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      right: rightAligned ? undefined : 0,
      left: rightAligned ? 0 : undefined,
    };
  }, [rightAligned]);

  const opacity = useMemo(() => {
    if (fadeOut) {
      return 1 - exitProgress;
    }

    if (fadeIn) {
      return enterProgress;
    }

    return 1;
  }, [enterProgress, exitProgress, fadeIn, fadeOut]);

  const chapterContent = (
    <div
      style={{
        backgroundColor: "black",
        color: "white",
        padding: "12px 0px",
        fontSize: 32,
        fontFamily: TITLE_FONT_FAMILY,
        width: 65,
        textAlign: "center",
        height: "100%",
        fontWeight: TITLE_FONT_WEIGHT,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      }}
    >
      {chapter.index + 1}
    </div>
  );

  return (
    <div
      style={{
        display: "inline-flex",
        borderRadius: 20,
        border: "5px solid black",
        marginTop: isFirst ? 0 : CHAPTER_VERTICAL_MARGIN,
        marginBottom: isLast ? 0 : CHAPTER_VERTICAL_MARGIN,
        overflow: "hidden",
        height: CHAPTER_HEIGHT,
        justifyContent: "center",
        alignItems: "center",
        transform: `translateY(${translateY}px)`,
        opacity,
      }}
    >
      {rightAligned ? null : chapterContent}
      <div
        style={{
          ...textStyle,
          backgroundColor: "white",
          padding: "0px 20px",
          color: "black",
        }}
      >
        {chapter.title}
      </div>
      {isCurrent ? (
        <div
          style={{
            ...textStyle,
            backgroundColor: COLORS[theme].ACCENT_COLOR,
            color: "white",
            WebkitMaskImage: maskImage,
            maskImage,
            position: "absolute",
          }}
        >
          {chapter.title}
        </div>
      ) : null}
      {isPrevious ? (
        <div
          style={{
            ...textStyle,
            backgroundColor: COLORS[theme].ACCENT_COLOR,
            color: "white",
            WebkitMaskImage: previousMaskImage,
            maskImage: previousMaskImage,
            position: "absolute",
          }}
        >
          {chapter.title}
        </div>
      ) : null}
      {rightAligned ? chapterContent : null}
    </div>
  );
};
