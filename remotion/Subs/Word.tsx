import React from "react";
import {
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../colors";
import type { Theme } from "../configuration";
import type { Word } from "../sub-types";

const style: React.CSSProperties = {
  display: "inline",
};

export const useTime = (trimStart: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = (frame + trimStart) / fps;

  return time * 1000;
};

export const useSequenceDuration = (trimStart: number) => {
  const { durationInFrames, fps } = useVideoConfig();
  const sequenceDuration = (durationInFrames - trimStart) / fps;
  return sequenceDuration;
};

type WordColor = {
  appeared: string;
  greyed: string;
};

const getShownWordColor = ({
  appeared,
  word,
  time,
  wordColor,
  active,
}: {
  appeared: boolean;
  word: Word;
  time: number;
  wordColor: WordColor;
  active: boolean;
}) => {
  if (!appeared) {
    return wordColor.greyed;
  }

  if (word.monospace) {
    if (active) {
      return "white";
    }

    return wordColor.appeared;
  }

  return interpolateColors(
    time,
    [word.start, word.start + 0.1],
    [wordColor.greyed, wordColor.appeared],
  );
};

const getWordColor = ({
  appeared,
  monospace,
  theme,
}: {
  monospace: boolean;
  appeared: boolean;
  theme: Theme;
}): { appeared: string; greyed: string } => {
  const normalWordColor = {
    appeared: COLORS[theme].WORD_COLOR_ON_BG_APPEARED,
    greyed: COLORS[theme].WORD_COLOR_ON_BG_GREYED,
  };

  const wordColor =
    monospace && appeared
      ? {
          appeared: COLORS[theme].WORD_HIGHLIGHT_COLOR,
          greyed: COLORS[theme].WORD_COLOR_ON_BG_GREYED,
        }
      : normalWordColor;
  return wordColor;
};

export const regularFontWeight = 600;
export const regularFont = "Inter";

export const monospaceFontWeight = 500;
export const monospaceFont = "GT Planar";

export const WORD_HIGHLIGHT_BORDER_RADIUS = 10;

export const WordComp: React.FC<{
  word: Word;
  trimStart: number;
  isLast: boolean;
  theme: Theme;
}> = ({ word, trimStart, isLast, theme }) => {
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

  const active = word.start <= time && (word.end > time || isLast);

  const wordColor = getWordColor({
    appeared,
    monospace: word.monospace ?? false,
    theme,
  });

  const shownWordColor = getShownWordColor({
    appeared,
    time,
    word,
    wordColor,
    active,
  });

  const backgroundColor = active
    ? word.monospace
      ? COLORS[theme].WORD_HIGHLIGHT_COLOR
      : "transparent"
    : "transparent";

  const startsWithSpace = word.word.startsWith(" ");

  return (
    <>
      <span>{startsWithSpace && " "}</span>
      <span
        style={{
          ...style,
          fontFamily: word.monospace ? monospaceFont : regularFont,
          color: shownWordColor,
          fontWeight: word.monospace ? monospaceFontWeight : regularFontWeight,
          backgroundColor,
          outline: active ? "5px solid " + backgroundColor : "none",
          whiteSpace: word.monospace ? "nowrap" : undefined,
          // Fix gap inbetween background and outline
          boxShadow:
            active && word.monospace ? `0 0 0 1px ${backgroundColor}` : "none",
          borderRadius: WORD_HIGHLIGHT_BORDER_RADIUS,
          scale: String(scale),
          display: "inline",
        }}
      >
        {word.word.trim()}
      </span>
    </>
  );
};
