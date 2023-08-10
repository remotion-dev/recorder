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
              type: "scene",
              webcamPosition: "bottom-left" as const,
              trimStart: 103,
              duration: 800,
            },
            {
              type: "title",
              subtitle: "New in Remotion 4.0",
              title: "Visual editing",
            },
            {
              type: "scene",
              webcamPosition: "bottom-left" as const,
              trimStart: 60,
              duration: 840,
            },
            {
              type: "scene",

              webcamPosition: "bottom-left" as const,
              trimStart: 76,
              duration: 1922,
            },
            {
              type: "scene",
              webcamPosition: "bottom-left" as const,
              trimStart: 85,
              duration: 1160,
            },
            {
              type: "scene",
              webcamPosition: "bottom-left" as const,
              trimStart: 320,
              duration: 524,
            },
            {
              type: "scene",
              webcamPosition: "bottom-left" as const,
              trimStart: 25,
              duration: 1286,
            },
            {
              type: "scene",
              webcamPosition: "bottom-left" as const,
              trimStart: 45,
              duration: 310,
            },
            {
              type: "scene",
              webcamPosition: "bottom-left" as const,
              trimStart: 60,
              duration: 1520,
            },
            {
              type: "scene",
              webcamPosition: "bottom-left" as const,
              trimStart: 108,
              duration: 1381,
            },
            {
              type: "scene",
              webcamPosition: "bottom-left" as const,
              trimStart: 140,
              duration: 1930,
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
              type: "title",
              subtitle: "New in Remotion 4.0",
              title: "Render Button",
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
              type: "title",
              title: "Data-driven videos",
              subtitle: "New in Remotion 4.0",
            },
            {
              type: "scene",
              webcamPosition: "top-left" as const,
              trimStart: 65,
              duration: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 200,
              duration: 1064,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 16,
              duration: 1348,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 36,
              duration: 833,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 60,
              duration: 567,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 70,
              duration: 971,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 65,
              duration: 453,
              type: "scene",
            },
            {
              webcamPosition: "top-right" as const,
              trimStart: 53,
              duration: 610,
              type: "scene",
            },
            {
              webcamPosition: "top-right" as const,
              trimStart: 23,
              duration: 1387,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 220,
              duration: 790,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 134,
              duration: 2176,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 42,
              duration: 1353,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 55,
              duration: 530,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 65,
              duration: 1810,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 45,
              duration: 471,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 35,
              duration: 1390,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 65,
              duration: 2555,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 45,
              duration: 1195,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 35,
              duration: 1005,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 80,
              duration: 442,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 104,
              duration: 842,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 105,
              duration: 1700,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 67,
              duration: 574,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 59,
              duration: 1229,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 89,
              duration: 500,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 50,
              duration: 993,
              type: "scene",
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
              type: "title",
              title: "Last but not least",
              subtitle: "New in Remotion 4.0",
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 45,
              duration: 530,
              type: "scene",
            },
            {
              type: "title",
              title: "PDF and WebP export",
              subtitle: null,
            },
            {
              webcamPosition: "top-right" as const,
              trimStart: 230,
              duration: 830,
              type: "scene",
            },
            {
              webcamPosition: "bottom-left" as const,
              trimStart: 27,
              duration: 1020,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 37,
              duration: 124,
              type: "scene",
            },
            {
              webcamPosition: "top-right" as const,
              trimStart: 35,
              duration: 531,
              type: "scene",
            },
            {
              type: "title",
              title: "Better debug logging",
              subtitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 106,
              duration: 997,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 33,
              duration: 450,
              type: "scene",
            },
            {
              type: "title",
              title: "Smaller and built-in FFmpeg",
              subtitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 114,
              duration: 1703,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 110,
              duration: 1522,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 144,
              duration: 816,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 20,
              duration: 280,
              type: "scene",
            },
            {
              type: "title",
              title: "selectComposition()",
              subtitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 40,
              duration: 810,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 43,
              duration: 1460,
              type: "scene",
            },
            {
              type: "title",
              title: "Updated TTS template",
              subtitle: null,
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 52,
              duration: 1750,
              type: "scene",
            },
            {
              type: "title",
              title: "DX Polish",
              subtitle: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 24,
              duration: 1864,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 24,
              duration: 834,
              type: "scene",
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
              type: "title",
              title: "Behind the scenes",
              subtitle: "Remotion 4.0 Launch Week",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 42,
              duration: 2619,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 58,
              duration: 2949,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 56,
              duration: 3310,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 45,
              duration: 1657,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 54,
              duration: 1795,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 149,
              duration: 3416,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 75,
              duration: 580,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 26,
              duration: 702,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 93,
              duration: 661,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
              type: "scene",
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
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 60,
              duration: 2871,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 36,
              duration: 1743,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 80,
              duration: 1980,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 50,
              duration: 1460,
              type: "scene",
            },
            {
              webcamPosition: "center" as const,
              trimStart: 40,
              duration: 263,
              type: "scene",
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
              trimStart: 107,
              duration: 290,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 40,
              duration: 550,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 111,
              duration: 1776,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 105,
              duration: 748,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 30,
              duration: 200,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 100,
              duration: 1305,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 37,
              duration: 670,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 58,
              duration: 1534,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 60,
              duration: 2244,
              type: "scene",
            },
            {
              webcamPosition: "center" as const,
              trimStart: 40,
              duration: 551,
              type: "scene",
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
              trimStart: 47,
              duration: 677,
              type: "scene",
            },
            {
              webcamPosition: "center" as const,
              trimStart: 50,
              duration: 528,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 60,
              duration: 1444,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 30,
              duration: 913,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 45,
              duration: 841,
              type: "scene",
            },
            {
              webcamPosition: "center" as const,
              trimStart: 38,
              duration: 174,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 75,
              duration: 2371,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 60,
              duration: 1150,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 44,
              duration: 1305,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 39,
              duration: 247,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 30,
              duration: 688,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 200,
              duration: 664,
              type: "scene",
            },
            {
              webcamPosition: "top-right" as const,
              trimStart: 65,
              duration: 2034,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 20,
              duration: 666,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 90,
              duration: 1314,
              type: "scene",
            },
            {
              webcamPosition: "top-left" as const,
              trimStart: 50,
              duration: 510,
              type: "scene",
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 34,
              duration: 362,
              type: "scene",
            },
            {
              webcamPosition: "center" as const,
              trimStart: 73,
              duration: 1280,
              type: "scene",
            },
            {
              webcamPosition: "center" as const,
              trimStart: 54,
              duration: 530,
              type: "scene",
            },
            {
              webcamPosition: "center" as const,
              trimStart: 110,
              duration: 635,
              type: "scene",
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
        id="get-silent-parts"
        schema={videoConf}
        defaultProps={{
          prefix: "get-silent-parts",
          scenes: [
            {
              type: "scene" as const,
              webcamPosition: "center" as const,
              trimStart: 110,
              duration: 165,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 60,
              duration: 350,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 20,
              duration: 795,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 20,
              duration: 931,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 20,
              duration: 302,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 146,
              duration: 609,
            },
            {
              type: "scene" as const,
              webcamPosition: "center" as const,
              trimStart: 50,
              duration: 429,
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
        id="lambda-setup"
        schema={videoConf}
        defaultProps={{
          prefix: "lambda-setup",
          scenes: [
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: 1750,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "center" as const,
              trimStart: 0,
              duration: null,
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
        id="lambda-rendering"
        schema={videoConf}
        defaultProps={{
          prefix: "lambda-rendering",
          scenes: [
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
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
        id="lambda-debugging"
        schema={videoConf}
        defaultProps={{
          prefix: "lambda-debugging",
          scenes: [
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "title" as const,
              title: "Errors to look out for",
              subtitle: "Debugging",
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
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
        id="dvd"
        schema={videoConf}
        defaultProps={{
          prefix: "dvd",
          scenes: [
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: 120,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-right" as const,
              trimStart: 30,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: 120,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: 115,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 60,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "bottom-left" as const,
              trimStart: 0,
              duration: null,
            },
            {
              type: "scene" as const,
              webcamPosition: "top-left" as const,
              trimStart: 0,
              duration: null,
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
        id="empty"
        schema={videoConf}
        defaultProps={{
          prefix: "empty",
          scenes: [],
          metadata: [],
          pairs: [],
        }}
        calculateMetadata={calcMetadata}
      />
    </>
  );
};
