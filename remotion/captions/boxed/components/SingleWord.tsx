import { Caption } from "@remotion/captions";
import React, { useCallback, useMemo, useState } from "react";
import {
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  MONOSPACE_FONT_FAMILY,
  MONOSPACE_FONT_WEIGHT,
  REGULAR_FONT_FAMILY,
  REGULAR_FONT_WEIGHT,
} from "../../../../config/fonts";
import type { Theme } from "../../../../config/themes";
import { COLORS } from "../../../../config/themes";
import { useCaptionOverlay } from "../../editor/use-caption-overlay";
import { isCaptionMonospace } from "../../processing/split-word-into-monospace-segment";

type WordColor = {
  appeared: string;
  greyed: string;
};

const WORD_FADE_IN_DURATION_IN_MS = 100;

const getShownWordColor = ({
  appeared,
  word,
  time,
  wordColor,
  active,
}: {
  appeared: boolean;
  word: Caption;
  time: number;
  wordColor: WordColor;
  active: boolean;
}) => {
  if (!appeared) {
    return wordColor.greyed;
  }

  if (isCaptionMonospace(word)) {
    if (active) {
      return "white";
    }

    return wordColor.appeared;
  }

  return interpolateColors(
    time,
    [word.startMs - WORD_FADE_IN_DURATION_IN_MS, word.startMs],
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

const WORD_HIGHLIGHT_BORDER_RADIUS = 10;

export const BoxedSingleWord: React.FC<{
  word: Caption;
  isLast: boolean;
  theme: Theme;
  startFrame: number;
}> = ({ word, isLast, theme, startFrame }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame() + startFrame;
  const time = (frame / fps) * 1000;

  const [hovered, setHovered] = useState(false);

  const monospace = isCaptionMonospace(word);

  const progress = monospace
    ? word.startMs > time
      ? 1
      : spring({
          fps,
          frame,
          delay:
            word.startMs * fps - (WORD_FADE_IN_DURATION_IN_MS / 1000) * fps,
          config: {
            damping: 200,
          },
          durationInFrames: 5,
        }) *
          0.05 +
        0.95
    : 1;

  const appeared = word.startMs - 100 <= time;

  const active =
    appeared && (word.endMs === null || word.endMs - 100 > time || isLast);

  const wordColor = getWordColor({
    appeared,
    monospace,
    theme,
  });

  const shownWordColor = getShownWordColor({
    appeared,
    time,
    word,
    wordColor,
    active,
  });

  const shouldHighlight = active && monospace;

  const backgroundColor = shouldHighlight
    ? COLORS[theme].ACCENT_COLOR
    : "transparent";

  const style: React.CSSProperties = useMemo(() => {
    return {
      display: "inline",
      fontFamily: monospace ? MONOSPACE_FONT_FAMILY : REGULAR_FONT_FAMILY,
      color: shownWordColor,
      fontWeight: monospace ? MONOSPACE_FONT_WEIGHT : REGULAR_FONT_WEIGHT,
      backgroundColor,
      outline: hovered
        ? "2px solid black"
        : active
          ? "5px solid " + backgroundColor
          : "none",
      whiteSpace: monospace ? "nowrap" : undefined,
      // Fix gap inbetween background and outline
      boxShadow: shouldHighlight ? `0 0 0 1px ${backgroundColor}` : "none",
      borderRadius: WORD_HIGHLIGHT_BORDER_RADIUS,
      scale: String(progress),
      cursor: "pointer",
    };
  }, [
    active,
    backgroundColor,
    hovered,
    monospace,
    progress,
    shouldHighlight,
    shownWordColor,
  ]);

  const onPointerEnter = useCallback(() => {
    setHovered(true);
  }, []);

  const onPointerLeave = useCallback(() => {
    setHovered(false);
  }, []);

  const overlay = useCaptionOverlay();

  const onClick = useCallback(() => {
    overlay.setOpen(word);
  }, [overlay, word]);

  return (
    <span
      style={style}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
    >
      {word.text}
    </span>
  );
};
