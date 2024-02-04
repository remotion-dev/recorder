import React from "react";
import { useVideoConfig } from "remotion";
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
}> = ({ word, longestWordLength }) => {
  const { width } = useVideoConfig();

  const usableWidth = width - SIDE_PADDING * 2;

  return (
    <div
      style={{
        flexDirection: "row",
        display: "flex",
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: SIDE_PADDING,
        paddingRight: SIDE_PADDING,
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
          style={{
            fontSize: 30,
            fontFamily: "Helvetica",
            backgroundColor: "transparent",
            border: "none",
          }}
          value={word.text}
        />
      </div>
      <div>
        <div
          style={{
            width: 30,
            height: 30,
            border: "2px solid gray",
            borderRadius: 3,
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
};
