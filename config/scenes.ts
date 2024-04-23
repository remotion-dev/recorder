import type { StaticFile } from "remotion";
import { staticFile } from "remotion";
import { z } from "zod";
import type { CameraSceneLayout } from "../remotion/layout/get-layout";
import { brand, linkType, platform } from "./endcard";
import type { Dimensions } from "./layout";
import { canvasLayout } from "./layout";
import { music } from "./sounds";
import { theme } from "./themes";

const availablePositions = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
] as const;

export type WebcamPosition = (typeof availablePositions)[number];
export type FinalWebcamPosition = WebcamPosition | "center";

const availablePositionsAndPrevious = [
  "previous",
  ...availablePositions,
] as const;

const bRoll = z.object({
  source: z.string().default(staticFile("sample-broll.jpg")),
  durationInFrames: z.number().int().default(90),
  from: z.number().int().default(30),
});

export type BRoll = z.infer<typeof bRoll>;

export const videoScene = z.object({
  type: z.literal("videoscene"),
  webcamPosition: z.enum(availablePositionsAndPrevious),
  duration: z.number().nullable().default(null),
  transitionToNextScene: z.boolean().default(true),
  newChapter: z.string().optional(),
  stopChapteringAfterThis: z.boolean().optional(),
  music,
  startOffset: z.number(),
  bRolls: z.array(bRoll).default([]),
});

export type VideoScene = z.infer<typeof videoScene>;

export const configuration = z.discriminatedUnion("type", [
  videoScene,
  z.object({
    type: z.literal("title"),
    title: z.string(),
    subtitle: z.string().nullable(),
    durationInFrames: z.number().int().default(50),
    transitionToNextScene: z.boolean().default(true),
    music,
  }),

  z.object({
    type: z.literal("endcard"),
    durationInFrames: z.number().int().default(200),
    music,
    channel: brand,
    links: z.array(linkType).default([]),
    transitionToNextScene: z.boolean().default(true),
  }),
  z.object({
    type: z.literal("tableofcontents"),
    durationInFrames: z.number().int().default(200),
    music,
    transitionToNextScene: z.boolean().default(true),
  }),
  z.object({
    type: z.literal("recorder"),
    durationInFrames: z.number().int().default(90),
    music,
    transitionToNextScene: z.boolean().default(true),
  }),
]);

export const scenes = z.array(configuration);
export type SceneType = z.infer<typeof configuration>;

export const videoConf = z.object({
  theme,
  canvasLayout,
  platform,
  scenes,
});

export type Pair = {
  webcam: StaticFile;
  display: StaticFile | null;
  subs: StaticFile | null;
  alternative1: StaticFile | null;
  alternative2: StaticFile | null;
  timestamp: number;
};

export type SceneVideos = {
  webcam: Dimensions;
  display: Dimensions | null;
};

export type BRollWithDimensions = BRoll & {
  assetWidth: number;
  assetHeight: number;
  type: "image" | "video";
};

export type VideoSceneAndMetadata = {
  type: "video-scene";
  scene: VideoScene;
  durationInFrames: number;
  from: number;
  videos: SceneVideos;
  layout: CameraSceneLayout;
  pair: Pair;
  finalWebcamPosition: FinalWebcamPosition;
  chapter: string | null;
  startFrame: number;
  endFrame: number;
  bRolls: BRollWithDimensions[];
};

export type SceneAndMetadata =
  | VideoSceneAndMetadata
  | {
      type: "other-scene";
      scene: SceneType;
      durationInFrames: number;
      from: number;
    };
