import React, { useMemo } from "react";
import { useVideoConfig } from "remotion";
import { Cameras } from "../../../../config/scenes";
import { DeleteRecordingAction } from "./DeleteRecordingAction";

const gradientSteps = [
  0, 0.013, 0.049, 0.104, 0.175, 0.259, 0.352, 0.45, 0.55, 0.648, 0.741, 0.825,
  0.896, 0.951, 0.987,
];

const gradientOpacities = [
  0, 8.1, 15.5, 22.5, 29, 35.3, 41.2, 47.1, 52.9, 58.8, 64.7, 71, 77.5, 84.5,
  91.9,
];

const globalGradientOpacity = 1 / 0.8;

export const container: React.CSSProperties = {
  height: 130,
  backgroundImage: `linear-gradient(to bottom,${gradientSteps
    .map((g, i) => {
      return `hsla(0, 0%, 0%, ${g}) ${
        (gradientOpacities[i] as number) * globalGradientOpacity
      }%`;
    })
    .join(", ")}, hsl(0, 0%, 0%) 100%)`,
  bottom: 0,
  position: "absolute",
  justifyContent: "center",
  color: "white",
  display: "flex",
};

export const Actions: React.FC<{
  cameras: Cameras;
  sceneIndex: number;
}> = ({ cameras, sceneIndex }) => {
  const { width } = useVideoConfig();

  const style: React.CSSProperties = useMemo(() => {
    return { width, ...container };
  }, [width]);

  return (
    <div style={style}>
      <DeleteRecordingAction sceneIndex={sceneIndex} cameras={cameras} />
    </div>
  );
};
