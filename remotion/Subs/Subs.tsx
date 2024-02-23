import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { StaticFile } from "remotion";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  useVideoConfig,
  watchStaticFile,
} from "remotion";
import type { SaveSubtitlesPayload } from "../../server/constants";
import { SAVE_SUBTITLES, SERVER_PORT } from "../../server/constants";
import { getSubtitleTransform } from "../animations/subtitle-transitions";
import { getAnimatedSubtitleLayout } from "../animations/subtitle-transitions/box-transition";
import { shouldInlineTransitionSubtitles } from "../animations/subtitle-transitions/should-transition-subtitle";
import { COLORS } from "../colors";
import type {
  CanvasLayout,
  SceneAndMetadata,
  Theme,
  VideoSceneAndMetadata,
} from "../configuration";
import type { WhisperOutput, Word } from "../sub-types";
import { SubsEditor } from "./Editor/SubsEditor";
import { postprocessSubtitles } from "./postprocess-subs";
import {
  CaptionSentence,
  getBorderWidthForSubtitles,
  getSubsAlign,
  getSubtitlesFontSize,
  getSubtitlesLines,
  getSubtitlesType,
} from "./Segment";
import {
  TransitionFromPreviousSubtitles,
  TransitionToNextSubtitles,
} from "./TransitionBetweenSubtitles";

const LINE_HEIGHT = 1.2;

export const Subs: React.FC<{
  file: StaticFile;
  trimStart: number;
  canvasLayout: CanvasLayout;
  scene: VideoSceneAndMetadata;
  enter: number;
  exit: number;
  nextScene: SceneAndMetadata | null;
  previousScene: SceneAndMetadata | null;
  theme: Theme;
}> = ({
  file,
  trimStart,
  canvasLayout,
  scene,
  enter,
  exit,
  nextScene,
  previousScene,
  theme,
}) => {
  const [whisperOutput, setWhisperOutput] = useState<WhisperOutput | null>(
    null,
  );
  const { width, height } = useVideoConfig();
  const [handle] = useState(() => delayRender());
  const [changeStatus, setChangeStatus] = useState<
    "initial" | "changed" | "unchanged"
  >("initial");
  const [subEditorOpen, setSubEditorOpen] = useState<Word | false>(false);

  useEffect(() => {
    if (!subEditorOpen) {
      return;
    }

    const { cancel } = watchStaticFile(
      file.name,
      (newData: StaticFile | null) => {
        if (newData) {
          setChangeStatus("changed");
        }
      },
    );
    return () => {
      cancel();
    };
  }, [file.name, subEditorOpen]);

  useEffect(() => {
    if (changeStatus === "initial" || changeStatus === "changed") {
      fetch(file.src)
        .then((res) => res.json())
        .then((d) => {
          continueRender(handle);
          setWhisperOutput(d);
        });
      setChangeStatus("unchanged");
    }
  }, [changeStatus, file.src, handle]);

  const subtitleType = getSubtitlesType({
    canvasLayout,
    displayLayout: scene.layout.displayLayout,
  });

  const shouldTransitionToNext = shouldInlineTransitionSubtitles({
    canvasLayout,
    currentScene: scene,
    nextScene,
  });
  const shouldTransitionFromPrevious = shouldInlineTransitionSubtitles({
    canvasLayout,
    currentScene: scene,
    nextScene: previousScene,
  });

  const animatedSubLayout = getAnimatedSubtitleLayout({
    enterProgress: enter,
    exitProgress: exit,
    nextScene: nextScene && nextScene.type === "video-scene" ? nextScene : null,
    previousScene:
      previousScene && previousScene.type === "video-scene"
        ? previousScene
        : null,
    scene,
    shouldTransitionFromPrevious,
    shouldTransitionToNext,
  });

  const postprocessed = useMemo(() => {
    if (!whisperOutput) {
      return null;
    }

    return postprocessSubtitles({
      subTypes: whisperOutput,
      boxWidth: animatedSubLayout.width,
      maxLines: getSubtitlesLines(subtitleType),
      fontSize: getSubtitlesFontSize(subtitleType, scene.layout.displayLayout),
      canvasLayout,
      subtitleType,
    });
  }, [
    whisperOutput,
    animatedSubLayout.width,
    subtitleType,
    scene.layout.displayLayout,
    canvasLayout,
  ]);

  const onOpenSubEditor = useCallback((word: Word) => {
    setSubEditorOpen(word);
  }, []);

  const onCloseSubEditor = useCallback(() => {
    setSubEditorOpen(false);
  }, []);

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
        const payload: SaveSubtitlesPayload = {
          filename: `${window.remotion_publicFolderExists}/${file.name}`,
          data: newOutput,
        };

        fetch(`http://localhost:${SERVER_PORT}${SAVE_SUBTITLES}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        return newOutput;
      });
    },
    [file.name],
  );

  if (!postprocessed) {
    return null;
  }

  const outer: React.CSSProperties = {
    fontSize: getSubtitlesFontSize(subtitleType, scene.layout.displayLayout),
    display: "flex",
    lineHeight: LINE_HEIGHT,
    border: `${getBorderWidthForSubtitles(subtitleType)}px solid ${
      COLORS[theme].BORDER_COLOR
    }`,
    backgroundColor:
      subtitleType === "boxed" || subtitleType === "overlayed-center"
        ? COLORS[theme].SUBTITLES_BACKGROUND
        : undefined,
    ...getSubsAlign({
      canvasLayout,
      subtitleType,
    }),
    ...animatedSubLayout,
    transform: getSubtitleTransform({
      currentLayout: animatedSubLayout,
      enter,
      exit,
      height,
      nextScene,
      previousScene,
      scene,
      width,
      subtitleType,
    }),
  };

  return (
    <AbsoluteFill style={outer}>
      <TransitionFromPreviousSubtitles
        shouldTransitionFromPreviousSubtitle={shouldTransitionFromPrevious}
        subtitleType={subtitleType}
      >
        <TransitionToNextSubtitles
          shouldTransitionToNextsSubtitles={shouldTransitionToNext}
          subtitleType={subtitleType}
        >
          {postprocessed.segments.map((segment, index) => {
            return (
              <CaptionSentence
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                isFirst={index === 0}
                isLast={index === postprocessed.segments.length - 1}
                segment={segment}
                trimStart={trimStart}
                canvasLayout={canvasLayout}
                subtitleType={subtitleType}
                theme={theme}
                displayLayout={scene.layout.displayLayout}
                onOpenSubEditor={onOpenSubEditor}
              />
            );
          })}
        </TransitionToNextSubtitles>
      </TransitionFromPreviousSubtitles>

      {whisperOutput && subEditorOpen ? (
        <SubsEditor
          initialWord={subEditorOpen}
          setWhisperOutput={setAndSaveWhisperOutput}
          whisperOutput={whisperOutput}
          fileName={file.name}
          onCloseSubEditor={onCloseSubEditor}
          trimStart={trimStart}
        />
      ) : null}
    </AbsoluteFill>
  );
};
