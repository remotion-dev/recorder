import React, { useCallback, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { AbsoluteFill } from "remotion";
import type { Word } from "../../../config/autocorrect";
import type { Theme } from "../../../config/themes";
import type { WhisperOutput } from "../types";
import { whisperWordToWord } from "../types";
import { EditWord } from "./EditWord";
import { SubsEditorFooter } from "./Footer";
import { SubsEditorHeader } from "./Header";
import { captionEditorPortal, FOOTER_HEIGHT, HEADER_HEIGHT } from "./layout";

export const SubsEditor: React.FC<{
  whisperOutput: WhisperOutput;
  setWhisperOutput: (updater: (old: WhisperOutput) => WhisperOutput) => void;
  fileName: string;
  initialWord: Word;
  onCloseSubEditor: () => void;
  trimStart: number;
  theme: Theme;
}> = ({
  whisperOutput,
  setWhisperOutput,
  fileName,
  onCloseSubEditor,
  initialWord,
  trimStart,
  theme,
}) => {
  const words = useMemo(() => {
    return whisperOutput.transcription.map((whisperWord, i) => {
      const nextWhisperWord = whisperOutput.transcription[i + 1];
      return whisperWordToWord(whisperWord, nextWhisperWord ?? null);
    });
  }, [whisperOutput.transcription]);

  const longestNumberLength = String(
    Math.max(
      ...words.map((t) => t.firstTimestamp),
      ...(words
        .map((t) => t.lastTimestamp)
        .filter((t) => t !== null) as number[]),
    ),
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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseSubEditor();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onCloseSubEditor]);

  if (!captionEditorPortal.current) {
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
        {words.map((word, i) => {
          return (
            <EditWord
              key={[word.firstTimestamp, word.lastTimestamp, i].join("-")}
              theme={theme}
              index={i}
              longestNumberLength={longestNumberLength}
              word={word}
              isInitialWord={word.firstTimestamp === initialWord.firstTimestamp}
              trimStart={trimStart}
              onUpdateText={onChangeText}
              onCloseEditor={onCloseSubEditor}
            />
          );
        })}
      </AbsoluteFill>
      <SubsEditorHeader />
      <SubsEditorFooter
        fileName={fileName}
        onCloseSubEditor={onCloseSubEditor}
      />
    </AbsoluteFill>,
    captionEditorPortal.current as HTMLDivElement,
  );
};
