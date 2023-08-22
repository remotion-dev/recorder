import React, { useEffect, useState } from "react";
import type { StaticFile } from "remotion";
import { interpolate } from "remotion";
import { useVideoConfig } from "remotion";
import { delayRender, continueRender } from "remotion";
import { AbsoluteFill } from "remotion";
import { getSubtitleTranslation } from "../animations/camera-scene-transitions";
import type { CanvasLayout, WebcamPosition } from "../configuration";
import type { Layout } from "../layout/get-layout";
import type { SubTypes } from "../sub-types";
import { postprocessSubtitles } from "./postprocess-subs";
import { SegmentComp } from "./Segment";

export const Subs: React.FC<{
  file: StaticFile;
  trimStart: number;
  canvasLayout: CanvasLayout;
  displayLayout: Layout | null;
  webcamPosition: WebcamPosition;
  webcamLayout: Layout;
  enter: number;
  exit: number;
}> = ({
  file,
  trimStart,
  canvasLayout,
  displayLayout,
  webcamPosition,
  webcamLayout,
  enter,
  exit,
}) => {
  const [data, setData] = useState<SubTypes | null>(null);
  const { width, height } = useVideoConfig();
  const [handle] = useState(() => delayRender());

  useEffect(() => {
    fetch(file.src)
      .then((res) => res.json())
      .then((d) => {
        continueRender(handle);
        setData(postprocessSubtitles(d));
      });
  }, [file.src, handle]);

  if (!data) {
    return null;
  }

  const subtitleTranslation = getSubtitleTranslation({
    enter,
    exit,
    height,
    webcamPosition,
    width,
  });

  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${subtitleTranslation.translationX}px) translateY(${subtitleTranslation.translationY}px)`,
      }}
    >
      {data.segments.map((segment, index) => {
        return (
          <SegmentComp
            key={segment.id}
            webcamPosition={webcamPosition}
            isLast={index === data.segments.length - 1}
            segment={segment}
            trimStart={trimStart}
            canvasLayout={canvasLayout}
            webcamLayout={webcamLayout}
            canvasSize={{ width, height }}
            displayLayout={displayLayout}
          />
        );
      })}
    </AbsoluteFill>
  );
};
