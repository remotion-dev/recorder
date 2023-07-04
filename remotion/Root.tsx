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
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
            },
            {
              webcamPosition: "bottom-right" as const,
              trimStart: 0,
              duration: null,
            },
            {
              webcamPosition: "bottom-right" as const,
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
          ],
          metadata: [],
          pairs: [],
        }}
        calculateMetadata={calcMetadata}
      ></Composition>
    </>
  );
};
