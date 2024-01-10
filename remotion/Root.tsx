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
          prefix: "augustupdate",
          scenes: [
            {
              type: "scene" as const,
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
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
              newChapter: "Next.js template",
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "previous" as const,
              newChapter: "Image sequences",
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
              newChapter: "Stills to clipboard",
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
              newChapter: "Title bar progress",
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
              newChapter: "getRemotionEnvironment()",
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
              newChapter: "getSilentParts()",
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
              newChapter: "Get codec and colorspace",
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
              newChapter: "x264 presets",
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
              newChapter: "Auto-install Chrome",
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "previous" as const,
              newChapter: "Custom webhook data",
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
              newChapter: "Lambda tutorial",
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "epic" as const,
              newChapter: "Cloud Run update",
              stopChapteringAfterThis: true,
            },
            {
              type: "scene" as const,
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
          prefix: "test",
          scenes: [
            {
              type: "title" as const,
              title: "My Test Video",
              subtitle: "Subtitle ",
              durationInFrames: 50,
              music: "none" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: 323,
              transitionToNextScene: false,
              newChapter: "Chapter 1",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
              newChapter: "Next.js template",
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "previous" as const,
              newChapter: "Image sequences",
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
              newChapter: "Stills to clipboard",
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
              newChapter: "Title bar progress",
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
              newChapter: "getRemotionEnvironment()",
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
              newChapter: "getSilentParts()",
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
              newChapter: "Get codec and colorspace",
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
              newChapter: "x264 presets",
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
              newChapter: "Auto-install Chrome",
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "previous" as const,
              newChapter: "Custom webhook data",
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
              newChapter: "Lambda tutorial",
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "epic" as const,
              newChapter: "Cloud Run update",
              stopChapteringAfterThis: true,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "previous" as const,
              newChapter: "some new chapter",
            },
          ],
          scenesAndMetadata: [],
        }}
        calculateMetadata={calcMetadata}
      />
    </>
  );
};
