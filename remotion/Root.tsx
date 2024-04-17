import { Composition } from "remotion";
import { videoConf } from "../config/scenes";
import { calcMetadata } from "./calc-metadata";
import { Main } from "./Main";

export const Root = () => {
  return (
    <>
      <Composition
        component={Main}
        id="welcome"
        schema={videoConf}
        defaultProps={{
          theme: "light" as const,
          canvasLayout: "square" as const,
          scenes: [],
          scenesAndMetadata: [],
          platform: "youtube",
        }}
        calculateMetadata={calcMetadata}
      />
      <Composition
        component={Main}
        id="empty"
        schema={videoConf}
        defaultProps={{
          theme: "light" as const,
          canvasLayout: "square" as const,
          platform: "youtube",
          scenes: [],
          scenesAndMetadata: [],
        }}
        calculateMetadata={calcMetadata}
      />
      <Composition
        component={Main}
        id="test-folder"
        schema={videoConf}
        defaultProps={{
          theme: "light" as const,
          canvasLayout: "square" as const,
          scenes: [
            {
              type: "title" as const,
              title: "",
              subtitle: "",
              durationInFrames: 50,
              transitionToNextScene: true,
              music: "previous" as const,
            },
          ],
          scenesAndMetadata: [],
          platform: "youtube",
        }}
        calculateMetadata={calcMetadata}
      />
    </>
  );
};
