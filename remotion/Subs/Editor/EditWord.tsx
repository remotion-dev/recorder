import React, { useCallback, useEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { WhisperWord } from "../../sub-types";
import {
  FIRST_COLUMN_WIDTH,
  SECOND_COLUMN_WIDTH,
  SIDE_PADDING,
} from "./layout";

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
  word: WhisperWord;
  longestWordLength: number;
  index: number;
  onUpdateText: (index: number, newText: string) => void;
  onCloseEditor: () => void;
  isInitialWord: boolean;
  trimStart: number;
}> = ({
  word,
  longestWordLength,
  index,
  onUpdateText,
  isInitialWord,
  onCloseEditor,
  trimStart,
}) => {
  const { width, fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const milliSeconds = ((frame + trimStart) / fps) * 1000;
  const active =
    word.offsets.from <= milliSeconds && word.offsets.to >= milliSeconds;
  const usableWidth = width - SIDE_PADDING * 2;
  const ref = useRef<HTMLDivElement>(null);

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
    if (active) {
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
        onCloseEditor();
      }
    },
    [onCloseEditor],
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
        <Indent value={word.offsets.from} digits={longestWordLength} />
        {word.offsets.from} :{" "}
        <Indent value={word.offsets.to} digits={longestWordLength} />
        {word.offsets.to}
      </div>
      <div
        style={{
          width: SECOND_COLUMN_WIDTH * usableWidth,
          whiteSpace: "pre",
        }}
      >
        <input
          type={"text"}
          autoFocus={isInitialWord}
          style={{
            fontSize: 30,
            fontFamily: isMonospaced ? "monospace" : "Helvetica",
            backgroundColor: "transparent",
            border: "none",
            color: isMonospaced ? "#3B82EB" : "black",
          }}
          onKeyDown={onInputKeyDown}
          onChange={onChange}
          value={word.text}
        />
      </div>
      <div>
        <div
          onClick={toggleMonospace}
          style={{
            width: 30,
            height: 30,
            border: isMonospaced ? "2px solid #3B82EB" : "2px solid gray",
            borderRadius: 3,
            cursor: "pointer",
            background: isMonospaced ? "#3B82EB" : "transparent",
          }}
        />
      </div>
    </div>
  );
};
