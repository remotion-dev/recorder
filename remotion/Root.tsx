import React from "react";
import { Composition } from "remotion";
import {
  fps,
  getPairs,
  introDuration,
  SceneMetadata,
  videoConf,
} from "./configuration";
import { All } from "./All";
import { getVideoMetadata } from "@remotion/media-utils";
import { Intro } from "./Intro";
import { calcMetadata } from "./calc-metadata";

export const Root = () => {
  return (
    <>
      <Composition
        component={Intro}
        durationInFrames={100}
        fps={30}
        height={1080}
        width={1920}
        id="intro"
        defaultProps={{
          subtitle: "New in Remotion 4.0",
          title: "Render button",
        }}
      ></Composition>
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        height={1080}
        width={1920}
        id="Day2"
        schema={videoConf}
        defaultProps={{
          prefix: "day2",
          subtitle: "New in Remotion 4.0",
          title: "Visual editing",
          scenes: [
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 103,
              duration: 800,
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 60,
              duration: 840,
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 76,
              duration: 1922,
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 85,
              duration: 1160,
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 320,
              duration: 524,
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 25,
              duration: 1286,
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 45,
              duration: 310,
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 60,
              duration: 1520,
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 108,
              duration: 1381,
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 140,
              duration: 1930,
            },
          ],
          metadata: [],
          pairs: [],
        }}
        calculateMetadata={calcMetadata}
      ></Composition>
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        height={1080}
        width={1920}
        id="Day3"
        schema={videoConf}
        defaultProps={{
          prefix: "day3",
          subtitle: "New in Remotion 4.0",
          title: "Render Button",
          scenes: [],
          metadata: [],
          pairs: [],
        }}
        calculateMetadata={calcMetadata}
      ></Composition>
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        height={1080}
        width={1920}
        id="Day4"
        schema={videoConf}
        defaultProps={{
          prefix: "day4",
          subtitle: "New in Remotion 4.0",
          title: "Data-driven videos",
          scenes: [
            {
              webcamPosition: "top-left" as const,
              trimStart: 65,
              duration: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 200,
              duration: 1064,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 16,
              duration: 1348,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 36,
              duration: 833,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 60,
              duration: 567,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 70,
              duration: 971,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 65,
              duration: 453,
            },
            {
              webcamPosition: "top-right" as const,
              trimStart: 53,
              duration: 610,
            },
            {
              webcamPosition: "top-right" as const,
              trimStart: 23,
              duration: 1387,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 220,
              duration: 790,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 134,
              duration: 2176,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 42,
              duration: 1353,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 55,
              duration: 530,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 65,
              duration: 1810,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 45,
              duration: 471,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 35,
              duration: 1390,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 65,
              duration: 2555,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 45,
              duration: 1195,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 35,
              duration: 1005,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 80,
              duration: 442,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 104,
              duration: 842,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 105,
              duration: 1700,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 67,
              duration: 574,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 59,
              duration: 1229,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 89,
              duration: 500,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 50,
              duration: 993,
            },
          ],
          metadata: [],
          pairs: [],
        }}
        calculateMetadata={calcMetadata}
      ></Composition>
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        height={1080}
        width={1920}
        id="Day5"
        schema={videoConf}
        defaultProps={{
          prefix: "day5",
          subtitle: "New in Remotion 4.0",
          title: "Last but not least",
          scenes: [
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
            },
          ],
          metadata: [],
          pairs: [],
        }}
        calculateMetadata={calcMetadata}
      ></Composition>
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        height={1080}
        width={1920}
        id="bts"
        schema={videoConf}
        defaultProps={{
          prefix: "bts",
          subtitle: "New in Remotion 4.0",
          title: "Behind the scenes",
          scenes: [
            {
              webcamPosition: "top-left" as const,
              trimStart: 42,
              duration: 2619,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 58,
              duration: 2949,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 55,
              duration: 3310,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 45,
              duration: 1657,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 54,
              duration: 1780,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 149,
              duration: 3416,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: 2329,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 26,
              duration: 702,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 62,
              duration: 661,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
          ],
          metadata: [],
          pairs: [],
        }}
        calculateMetadata={calcMetadata}
      ></Composition>
    </>
  );
};
