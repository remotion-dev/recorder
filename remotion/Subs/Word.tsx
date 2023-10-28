import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../colors";
import type { Layout } from "../layout/get-layout";
import type { Word } from "../sub-types";

const style: React.CSSProperties = {
  display: "inline",
};

export const useTime = (trimStart: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = (frame + trimStart) / fps;

  return time;
};

export const useSequenceDuration = (trimStart: number) => {
  const { durationInFrames, fps } = useVideoConfig();
  const sequenceDuration = (durationInFrames - trimStart) / fps;
  return sequenceDuration;
};

const getWordColor = ({
  displayLayout,
  appeared,
  monospace,
}: {
  displayLayout: Layout | null;
  monospace: boolean;
  appeared: boolean;
}) => {
  const normalWordColor =
    displayLayout === null
      ? COLORS.WORD_COLOR_ON_VIDEO
      : COLORS.WORD_COLOR_ON_BG;

  const wordColor =
    monospace && appeared ? COLORS.WORD_HIGHLIGHT_COLOR : normalWordColor;
  return wordColor;
};

export const regularFontWeight = 600;
export const regularFont = "Inter";

export const monospaceFontWeight = 500;
export const monospaceFont = "GT Planar";

export const WordComp: React.FC<{
  word: Word;
  trimStart: number;
  isLast: boolean;
  displayLayout: Layout | null;
}> = ({ word, trimStart, isLast, displayLayout }) => {
  const time = useTime(trimStart);
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const scale = word.monospace
    ? word.start > time
      ? 1
      : spring({
          fps,
          frame,
          delay: word.start * fps - trimStart,
          config: {
            damping: 200,
          },
          durationInFrames: 5,
        }) *
          0.05 +
        0.95
    : 1;

  const appeared = word.start <= time;
  const opacity = appeared
    ? word.monospace
      ? 1
      : interpolate(time, [word.start, word.start + 0.1], [0.3, 1], {
          extrapolateRight: "clamp",
        })
    : 0.3;

  const active = word.start <= time && (word.end > time || isLast);

  const wordColor = getWordColor({
    appeared,
    displayLayout,
    monospace: word.monospace ?? false,
  });
  const backgroundColor = active
    ? word.monospace
      ? COLORS.WORD_HIGHLIGHT_COLOR
      : "transparent"
    : "transparent";

  const startsWithSpace = word.word.startsWith(" ");

  return (
    <>
      <span>{startsWithSpace && " "}</span>
      <span
        style={{
          ...style,
          opacity,
          fontFamily: word.monospace ? monospaceFont : regularFont,
          color:
            backgroundColor === COLORS.WORD_HIGHLIGHT_COLOR
              ? "white"
              : wordColor,
          fontWeight: word.monospace ? monospaceFontWeight : regularFontWeight,
          backgroundColor,
          outline: active ? "5px solid " + backgroundColor : "none",
          borderRadius: 10,
          scale: String(scale),
          display: "inline-block",
        }}
      >
        {word.word.trim()}
      </span>
    </>
  );
};
