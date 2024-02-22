import { Composition } from "remotion";

import { All } from "./All";

import { calcMetadata } from "./calc-metadata";

import { fps, videoConf } from "./configuration";

export const Root = () => {
  return (
    <>
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        id="HelloWorld"
        schema={videoConf}
        defaultProps={{
          theme: "light" as const,
          canvasLayout: "square" as const,
          scenes: [],
          scenesAndMetadata: [],
        }}
        calculateMetadata={calcMetadata}
      />
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        id="Empty"
        schema={videoConf}
        defaultProps={{
          theme: "light" as const,
          canvasLayout: "square" as const,
          scenes: [],
          scenesAndMetadata: [],
        }}
        calculateMetadata={calcMetadata}
      />
    </>
  );
};
