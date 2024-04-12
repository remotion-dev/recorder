import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { StaticFile } from "remotion";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  useVideoConfig,
  watchStaticFile,
} from "remotion";
import type { Word } from "../../config/autocorrect";
import type { CanvasLayout } from "../../config/layout";
import type {
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../../config/scenes";
import { SERVER_PORT } from "../../config/server";
import type { Theme } from "../../config/themes";
import { COLORS } from "../../config/themes";
import type { SaveSubtitlesPayload } from "../../scripts/server/constants";
import { SAVE_SUBTITLES } from "../../scripts/server/constants";
import { getSubtitleTransform } from "../animations/subtitle-transitions";
import { getAnimatedSubtitleLayout } from "../animations/subtitle-transitions/box-transition";
import { shouldInlineTransitionSubtitles } from "../animations/subtitle-transitions/should-transition-subtitle";
import { SubsEditor } from "./Editor/SubsEditor";
import { postprocessSubtitles } from "./processing/postprocess-subs";
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
import type { WhisperOutput } from "./types";

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
  const preventReload = useRef(false);

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
          if (!preventReload.current) {
            setWhisperOutput(d);
          }
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

  const boxHeight = scene.layout.subLayout.height;

  const postprocessed = useMemo(() => {
    if (!whisperOutput) {
      return null;
    }

    const fontSize = getSubtitlesFontSize(
      subtitleType,
      scene.layout.displayLayout,
    );
    return postprocessSubtitles({
      subTypes: whisperOutput,
      boxWidth: animatedSubLayout.width,
      maxLines: getSubtitlesLines({
        subtitleType,
        boxHeight,
        fontSize,
      }),
      fontSize,
      canvasLayout,
      subtitleType,
    });
  }, [
    whisperOutput,
    subtitleType,
    scene.layout.displayLayout,
    animatedSubLayout.width,
    boxHeight,
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

        preventReload.current = true;
        fetch(`http://localhost:${SERVER_PORT}${SAVE_SUBTITLES}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }).finally(() => {
          preventReload.current = false;
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
                captionBoxHeight={boxHeight}
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
          trimStart={trimStart}
          theme={theme}
          onCloseSubEditor={onCloseSubEditor}
        />
      ) : null}
    </AbsoluteFill>
  );
};
