import React, { useCallback } from "react";
import ReactDOM from "react-dom";
import { AbsoluteFill } from "remotion";
import type { WhisperOutput, Word } from "../../sub-types";
import { EditWord } from "./EditWord";
import { SubsEditorFooter } from "./Footer";
import { SubsEditorHeader } from "./Header";
import { FOOTER_HEIGHT, HEADER_HEIGHT, subEditorPortal } from "./layout";

export const SubsEditor: React.FC<{
  whisperOutput: WhisperOutput;
  setWhisperOutput: (updater: (old: WhisperOutput) => WhisperOutput) => void;
  fileName: string;
  initialWord: Word;
  onCloseSubEditor: () => void;
  trimStart: number;
}> = ({
  whisperOutput,
  setWhisperOutput,
  fileName,
  onCloseSubEditor,
  initialWord,
  trimStart,
}) => {
  const longestNumberLength = String(
    Math.max(...whisperOutput.transcription.map((t) => t.offsets.to)),
  ).length;

  const onChangeText = useCallback(
    (index: number, newText: string) => {
      setWhisperOutput((old) => {
        const newTranscription = old.transcription.map((t, i) => {
          if (i === index) {
            return {
              ...t,
              text: newText,
            };
          }

          return t;
        });
        return {
          ...old,
          transcription: newTranscription,
        };
      });
    },
    [setWhisperOutput],
  );

  if (!subEditorPortal.current) {
    return null;
  }

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
        {whisperOutput.transcription.map((word, i) => {
          return (
            <EditWord
              key={word.offsets.from + word.offsets.to}
              onUpdateText={onChangeText}
              index={i}
              longestWordLength={longestNumberLength}
              word={word}
              isInitialWord={word.offsets.from === initialWord.start}
              onCloseEditor={onCloseSubEditor}
              trimStart={trimStart}
            />
          );
        })}
      </AbsoluteFill>
      <SubsEditorHeader />
      <SubsEditorFooter
        onCloseSubEditor={onCloseSubEditor}
        fileName={fileName}
      />
    </AbsoluteFill>,
    subEditorPortal.current as HTMLDivElement,
  );
};
