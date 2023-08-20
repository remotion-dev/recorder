import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CanvasLayout } from "../configuration";
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

const BLUE = "#3B82EB";

export const WordComp: React.FC<{
  word: Word;
  trimStart: number;
  canvasLayout: CanvasLayout;
  isLast: boolean;
}> = ({ word, trimStart, canvasLayout, isLast }) => {
  const time = useTime(trimStart);
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const scale =
    word.start > time
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
        0.95;

  const appeared = word.start <= time;
  const opacity = appeared ? 1 : 0.3;

  const active = word.start <= time && (word.end > time || isLast);

  const monospace =
    word.word.trimStart().startsWith("`") && word.word.endsWith("`");

  const withoutBackticks = word.word.replace(/`/g, "");

  const wordColor = monospace && appeared ? BLUE : "black";
  const backgroundColor = active
    ? monospace
      ? BLUE
      : "transparent"
    : "transparent";

  const startsWithSpace = withoutBackticks.startsWith(" ");

  return (
    <>
      <span>{startsWithSpace && " "}</span>
      <span
        style={{
          ...style,
          opacity,
          fontFamily: monospace ? "GT Planar" : "Inter",
          color: backgroundColor === BLUE ? "white" : wordColor,
          fontWeight: monospace ? 500 : 600,
          backgroundColor,
          outline: active ? "5px solid " + backgroundColor : "none",
          borderRadius: 10,
          scale: String(scale),
          display: "inline-block",
        }}
      >
        {withoutBackticks.trim()}
      </span>
    </>
  );
};
