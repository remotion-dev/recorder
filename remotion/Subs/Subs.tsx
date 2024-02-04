import React, { useEffect, useMemo, useState } from "react";
import type { StaticFile } from "remotion";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  useVideoConfig,
  watchStaticFile,
} from "remotion";
import { getSubtitleTranslation } from "../animations/subtitle-transitions";
import type {
  CanvasLayout,
  SceneAndMetadata,
  Theme,
  VideoSceneAndMetadata,
} from "../configuration";
import type { WhisperOutput } from "../sub-types";
import { SubsEditor } from "./Editor/SubsEditor";
import { postprocessSubtitles } from "./postprocess-subs";
import {
  getSubsBox,
  getSubtitlesFontSize,
  getSubtitlesLines,
  getSubtitlesType,
  SegmentComp,
} from "./Segment";

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

  useEffect(() => {
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
  }, [file.name]);

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

  const subsLayout = getSubsBox({
    canvasLayout,
    canvasSize: { height, width },
    subtitleType,
    displayLayout: scene.layout.displayLayout,
    webcamLayout: scene.layout.webcamLayout,
    webcamPosition: scene.finalWebcamPosition,
  });

  const animatedSubLayout = getSubtitleTranslation({
    enter,
    exit,
    height,
    width,
    canvasLayout,
    nextScene,
    previousScene,
    scene,
    currentLayout: subsLayout,
  });

  const postprocessed = useMemo(() => {
    return whisperOutput
      ? postprocessSubtitles({
          subTypes: whisperOutput,
          boxWidth: animatedSubLayout.width,
          maxLines: getSubtitlesLines(subtitleType),
          fontSize: getSubtitlesFontSize(
            subtitleType,
            scene.layout.displayLayout,
          ),
          canvasLayout,
          subtitleType,
        })
      : null;
  }, [
    animatedSubLayout.width,
    canvasLayout,
    whisperOutput,
    scene.layout.displayLayout,
    subtitleType,
  ]);

  if (!postprocessed) {
    return null;
  }

  return (
    <AbsoluteFill>
      {postprocessed.segments.map((segment, index) => {
        return (
          <SegmentComp
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            isLast={index === postprocessed.segments.length - 1}
            isFirst={index === 0}
            segment={segment}
            trimStart={trimStart}
            canvasLayout={canvasLayout}
            subsBox={animatedSubLayout}
            subtitleType={subtitleType}
            theme={theme}
            displayLayout={scene.layout.displayLayout}
          />
        );
      })}
      {whisperOutput ? (
        <SubsEditor
          setWhisperOutput={
            setWhisperOutput as React.Dispatch<
              React.SetStateAction<WhisperOutput>
            >
          }
          whisperOutput={whisperOutput}
        />
      ) : null}
    </AbsoluteFill>
  );
};
