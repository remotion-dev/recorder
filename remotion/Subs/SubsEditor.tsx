import React from "react";
import ReactDOM from "react-dom";
import { AbsoluteFill, useVideoConfig } from "remotion";
import type { WhisperOutput, WhisperWord } from "../sub-types";

export const subEditorPortal = React.createRef<HTMLDivElement>();

const FIRST_COLUMN_WIDTH = 0.25;
const SECOND_COLUMN_WIDTH = 0.5;

const Word: React.FC<{
  word: WhisperWord;
  longestWordLength: number;
}> = ({ word, longestWordLength }) => {
  const { width } = useVideoConfig();
  const paddedTo = String(word.offsets.to).padStart(longestWordLength, "0");
  const paddedFrom = String(word.offsets.from).padStart(longestWordLength, "0");

  return (
    <div
      style={{
        paddingLeft: 20,
        flexDirection: "row",
        display: "flex",
        paddingTop: 5,
        paddingBottom: 5,
      }}
    >
      <div
        style={{
          fontFamily: "Helvetica",
          fontSize: 30,
          width: FIRST_COLUMN_WIDTH * width,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {paddedFrom} - {paddedTo}
      </div>
      <div
        style={{
          fontFamily: "Helvetica",
          fontSize: 30,
          width: SECOND_COLUMN_WIDTH * width,
        }}
      >
        {word.text}
      </div>
      <div>
        <input type={"checkbox"} />
      </div>
    </div>
  );
};

const HEADER_HEIGHT = 100;
const FOOTER_HEIGHT = 100;

export const SubsEditor: React.FC<{
  whisperOutput: WhisperOutput;
}> = ({ whisperOutput }) => {
  if (!subEditorPortal.current) {
    return null;
  }

  const longestNumberLength = String(
    Math.max(...whisperOutput.transcription.map((t) => t.offsets.to)),
  ).length;

  return ReactDOM.createPortal(
    <AbsoluteFill
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.9)",
      }}
    >
      <AbsoluteFill
        style={{
          overflowY: "auto",
          paddingTop: HEADER_HEIGHT,
          paddingBottom: FOOTER_HEIGHT,
        }}
      >
        {whisperOutput.transcription.map((word) => {
          return (
            <Word
              key={word.offsets.from}
              longestWordLength={longestNumberLength}
              word={word}
            />
          );
        })}
      </AbsoluteFill>
      <div
        style={{
          height: HEADER_HEIGHT,
          width: "100%",
          backgroundColor: "red",
          position: "absolute",
        }}
      />
      <div
        style={{
          height: FOOTER_HEIGHT,
          width: "100%",
          backgroundColor: "red",
          position: "absolute",
          bottom: 0,
        }}
      />
    </AbsoluteFill>,
    subEditorPortal.current as HTMLDivElement,
  );
};
