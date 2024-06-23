import React, { useMemo } from "react";
import { Sequence, useVideoConfig } from "remotion";
import { useCaptions } from "../../editor/captions-provider";
import { calculateSrt } from "../helpers/calculate-srt";
import { SrtPreviewLine } from "./SrtPreviewLine";

export const SrtPreview: React.FC<{
  startFrame: number;
}> = ({ startFrame }) => {
  const { fps } = useVideoConfig();
  const captions = useCaptions();

  const srt = useMemo(() => {
    return calculateSrt({
      whisperCppOutput: captions,
      startFrame,
    });
  }, [captions, startFrame]);

  return (
    <>
      {srt.map((segment, index) => {
        const durationInFrames =
          ((segment.lastTimestamp - segment.firstTimestamp) / 1000) * fps;
        const from = (segment.firstTimestamp / 1000) * fps;

        return (
          <Sequence
            key={index}
            durationInFrames={durationInFrames}
            from={from}
            showInTimeline={false}
            layout="none"
          >
            <SrtPreviewLine segment={segment} />
          </Sequence>
        );
      })}
    </>
  );
};
