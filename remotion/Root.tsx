import { Composition, staticFile } from "remotion";

import { All } from "./All";

import { calcMetadata } from "./calc-metadata";

import { fps, videoConf } from "./configuration";

import { Title } from "./scenes/Title";

export const Root = () => {
  return (
    <>
      <Composition
        component={Title}
        durationInFrames={100}
        fps={30}
        id="intro"
        width={1920}
        height={1080}
        defaultProps={{
          subtitle: "New in Remotion 4.0",
          title: "Render button",
          durationInFrames: 50,
        }}
      />
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        id="Day2"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "wide",
          prefix: "day2",
          scenesAndMetadata: [],
          scenes: [
            {
              type: "scene",
              webcamPosition: "bottom-left" as const,
              trimStart: 103,
              transitionToNextScene: false,
              music: "previous",
              duration: 800,
            },
            {
              type: "title",
              subtitle: "New in Remotion 4.0",
              title: "Visual editing",
              durationInFrames: 50,
              music: "previous",
            },
            {
              type: "scene",
              webcamPosition: "bottom-left" as const,
              trimStart: 60,
              transitionToNextScene: false,
              music: "previous",
              duration: 840,
            },
            {
              type: "scene",
              webcamPosition: "bottom-left" as const,
              trimStart: 76,
              transitionToNextScene: false,
              music: "previous",
              duration: 1922,
            },
            {
              type: "scene",
              webcamPosition: "bottom-left" as const,
              trimStart: 85,
              transitionToNextScene: false,
              music: "previous",
              duration: 1160,
            },
            {
              type: "scene",
              webcamPosition: "bottom-left" as const,
              trimStart: 320,
              transitionToNextScene: false,
              music: "previous",
              duration: 524,
            },
            {
              type: "scene",
              webcamPosition: "bottom-left" as const,
              trimStart: 25,
              transitionToNextScene: false,
              music: "previous",
              duration: 1286,
            },
            {
              type: "scene",
              webcamPosition: "bottom-left" as const,
              trimStart: 45,
              duration: 310,
              transitionToNextScene: false,
              music: "previous",
            },
            {
              type: "scene",
              webcamPosition: "bottom-left" as const,
              trimStart: 60,
              transitionToNextScene: false,
              music: "previous",
              duration: 1520,
            },
            {
              type: "scene",
              webcamPosition: "bottom-left" as const,
              trimStart: 108,
              transitionToNextScene: false,
              music: "previous",
              duration: 1381,
            },
            {
              type: "scene",
              webcamPosition: "bottom-left" as const,
              trimStart: 140,
              transitionToNextScene: false,
              music: "previous",
              duration: 1930,
            },
          ],
        }}
        calculateMetadata={calcMetadata}
      />
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        id="Day3"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "wide",
          prefix: "day3",
          scenes: [
            {
              type: "title",
              subtitle: "New in Remotion 4.0",
              title: "Render Button",
              durationInFrames: 50,
              music: "previous",
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
        id="Day4"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "wide",
          prefix: "day4",

          scenes: [
            {
              type: "title",
              title: "Data-driven videos",
              subtitle: "New in Remotion 4.0",
              durationInFrames: 50,
              music: "previous",
            },
            {
              type: "scene",
              webcamPosition: "top-left" as const,
              trimStart: 65,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 200,
              transitionToNextScene: false,
              music: "previous",
              duration: 1064,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 16,
              transitionToNextScene: false,
              music: "previous",
              duration: 1348,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 36,
              transitionToNextScene: false,
              music: "previous",
              duration: 833,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 60,
              transitionToNextScene: false,
              music: "previous",
              duration: 567,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 70,
              transitionToNextScene: false,
              music: "previous",
              duration: 971,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 65,
              transitionToNextScene: false,
              music: "previous",
              duration: 453,
              type: "scene",
            },
            {
              webcamPosition: "top-right" as const,
              trimStart: 53,
              transitionToNextScene: false,
              music: "previous",
              duration: 610,
              type: "scene",
            },
            {
              webcamPosition: "top-right" as const,
              trimStart: 23,
              transitionToNextScene: false,
              music: "previous",
              duration: 1387,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 220,
              transitionToNextScene: false,
              music: "previous",
              duration: 790,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 134,
              transitionToNextScene: false,
              music: "previous",
              duration: 2176,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 42,
              transitionToNextScene: false,
              music: "previous",
              duration: 1353,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 55,
              transitionToNextScene: false,
              music: "previous",
              duration: 530,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 65,
              transitionToNextScene: false,
              music: "previous",
              duration: 1810,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 45,
              transitionToNextScene: false,
              music: "previous",
              duration: 471,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 35,
              transitionToNextScene: false,
              music: "previous",
              duration: 1390,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 65,
              transitionToNextScene: false,
              music: "previous",
              duration: 2555,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 45,
              transitionToNextScene: false,
              music: "previous",
              duration: 1195,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 35,
              transitionToNextScene: false,
              music: "previous",
              duration: 1005,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 80,
              transitionToNextScene: false,
              music: "previous",
              duration: 442,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 104,
              transitionToNextScene: false,
              music: "previous",
              duration: 842,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 105,
              transitionToNextScene: false,
              music: "previous",
              duration: 1700,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 67,
              transitionToNextScene: false,
              music: "previous",
              duration: 574,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 59,
              transitionToNextScene: false,
              music: "previous",
              duration: 1229,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 89,
              transitionToNextScene: false,
              music: "previous",
              duration: 500,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 50,
              transitionToNextScene: false,
              music: "previous",
              duration: 993,
              type: "scene",
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
        id="Day5"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "wide",
          prefix: "day5",

          scenes: [
            {
              type: "title",
              title: "Last but not least",
              subtitle: "New in Remotion 4.0",
              durationInFrames: 50,
              music: "previous",
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 45,
              transitionToNextScene: false,
              music: "previous",
              duration: 530,
              type: "scene",
            },
            {
              type: "title",
              title: "PDF and WebP export",
              subtitle: null,
              durationInFrames: 50,
              music: "previous",
            },
            {
              webcamPosition: "top-right" as const,
              trimStart: 230,
              transitionToNextScene: false,
              music: "previous",
              duration: 830,
              type: "scene",
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 27,
              transitionToNextScene: false,
              music: "previous",
              duration: 1020,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 37,
              transitionToNextScene: false,
              music: "previous",
              duration: 124,
              type: "scene",
            },
            {
              webcamPosition: "top-right" as const,
              trimStart: 35,
              transitionToNextScene: false,
              music: "previous",
              duration: 531,
              type: "scene",
            },
            {
              type: "title",
              title: "Better debug logging",
              subtitle: null,
              durationInFrames: 50,
              music: "previous",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 106,
              transitionToNextScene: false,
              music: "previous",
              duration: 997,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 33,
              transitionToNextScene: false,
              music: "previous",
              duration: 450,
              type: "scene",
            },
            {
              type: "title",
              title: "Smaller and built-in FFmpeg",
              subtitle: null,
              durationInFrames: 50,
              music: "previous",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 114,
              transitionToNextScene: false,
              music: "previous",
              duration: 1703,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 110,
              transitionToNextScene: false,
              music: "previous",
              duration: 1522,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 144,
              transitionToNextScene: false,
              music: "previous",
              duration: 816,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 20,
              transitionToNextScene: false,
              music: "previous",
              duration: 280,
              type: "scene",
            },
            {
              type: "title",
              title: "selectComposition()",
              subtitle: null,
              durationInFrames: 50,
              music: "previous",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 40,
              transitionToNextScene: false,
              music: "previous",
              duration: 810,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 43,
              transitionToNextScene: false,
              music: "previous",
              duration: 1460,
              type: "scene",
            },
            {
              type: "title",
              title: "Updated TTS template",
              subtitle: null,
              durationInFrames: 50,
              music: "previous",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 52,
              transitionToNextScene: false,
              music: "previous",
              duration: 1750,
              type: "scene",
            },
            {
              type: "title",
              title: "DX Polish",
              subtitle: null,
              durationInFrames: 50,
              music: "previous",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 24,
              transitionToNextScene: false,
              music: "previous",
              duration: 1864,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 24,
              transitionToNextScene: false,
              music: "previous",
              duration: 834,
              type: "scene",
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
        id="bts"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "wide",
          prefix: "bts",

          scenes: [
            {
              type: "title",
              title: "Behind the scenes",
              subtitle: "Remotion 4.0 Launch Week",
              durationInFrames: 50,
              music: "previous",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 42,
              transitionToNextScene: false,
              music: "previous",
              duration: 2619,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 58,
              transitionToNextScene: false,
              music: "previous",
              duration: 2949,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 56,
              transitionToNextScene: false,
              music: "previous",
              duration: 3310,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 45,
              transitionToNextScene: false,
              music: "previous",
              duration: 1657,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 54,
              transitionToNextScene: false,
              music: "previous",
              duration: 1795,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 149,
              transitionToNextScene: false,
              music: "previous",
              duration: 3416,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 75,
              transitionToNextScene: false,
              music: "previous",
              duration: 580,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 26,
              transitionToNextScene: false,
              music: "previous",
              duration: 702,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 93,
              transitionToNextScene: false,
              music: "previous",
              duration: 661,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
              type: "scene",
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
        id="asyncproblem"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "wide",
          prefix: "asyncproblem",

          scenes: [
            {
              webcamPosition: "previous" as const,
              trimStart: 40,
              transitionToNextScene: false,
              music: "previous",
              duration: 609,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 60,
              transitionToNextScene: false,
              music: "previous",
              duration: 2871,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 36,
              transitionToNextScene: false,
              music: "previous",
              duration: 1743,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 80,
              transitionToNextScene: false,
              music: "previous",
              duration: 1980,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 50,
              transitionToNextScene: false,
              music: "previous",
              duration: 1460,
              type: "scene",
            },
            {
              webcamPosition: "previous" as const,
              trimStart: 40,
              transitionToNextScene: false,
              music: "previous",
              duration: 263,
              type: "scene",
            },
          ],
          scenesAndMetadata: [],
        }}
        calculateMetadata={calcMetadata}
      />{" "}
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        id="july"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "wide",
          prefix: "july",

          scenes: [
            {
              webcamPosition: "previous" as const,
              trimStart: 107,
              transitionToNextScene: false,
              music: "previous",
              duration: 290,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 40,
              transitionToNextScene: false,
              music: "previous",
              duration: 550,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 111,
              transitionToNextScene: false,
              music: "previous",
              duration: 1776,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 105,
              transitionToNextScene: false,
              music: "previous",
              duration: 748,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 30,
              transitionToNextScene: false,
              music: "previous",
              duration: 200,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 100,
              transitionToNextScene: false,
              music: "previous",
              duration: 1305,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 37,
              transitionToNextScene: false,
              music: "previous",
              duration: 670,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 58,
              transitionToNextScene: false,
              music: "previous",
              duration: 1534,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 60,
              transitionToNextScene: false,
              music: "previous",
              duration: 2244,
              type: "scene",
            },
            {
              webcamPosition: "previous" as const,
              trimStart: 40,
              transitionToNextScene: false,
              music: "previous",
              duration: 551,
              type: "scene",
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
        id="saas-inflation"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "wide",
          prefix: "saas-inflation",

          scenes: [
            {
              webcamPosition: "previous" as const,
              trimStart: 47,
              transitionToNextScene: false,
              music: "previous",
              duration: 677,
              type: "scene",
            },
            {
              webcamPosition: "previous" as const,
              trimStart: 50,
              transitionToNextScene: false,
              music: "previous",
              duration: 528,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 60,
              transitionToNextScene: false,
              music: "previous",
              duration: 1444,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 30,
              transitionToNextScene: false,
              music: "previous",
              duration: 913,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 45,
              transitionToNextScene: false,
              music: "previous",
              duration: 841,
              type: "scene",
            },
            {
              webcamPosition: "previous" as const,
              trimStart: 38,
              transitionToNextScene: false,
              music: "previous",
              duration: 174,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 75,
              transitionToNextScene: false,
              music: "previous",
              duration: 2371,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 60,
              transitionToNextScene: false,
              music: "previous",
              duration: 1150,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 44,
              transitionToNextScene: false,
              music: "previous",
              duration: 1305,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 39,
              transitionToNextScene: false,
              music: "previous",
              duration: 247,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 30,
              transitionToNextScene: false,
              music: "previous",
              duration: 688,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 200,
              transitionToNextScene: false,
              music: "previous",
              duration: 664,
              type: "scene",
            },
            {
              webcamPosition: "top-right" as const,
              trimStart: 65,
              transitionToNextScene: false,
              music: "previous",
              duration: 2034,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 20,
              transitionToNextScene: false,
              music: "previous",
              duration: 666,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 90,
              transitionToNextScene: false,
              music: "previous",
              duration: 1314,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 50,
              transitionToNextScene: false,
              music: "previous",
              duration: 510,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 34,
              transitionToNextScene: false,
              music: "previous",
              duration: 362,
              type: "scene",
            },
            {
              webcamPosition: "previous" as const,
              trimStart: 73,
              transitionToNextScene: false,
              music: "previous",
              duration: 1280,
              type: "scene",
            },
            {
              webcamPosition: "previous" as const,
              trimStart: 54,
              transitionToNextScene: false,
              music: "previous",
              duration: 530,
              type: "scene",
            },
            {
              webcamPosition: "previous" as const,
              trimStart: 110,
              transitionToNextScene: false,
              music: "previous",
              duration: 635,
              type: "scene",
            },
          ],
          scenesAndMetadata: [],
        }}
        calculateMetadata={calcMetadata}
      />{" "}
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        id="get-silent-parts"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "wide",
          prefix: "get-silent-parts",

          scenes: [
            {
              type: "scene" as const,
              webcamPosition: "previous" as const,
              trimStart: 110,
              transitionToNextScene: false,
              music: "previous",
              duration: 165,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 60,
              transitionToNextScene: false,
              music: "previous",
              duration: 350,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 20,
              transitionToNextScene: false,
              music: "previous",
              duration: 795,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 20,
              transitionToNextScene: false,
              music: "previous",
              duration: 931,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 20,
              transitionToNextScene: false,
              music: "previous",
              duration: 302,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 146,
              transitionToNextScene: false,
              music: "previous",
              duration: 609,
            },
            {
              type: "scene" as const,
              webcamPosition: "previous" as const,
              trimStart: 50,
              transitionToNextScene: false,
              music: "previous",
              duration: 429,
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
        id="lambda-setup"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "wide",
          prefix: "lambda-setup",

          scenes: [
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 96,
              transitionToNextScene: false,
              music: "previous",
              duration: 952,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 27,
              transitionToNextScene: false,
              music: "previous",
              duration: 1565,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 70,
              transitionToNextScene: false,
              music: "previous",
              duration: 2331,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 30,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 32,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 70,
              transitionToNextScene: false,
              music: "previous",
              duration: 1657,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 70,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 40,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 25,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "previous" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
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
        id="lambda-rendering"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "wide",
          prefix: "lambda-rendering",

          scenes: [
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 35,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
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
        id="lambda-debugging"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "wide",
          prefix: "lambda-debugging",

          scenes: [
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "title" as const,
              title: "Errors to look out for",
              subtitle: "Debugging",
              durationInFrames: 50,
              music: "previous",
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 28,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 20,
              transitionToNextScene: false,
              music: "previous",
              duration: 413,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
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
        id="dvd"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "square" as const,
          prefix: "dvd",
          scenes: [
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              duration: 120,
              transitionToNextScene: false,
              music: "dancelikemike" as const,
            },
            {
              type: "title" as const,
              title: "DVD animation",
              subtitle: "Remotion tutorials",
              durationInFrames: 50,
              music: "previous",
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 30,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: 120,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },

            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: 115,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              transitionToNextScene: false,
              music: "previous",
              duration: null,
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
        id="dvd-2"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "tall" as const,
          prefix: "dvd-2",
          scenes: [
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "dancelikemike" as const,
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
              webcamPosition: "top-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
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
        id="million"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "wide" as const,
          prefix: "million",
          scenes: [
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "euphoric" as const,
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
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "weird" as const,
            },
            {
              type: "titlecard" as const,
              durationInFrames: 150,
              title: "Is Million.js legit?",
              music: "previous" as const,
              image: staticFile("thumbnails/ismillionjslegit.png"),
              youTubePlug: false,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "none" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "soft" as const,
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
              transitionToNextScene: false,
              music: "none" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "none" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "weird" as const,
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
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "previous" as const,
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
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "soft" as const,
            },
            {
              type: "endcard" as const,
              durationInFrames: 200,
              music: "previous" as const,
              channel: "jonny",
              platform: "x" as const,
              links: [],
            },
          ],
          scenesAndMetadata: [],
        }}
        calculateMetadata={calcMetadata}
      />{" "}
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        id="scope"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "square" as const,
          prefix: "scope",
          scenes: [
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "none" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "none" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "none" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "none" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "none" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "none" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "none" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "none" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "none" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "none" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "none" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "none" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "none" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "none" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "none" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "none" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "none" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: 1590,
              transitionToNextScene: false,
              music: "none" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "none" as const,
            },
            {
              type: "endcard" as const,
              durationInFrames: 300,
              music: "soft" as const,
              channel: "jonny" as const,
              platform: "x" as const,
              links: [],
            },
          ],
          scenesAndMetadata: [],
        }}
        calculateMetadata={calcMetadata}
      />{" "}
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        id="uber-for-coding"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "square" as const,
          prefix: "uber-for-coding",
          scenes: [
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "previous" as const,
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
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "previous" as const,
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
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "epic" as const,
            },
            {
              type: "titlecard" as const,
              durationInFrames: 100,
              title: "Uber for coding",
              music: "previous" as const,
              image: staticFile("thumbnails/uberforcoding.png"),
              youTubePlug: false,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "none" as const,
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
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "previous" as const,
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
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: 646,
              transitionToNextScene: false,
              music: "previous" as const,
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
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "previous" as const,
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
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "previous" as const,
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
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "previous" as const,
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
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "previous" as const,
            },
          ],
          scenesAndMetadata: [],
        }}
        calculateMetadata={calcMetadata}
      />{" "}
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        id="rome"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "square" as const,
          prefix: "rome",
          scenes: [
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "previous" as const,
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
              type: "titlecard" as const,
              durationInFrames: 100,
              image: staticFile("thumbnails/rome.png"),
              music: "previous" as const,
              title: "R.I.P Rome",
              youTubePlug: false,
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
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              music: "previous" as const,
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
              webcamPosition: "top-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "previous" as const,
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
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "previous" as const,
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
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "previous" as const,
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
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              music: "previous" as const,
            },
            {
              type: "endcard" as const,
              durationInFrames: 100,
              music: "previous" as const,
              channel: "jonny" as const,
              platform: "x" as const,
              links: [],
            },
          ],
          scenesAndMetadata: [],
        }}
        calculateMetadata={calcMetadata}
      />{" "}
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        id="karaoketeaser"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "wide",
          prefix: "karaoketeaser",
          scenesAndMetadata: [],
          scenes: [],
        }}
        calculateMetadata={calcMetadata}
      />{" "}
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        id="augustupdate"
        schema={videoConf}
        defaultProps={{
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
      />{" "}
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        id="bunbun"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "square" as const,
          prefix: "bunbun",
          scenes: [
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 40,
              duration: 285,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
          ],
          scenesAndMetadata: [],
        }}
        calculateMetadata={calcMetadata}
      />{" "}
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        id="davinci"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "square" as const,
          prefix: "davinci",
          scenes: [
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "endcard" as const,
              durationInFrames: 400,
              music: "soft" as const,
              channel: "jonny" as const,
              platform: "x" as const,
              links: [],
            },
          ],
          scenesAndMetadata: [],
        }}
        calculateMetadata={calcMetadata}
      />{" "}
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        id="september"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "square" as const,
          prefix: "september",
          scenes: [
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "remotionupdate" as const,
              durationInFrames: 100,
              music: "dancelikemike" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              newChapter: "Asset previews",
              stopChapteringAfterThis: false,
              music: "none" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              newChapter: "Bugfix notifications",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "Bun support",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              newChapter: "Auto-clean S3 bucket",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              newChapter: "Important SSR fixes",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              newChapter: "Hacktoberfest",
              stopChapteringAfterThis: true,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "endcard" as const,
              durationInFrames: 100,
              music: "soft" as const,
              channel: "remotion" as const,
              platform: "x" as const,
              links: [],
            },
          ],
          scenesAndMetadata: [],
        }}
        calculateMetadata={calcMetadata}
      />{" "}
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        id="handoff"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "square" as const,
          prefix: "handoff",
          scenes: [
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "endcard" as const,
              durationInFrames: 100,
              music: "previous" as const,
              channel: "jonny" as const,
              platform: "x" as const,
              links: [],
            },
          ],
          scenesAndMetadata: [],
        }}
        calculateMetadata={calcMetadata}
      />{" "}
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        id="pro"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "square" as const,
          prefix: "pro",
          scenes: [
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "endcard" as const,
              durationInFrames: 200,
              music: "previous" as const,
              channel: "jonny" as const,
              platform: "x" as const,
              links: [
                { link: "remotion.pro" },
                { link: "remotion.dev/shapes" },
              ],
            },
          ],
          scenesAndMetadata: [],
        }}
        calculateMetadata={calcMetadata}
      />{" "}
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        id="court"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "wide",
          prefix: "court",
          scenesAndMetadata: [],
          scenes: [],
        }}
        calculateMetadata={calcMetadata}
      />{" "}
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        id="betray"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "square" as const,
          prefix: "betray",
          scenes: [
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              duration: 907,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: 800,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "endcard" as const,
              durationInFrames: 200,
              music: "previous" as const,
              channel: "jonny" as const,
              platform: "x" as const,
              links: [{ link: "link.jonny.io/vice-redhat" }],
            },
          ],
          scenesAndMetadata: [],
        }}
        calculateMetadata={calcMetadata}
      />{" "}
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        id="transitions"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "square" as const,
          prefix: "transitions",
          scenes: [
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "tableofcontents" as const,
              music: "previous" as const,
              durationInFrames: 110,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              newChapter: "Getting started",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "Durations",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "Enter + Exit",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "Hard cuts",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "Nesting",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "Programmatic transitions",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "Presentations",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "Custom presentations",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "Timings",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "Custom timings",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "Audio cues",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "Example project",
              stopChapteringAfterThis: true,
              music: "previous" as const,
            },
            {
              type: "endcard" as const,
              durationInFrames: 200,
              music: "previous" as const,
              channel: "jonny" as const,
              platform: "youtube" as const,
              links: [{ link: "remotion.dev/transitions" }],
            },
          ],
          scenesAndMetadata: [],
        }}
        calculateMetadata={calcMetadata}
      />{" "}
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        id="mistakes"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "wide" as const,
          prefix: "mistakes",
          scenes: [
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: true,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
            {
              type: "endcard" as const,
              durationInFrames: 200,
              music: "previous" as const,
              channel: "remotion" as const,
              platform: "x" as const,
              links: [{ link: "remotion.dev/docs/flickering" }],
            },
          ],
          scenesAndMetadata: [],
        }}
        calculateMetadata={calcMetadata}
      />{" "}
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        id="empty"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "wide",
          prefix: "empty",
          scenesAndMetadata: [],
          scenes: [],
        }}
        calculateMetadata={calcMetadata}
      />{" "}
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        id="test"
        schema={videoConf}
        defaultProps={{
          canvasLayout: "square" as const,
          prefix: "test",
          scenes: [
            {
              type: "scene" as const,
              webcamPosition: "previous" as const,
              trimStart: 0,
              duration: null,
              transitionToNextScene: false,
              newChapter: "",
              stopChapteringAfterThis: false,
              music: "previous" as const,
            },
          ],
          scenesAndMetadata: [],
        }}
        calculateMetadata={calcMetadata}
      />{" "}
    </>
  );
};
