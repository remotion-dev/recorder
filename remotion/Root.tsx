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
        id="augustupdate"
        schema={videoConf}
        defaultProps={{
          theme: "light",
          canvasLayout: "square" as const,
          scenes: [
            {
              type: "videoscene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "soft" as const,
            },
            {
              type: "remotionupdate" as const,
              durationInFrames: 100,
              music: "previous" as const,
            },
            {
              type: "videoscene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
              newChapter: "Next.js template",
            },
            {
              type: "videoscene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "previous" as const,
              newChapter: "Image sequences",
            },
            {
              type: "videoscene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
            },
            {
              type: "videoscene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
              newChapter: "Stills to clipboard",
            },
            {
              type: "videoscene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
              newChapter: "Title bar progress",
            },
            {
              type: "videoscene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
              newChapter: "getRemotionEnvironment()",
            },
            {
              type: "videoscene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
              newChapter: "getSilentParts()",
            },
            {
              type: "videoscene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
              newChapter: "Get codec and colorspace",
            },
            {
              type: "videoscene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
              newChapter: "x264 presets",
            },
            {
              type: "videoscene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
              newChapter: "Auto-install Chrome",
            },
            {
              type: "videoscene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "previous" as const,
              newChapter: "Custom webhook data",
            },
            {
              type: "videoscene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
              newChapter: "Lambda tutorial",
            },
            {
              type: "videoscene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "epic" as const,
              newChapter: "Cloud Run update",
              stopChapteringAfterThis: true,
            },
            {
              type: "videoscene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "previous" as const,
            },
            {
              type: "endcard" as const,
              durationInFrames: 200,
              music: "previous" as const,
              channel: "remotion" as const,
              platform: "x" as const,
              links: [],
            },
          ],
          scenesAndMetadata: [],
        }}
        calculateMetadata={calcMetadata}
      />
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        id="test"
        schema={videoConf}
        defaultProps={{
          theme: "light" as const,
          canvasLayout: "square" as const,
          scenes: [
            {
              type: "title" as const,
              title: "My Test Video",
              subtitle: "Subtitle ",
              durationInFrames: 50,
              music: "none" as const,
            },
            {
              type: "videoscene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: 323,
              transitionToNextScene: false,
              newChapter: "Chapter 1",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
          ],
          scenesAndMetadata: [],
        }}
        calculateMetadata={calcMetadata}
      />
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        id="january"
        schema={videoConf}
        defaultProps={{
          theme: "light" as const,
          canvasLayout: "landscape" as const,
          scenes: [
            {
              type: "videoscene" as const,
              webcamPosition: "previous" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "videoscene" as const,
              webcamPosition: "previous" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "Deployable Studio",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "videoscene" as const,
              webcamPosition: "previous" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "videoscene" as const,
              webcamPosition: "previous" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "makeTransform()",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "videoscene" as const,
              webcamPosition: "previous" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "interpolateStyles()",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "videoscene" as const,
              webcamPosition: "previous" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "fitText()",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "videoscene" as const,
              webcamPosition: "previous" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "Better GIFs",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "videoscene" as const,
              webcamPosition: "previous" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "New transitions",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "videoscene" as const,
              webcamPosition: "previous" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "Better Props editor",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "videoscene" as const,
              webcamPosition: "previous" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "Better timeline",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "videoscene" as const,
              webcamPosition: "previous" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "HDR videos",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "videoscene" as const,
              webcamPosition: "previous" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "--repro",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "videoscene" as const,
              webcamPosition: "previous" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "Jump to frame",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "videoscene" as const,
              webcamPosition: "previous" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "Open GitHub",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "videoscene" as const,
              webcamPosition: "previous" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "Beep on finish",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "videoscene" as const,
              webcamPosition: "previous" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "Measure elements",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "videoscene" as const,
              webcamPosition: "previous" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "Remotion.pro Update",
              stopChapteringAfterThis: true,
              music: "previous" as const,
            },
            {
              type: "videoscene" as const,
              webcamPosition: "previous" as const,
              trimStart: 0,
              duration: 1314,
              transitionToNextScene: true,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "videoscene" as const,
              webcamPosition: "previous" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "endcard" as const,
              durationInFrames: 200,
              music: "soft" as const,
              channel: "remotion" as const,
              platform: "youtube" as const,
              links: [],
            },
          ],
          scenesAndMetadata: [],
        }}
        calculateMetadata={calcMetadata}
      />
    </>
  );
};
