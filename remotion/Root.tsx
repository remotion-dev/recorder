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
              type: "videoscene" as const,
              webcamPosition: "previous" as const,
              duration: null,
              transitionToNextScene: true,
              newChapter: "",
              startOffset: 0,
              stopChapteringAfterThis: false,
              music: "previous" as const,
              bRolls: [],
            },
          ],
          scenesAndMetadata: [],
          platform: "youtube" as const,
        }}
        calculateMetadata={calcMetadata}
      />
    </>
  );
};
