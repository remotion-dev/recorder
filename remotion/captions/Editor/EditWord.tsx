import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { Word } from "../../../config/autocorrect";
import type { Theme } from "../../../config/themes";
import { COLORS } from "../../../config/themes";
import {
  FIRST_COLUMN_WIDTH,
  SECOND_COLUMN_WIDTH,
  SIDE_PADDING,
} from "./layout";
import { useCaptionOverlay } from "./use-caption-overlay";

const Indent: React.FC<{ value: number; digits: number }> = ({
  digits,
  value,
}) => {
  const indentTo = digits - String(value).length;

  return (
    <span style={{ opacity: 0 }}>
      {new Array(indentTo)
        .fill(0)
        .map(() => "0")
        .join("")}
    </span>
  );
};

export const EditWord: React.FC<{
  word: Word;
  longestNumberLength: number;
  index: number;
  onUpdateText: (index: number, newText: string) => void;
  isInitialWord: boolean;
  trimStart: number;
  theme: Theme;
}> = ({
  word,
  longestNumberLength: longestWordLength,
  index,
  onUpdateText,
  isInitialWord,
  trimStart,
  theme,
}) => {
  const overlay = useCaptionOverlay();
  const { width, fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const milliSeconds = ((frame + trimStart) / fps) * 1000;
  const active =
    word.firstTimestamp <= milliSeconds &&
    (word.lastTimestamp === null || word.lastTimestamp >= milliSeconds);
  const usableWidth = width - SIDE_PADDING * 2;
  const ref = useRef<HTMLDivElement>(null);

  const initialFrame = useMemo(() => {
    return frame;
  }, []);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdateText(index, e.target.value);
    },
    [index, onUpdateText],
  );

  const isMonospaced =
    word.text.trim().startsWith("`") && word.text.trim().endsWith("`");

  const toggleMonospace = useCallback(() => {
    if (isMonospaced) {
      onUpdateText(index, word.text.replace(/`/g, ""));
    } else {
      let newWord = word.text;
      if (!newWord.trim().startsWith("`")) {
        newWord = "`" + newWord;
      }

      if (!newWord.trim().endsWith("`") || newWord.trim().length === 1) {
        newWord += "`";
      }

      onUpdateText(index, newWord);
    }
  }, [index, isMonospaced, onUpdateText, word.text]);

  useEffect(() => {
    if (active && initialFrame !== frame) {
      ref.current?.scrollIntoView({
        behavior: "auto",
        block: "center",
      });
    }
  }, [active]);

  const onInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = ref.current?.nextElementSibling?.querySelector(
          "input[type=text]",
        ) as HTMLInputElement | undefined;
        if (next) {
          next.focus();
          next.scrollIntoView({ behavior: "auto", block: "center" });
        }
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = ref.current?.previousElementSibling?.querySelector(
          "input[type=text]",
        ) as HTMLInputElement | undefined;
        if (prev) {
          prev.focus();
          prev.scrollIntoView({ behavior: "auto", block: "center" });
        }
      }

      if (e.key === "Enter") {
        e.preventDefault();
        overlay.setOpen(false);
      }

      if (e.key === "i" && e.metaKey) {
        e.preventDefault();
        toggleMonospace();
      }
    },
    [overlay, toggleMonospace],
  );

  return (
    <div
      ref={ref}
      style={{
        flexDirection: "row",
        display: "flex",
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: SIDE_PADDING,
        paddingRight: SIDE_PADDING,
        backgroundColor: active ? "rgba(0, 0, 0, 0.1)" : "transparent",
      }}
    >
      <div
        style={{
          fontFamily: "Helvetica",
          fontSize: 30,
          width: FIRST_COLUMN_WIDTH * usableWidth,
          fontVariantNumeric: "tabular-nums",
          color: "gray",
          textAlign: "right",
          paddingRight: 30,
        }}
      >
        <Indent value={word.firstTimestamp} digits={longestWordLength} />
        {String(word.firstTimestamp)} :{" "}
        <Indent
          value={word.lastTimestamp ? word.lastTimestamp : word.firstTimestamp}
          digits={longestWordLength}
        />
        {word.lastTimestamp ? word.lastTimestamp : word.firstTimestamp}
      </div>
      <div
        style={{
          width: SECOND_COLUMN_WIDTH * usableWidth,
          whiteSpace: "pre",
        }}
      >
        <input
          type="text"
          autoFocus={isInitialWord}
          style={{
            fontSize: 30,
            fontFamily: isMonospaced ? "monospace" : "Helvetica",
            backgroundColor: "transparent",
            border: "none",
            color: isMonospaced ? COLORS[theme].ACCENT_COLOR : "black",
          }}
          value={word.text}
          onKeyDown={onInputKeyDown}
          onChange={onChange}
        />
      </div>
      <div>
        <div
          style={{
            width: 30,
            height: 30,
            border: isMonospaced
              ? "2px solid " + COLORS[theme].ACCENT_COLOR
              : "2px solid gray",
            borderRadius: 3,
            cursor: "pointer",
            background: isMonospaced
              ? COLORS[theme].ACCENT_COLOR
              : "transparent",
          }}
          onClick={toggleMonospace}
        />
      </div>
    </div>
  );
};
