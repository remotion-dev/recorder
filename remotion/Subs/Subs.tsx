import React, { useEffect, useState } from "react";
import type { StaticFile } from "remotion";
import { delayRender, continueRender } from "remotion";
import { AbsoluteFill } from "remotion";
import type { CanvasSize } from "../configuration";
import type { SubTypes } from "../sub-types";
import { SegmentComp } from "./Segment";

export const Subs: React.FC<{
  file: StaticFile;
  trimStart: number;
  canvasSize: CanvasSize;
}> = ({ file, trimStart, canvasSize }) => {
  const [data, setData] = useState<SubTypes | null>(null);
  const [handle] = useState(() => delayRender());

  useEffect(() => {
    fetch(file.src)
      .then((res) => res.json())
      .then((d) => {
        continueRender(handle);
        setData(d);
      });
  }, [file.src, handle]);

  if (!data) {
    return null;
  }

  return (
    <AbsoluteFill>
      {data.segments.map((segment, index) => {
        return (
          <SegmentComp
            key={segment.id}
            isLast={index === data.segments.length - 1}
            segment={segment}
            trimStart={trimStart}
            canvasSize={canvasSize}
          />
        );
      })}
    </AbsoluteFill>
  );
};
