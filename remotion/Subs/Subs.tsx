import React, { useEffect, useMemo, useState } from "react";
import type { StaticFile } from "remotion";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  useVideoConfig,
} from "remotion";
import { getSubtitleTranslation } from "../animations/camera-scene-transitions";
import type { CanvasLayout, WebcamPosition } from "../configuration";
import type { Layout } from "../layout/get-layout";
import type { SubTypes } from "../sub-types";
import { postprocessSubtitles } from "./postprocess-subs";
import { getFontSize, getSubsBox, SegmentComp } from "./Segment";

export const Subs: React.FC<{
  file: StaticFile;
  trimStart: number;
  canvasLayout: CanvasLayout;
  displayLayout: Layout | null;
  webcamPosition: WebcamPosition;
  webcamLayout: Layout;
  enter: number;
  exit: number;
  prevWebcamPosition: WebcamPosition | null;
  nextWebcamPosition: WebcamPosition | null;
  shouldExit: boolean;
}> = ({
  file,
  trimStart,
  canvasLayout,
  displayLayout,
  webcamPosition,
  webcamLayout,
  enter,
  exit,
  nextWebcamPosition,
  prevWebcamPosition,
  shouldExit,
}) => {
  const [data, setData] = useState<SubTypes | null>(null);
  const { width, height } = useVideoConfig();
  const [handle] = useState(() => delayRender());

  useEffect(() => {
    fetch(file.src)
      .then((res) => res.json())
      .then((d) => {
        continueRender(handle);
        setData(d);
      });
  }, [file.src, handle]);

  const subtitleTranslation = useMemo(() => {
    return getSubtitleTranslation({
      enter,
      exit,
      height,
      webcamPosition,
      width,
      canvasLayout,
      nextWebcamPosition,
      prevWebcamPosition,
    });
  }, [
    canvasLayout,
    enter,
    exit,
    height,
    nextWebcamPosition,
    prevWebcamPosition,
    webcamPosition,
    width,
  ]);

  const subsLayout = getSubsBox({
    canvasLayout,
    webcamLayout,
    webcamPosition,
    canvasSize: { height, width },
    displayLayout,
  });

  const postprocessed = useMemo(() => {
    return data
      ? postprocessSubtitles({
          subTypes: data,
          boxWidth: subsLayout.width,
          maxLines: 4,
          fontSize: getFontSize(canvasLayout),
        })
      : null;
  }, [canvasLayout, data, subsLayout.width]);

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
            displayLayout={displayLayout}
            shouldExit={shouldExit}
            subsBox={subsLayout}
          />
        );
      })}
    </AbsoluteFill>
  );
};
