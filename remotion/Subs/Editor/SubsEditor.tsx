import React from "react";
import ReactDOM from "react-dom";
import { AbsoluteFill } from "remotion";
import type { WhisperOutput } from "../../sub-types";
import { EditWord } from "./EditWord";
import { SubsEditorHeader } from "./Header";
import { FOOTER_HEIGHT, HEADER_HEIGHT, subEditorPortal } from "./layout";

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
            <EditWord
              key={word.offsets.from}
              longestWordLength={longestNumberLength}
              word={word}
            />
          );
        })}
      </AbsoluteFill>
      <SubsEditorHeader />
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
