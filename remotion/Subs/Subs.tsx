import React, { useEffect, useMemo, useState } from "react";
import type { StaticFile } from "remotion";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  useVideoConfig,
  watchStaticFile,
} from "remotion";
import { getSubtitleTranslation } from "../animations/camera-scene-transitions";
import type {
  CanvasLayout,
  SceneAndMetadata,
  VideoSceneAndMetadata,
} from "../configuration";
import type { SubTypes } from "../sub-types";
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
}> = ({
  file,
  trimStart,
  canvasLayout,
  scene,
  enter,
  exit,
  nextScene,
  previousScene,
}) => {
  const [data, setData] = useState<SubTypes | null>(null);
  const { width, height } = useVideoConfig();
  const [handle] = useState(() => delayRender());
  const [changeStatus, setChangeStatus] = useState<
    "initial" | "changed" | "unchanged"
  >("initial");
  watchStaticFile(file.name, (newData: StaticFile | null) => {
    if (newData) {
      setChangeStatus("changed");
    }
  });

  useEffect(() => {
    if (changeStatus === "initial" || changeStatus === "changed") {
      fetch(file.src)
        .then((res) => res.json())
        .then((d) => {
          continueRender(handle);
          setData(d);
        });
      setChangeStatus("unchanged");
    }
  }, [changeStatus, file.src, handle]);

  const subtitleTranslation = useMemo(() => {
    return getSubtitleTranslation({
      enter,
      exit,
      height,
      width,
      canvasLayout,
      nextScene,
      previousScene,
      scene,
    });
  }, [
    canvasLayout,
    enter,
    exit,
    height,
    nextScene,
    previousScene,
    scene,
    width,
  ]);

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
    webcamPosition: scene.scene.webcamPosition,
  });

  const postprocessed = useMemo(() => {
    return data
      ? postprocessSubtitles({
          subTypes: data,
          boxWidth: subsLayout.width,
          maxLines: getSubtitlesLines(subtitleType),
          fontSize: getSubtitlesFontSize(
            subtitleType,
            scene.layout.displayLayout,
          ),
        })
      : null;
  }, [data, scene.layout.displayLayout, subsLayout.width, subtitleType]);

  if (!postprocessed) {
    return null;
  }

  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${subtitleTranslation.translationX}px) translateY(${subtitleTranslation.translationY}px)`,
      }}
    >
      {postprocessed.segments.map((segment, index) => {
        return (
          <SegmentComp
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            isLast={index === postprocessed.segments.length - 1}
            segment={segment}
            trimStart={trimStart}
            canvasLayout={canvasLayout}
            subsBox={subsLayout}
            subtitleType={subtitleType}
            displayLayout={scene.layout.displayLayout}
          />
        );
      })}
    </AbsoluteFill>
  );
};
