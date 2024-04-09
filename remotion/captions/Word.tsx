import React, { useState } from "react";
import {
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Word } from "../../config/autocorrect";
import {
  MONOSPACE_FONT_FAMILY,
  MONOSPACE_FONT_WEIGHT,
  REGULAR_FONT_FAMILY,
  REGULAR_FONT_WEIGHT,
} from "../../config/fonts";
import type { Theme } from "../../config/themes";
import { COLORS } from "../../config/themes";

const style: React.CSSProperties = {
  display: "inline",
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
    [word.firstTimestamp, word.firstTimestamp + 100],
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

  return monospace && appeared
    ? {
        appeared: COLORS[theme].ACCENT_COLOR,
        greyed: COLORS[theme].WORD_COLOR_ON_BG_GREYED,
      }
    : normalWordColor;
};

export const WORD_HIGHLIGHT_BORDER_RADIUS = 10;

export const WordComp: React.FC<{
  word: Word;
  isLast: boolean;
  theme: Theme;
  onOpenSubEditor: (word: Word) => void;
  startFrame: number;
}> = ({ word, isLast, theme, onOpenSubEditor, startFrame }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame() + startFrame;
  const time = (frame / fps) * 1000;

  const [hovered, setHovered] = useState(false);

  const scale = word.monospace
    ? word.firstTimestamp > time
      ? 1
      : spring({
          fps,
          frame,
          delay: word.firstTimestamp * fps,
          config: {
            damping: 200,
          },
          durationInFrames: 5,
        }) *
          0.05 +
        0.95
    : 1;

  const appeared = word.firstTimestamp <= time;

  const active =
    word.firstTimestamp <= time &&
    (word.lastTimestamp === null || word.lastTimestamp > time || isLast);

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
      ? COLORS[theme].ACCENT_COLOR
      : "transparent"
    : "transparent";

  const startsWithSpace = word.word.startsWith(" ");

  return (
    <>
      <span>{startsWithSpace && " "}</span>
      <span
        style={{
          ...style,
          fontFamily: word.monospace
            ? MONOSPACE_FONT_FAMILY
            : REGULAR_FONT_FAMILY,
          color: shownWordColor,
          fontWeight: word.monospace
            ? MONOSPACE_FONT_WEIGHT
            : REGULAR_FONT_WEIGHT,
          backgroundColor,
          outline: hovered
            ? "2px solid black"
            : active
              ? "5px solid " + backgroundColor
              : "none",
          whiteSpace: word.monospace ? "nowrap" : undefined,
          // Fix gap inbetween background and outline
          boxShadow:
            active && word.monospace ? `0 0 0 1px ${backgroundColor}` : "none",
          borderRadius: WORD_HIGHLIGHT_BORDER_RADIUS,
          scale: String(scale),
          display: "inline",
          cursor: "pointer",
        }}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={() => onOpenSubEditor(word)}
      >
        {word.word.trim()}
      </span>
    </>
  );
};
