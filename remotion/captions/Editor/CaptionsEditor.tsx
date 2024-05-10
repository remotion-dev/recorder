import { writeStaticFile } from "@remotion/studio";
import React, { useCallback, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { AbsoluteFill } from "remotion";
import type { Word } from "../../../config/autocorrect";
import type { Theme } from "../../../config/themes";
import { whisperWordToWord } from "../processing/whisper-word-to-word";
import type { WhisperOutput } from "../types";
import { EditWord } from "./EditWord";
import { SubsEditorFooter } from "./Footer";
import { SubsEditorHeader } from "./Header";
import { captionEditorPortal, FOOTER_HEIGHT, HEADER_HEIGHT } from "./layout";
import { useCaptionOverlay } from "./use-caption-overlay";

export const CaptionsEditor: React.FC<{
  whisperOutput: WhisperOutput;
  setWhisperOutput: React.Dispatch<React.SetStateAction<WhisperOutput | null>>;
  filePath: string;
  initialWord: Word;
  trimStart: number;
  theme: Theme;
}> = ({
  whisperOutput,
  filePath,
  initialWord,
  trimStart,
  theme,
  setWhisperOutput,
}) => {
  const overlay = useCaptionOverlay();
  const setAndSaveWhisperOutput = useCallback(
    (updater: (old: WhisperOutput) => WhisperOutput) => {
      setWhisperOutput((old) => {
        if (old === null) {
          return null;
        }

        if (!window.remotion_publicFolderExists) {
          throw new Error("window.remotion_publicFolderExists is not set");
        }

        const newOutput = updater(old);
        const contents = JSON.stringify(newOutput, null, 2);

        writeStaticFile({
          filePath,
          contents,
        });

        return newOutput;
      });
    },
    [filePath, setWhisperOutput],
  );

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
      setAndSaveWhisperOutput((old) => {
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
    [setAndSaveWhisperOutput],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        overlay.setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [overlay, overlay.setOpen]);

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
            />
          );
        })}
      </AbsoluteFill>
      <SubsEditorHeader />
      <SubsEditorFooter fileName={filePath} />
    </AbsoluteFill>,
    captionEditorPortal.current as HTMLDivElement,
  );
};
