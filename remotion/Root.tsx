import React from "react";
import { Composition } from "remotion";
import { fps, videoConf } from "./configuration";
import { All } from "./All";
import { Title } from "./Title";
import { calcMetadata } from "./calc-metadata";

export const Root = () => {
  return (
    <>
      <Composition
        component={Title}
        durationInFrames={100}
        fps={30}
        height={1080}
        width={1920}
        id="intro"
        defaultProps={{
          subtitle: "New in Remotion 4.0",
          title: "Render button",
        }}
      />
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
          scenes: [
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 103,
              duration: 800,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 103,
              duration: 800,
              isTitle: {
                subtitle: "New in Remotion 4.0",
                title: "Visual editing",
              },
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 60,
              duration: 840,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 76,
              duration: 1922,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 85,
              duration: 1160,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 320,
              duration: 524,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 25,
              duration: 1286,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 45,
              duration: 310,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 60,
              duration: 1520,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 108,
              duration: 1381,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 140,
              duration: 1930,
              isTitle: null,
            },
          ],
          metadata: [],
          pairs: [],
        }}
        calculateMetadata={calcMetadata}
      />
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
          scenes: [
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: 0,
              isTitle: {
                subtitle: "New in Remotion 4.0",
                title: "Render Button",
              },
            },
          ],
          metadata: [],
          pairs: [],
        }}
        calculateMetadata={calcMetadata}
      />
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
          scenes: [
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: 0,
              isTitle: {
                title: "Data-driven videos",
                subtitle: "New in Remotion 4.0",
              },
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 65,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 200,
              duration: 1064,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 16,
              duration: 1348,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 36,
              duration: 833,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 60,
              duration: 567,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 70,
              duration: 971,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 65,
              duration: 453,
              isTitle: null,
            },
            {
              webcamPosition: "top-right" as const,
              trimStart: 53,
              duration: 610,
              isTitle: null,
            },
            {
              webcamPosition: "top-right" as const,
              trimStart: 23,
              duration: 1387,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 220,
              duration: 790,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 134,
              duration: 2176,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 42,
              duration: 1353,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 55,
              duration: 530,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 65,
              duration: 1810,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 45,
              duration: 471,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 35,
              duration: 1390,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 65,
              duration: 2555,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 45,
              duration: 1195,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 35,
              duration: 1005,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 80,
              duration: 442,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 104,
              duration: 842,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 105,
              duration: 1700,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 67,
              duration: 574,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 59,
              duration: 1229,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 89,
              duration: 500,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 50,
              duration: 993,
              isTitle: null,
            },
          ],
          metadata: [],
          pairs: [],
        }}
        calculateMetadata={calcMetadata}
      />
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
          scenes: [
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: 0,
              isTitle: {
                title: "Last but not least",
                subtitle: "New in Remotion 4.0",
              },
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 45,
              duration: 530,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: 0,
              isTitle: { title: "PDF and WebP export", subtitle: null },
            },
            {
              webcamPosition: "top-right" as const,
              trimStart: 230,
              duration: 830,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 27,
              duration: 1020,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 37,
              duration: 124,
              isTitle: null,
            },
            {
              webcamPosition: "top-right" as const,
              trimStart: 35,
              duration: 531,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: 0,
              isTitle: { title: "Better debug logging", subtitle: null },
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 106,
              duration: 997,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 33,
              duration: 450,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: 0,
              isTitle: { title: "Smaller and built-in FFmpeg", subtitle: null },
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 114,
              duration: 1703,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 110,
              duration: 1522,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 144,
              duration: 816,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 20,
              duration: 280,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: 0,
              isTitle: { title: "selectComposition()", subtitle: null },
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 40,
              duration: 810,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 43,
              duration: 1460,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: 0,
              isTitle: { title: "Updated TTS template", subtitle: null },
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 52,
              duration: 1750,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: 0,
              isTitle: { title: "DX Polish", subtitle: null },
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 24,
              duration: 1864,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 24,
              duration: 834,
              isTitle: null,
            },
          ],
          metadata: [],
          pairs: [],
        }}
        calculateMetadata={calcMetadata}
      />
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
          scenes: [
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: 0,
              isTitle: {
                title: "Behind the scenes",
                subtitle: "Remotion 4.0 Launch Week",
              },
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 42,
              duration: 2619,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 58,
              duration: 2949,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 56,
              duration: 3310,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 45,
              duration: 1657,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 54,
              duration: 1795,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 149,
              duration: 3416,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 75,
              duration: 580,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 26,
              duration: 702,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 93,
              duration: 661,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
          ],
          metadata: [],
          pairs: [],
        }}
        calculateMetadata={calcMetadata}
      />
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        height={1080}
        width={1920}
        id="asyncproblem"
        schema={videoConf}
        defaultProps={{
          prefix: "asyncproblem",
          scenes: [
            {
              webcamPosition: "center" as const,
              trimStart: 40,
              duration: 609,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 60,
              duration: 2871,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 36,
              duration: 1743,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 80,
              duration: 1980,
              isTitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 50,
              duration: 1460,
              isTitle: null,
            },
            {
              webcamPosition: "center" as const,
              trimStart: 40,
              duration: 263,
              isTitle: null,
            },
          ],
          metadata: [],
          pairs: [],
        }}
        calculateMetadata={calcMetadata}
      />{" "}
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        height={1080}
        width={1920}
        id="july"
        schema={videoConf}
        defaultProps={{
          prefix: "july",
          scenes: [
            {
              webcamPosition: "center" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "center" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
          ],
          metadata: [],
          pairs: [],
        }}
        calculateMetadata={calcMetadata}
      />
      <Composition
        component={All}
        fps={fps}
        durationInFrames={100}
        height={1080}
        width={1920}
        id="saas-inflation"
        schema={videoConf}
        defaultProps={{
          prefix: "saas-inflation",
          scenes: [
            {
              webcamPosition: "center" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "center" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "center" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
            {
              webcamPosition: "center" as const,
              trimStart: 0,
              duration: null,
              isTitle: null,
            },
          ],
          metadata: [],
          pairs: [],
        }}
        calculateMetadata={calcMetadata}
      />
    </>
  );
};
