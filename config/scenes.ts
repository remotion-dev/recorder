import type { StaticFile } from "remotion";
import { staticFile } from "remotion";
import { z } from "zod";
import { VideoSceneLayout } from "../remotion/layout/get-layout";
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
export type ComparableWebcamPosition = FinalWebcamPosition | "bottom" | "top";

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

const videoScene = z.object({
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

const baseScene = z.object({
  music,
  transitionToNextScene: z.boolean().default(true),
});

const titleScene = baseScene.extend({
  type: z.literal("title"),
  title: z.string(),
  subtitle: z.string().nullable(),
  durationInFrames: z.number().int().default(50),
});

const endcardScene = baseScene.extend({
  type: z.literal("endcard"),
  durationInFrames: z.number().int().default(200),
  channel: brand,
  links: z.array(linkType).default([]),
});

const tableOfContentsScene = baseScene.extend({
  type: z.literal("tableofcontents"),
  durationInFrames: z.number().int().default(200),
});

const recorderScene = baseScene.extend({
  type: z.literal("recorder"),
  durationInFrames: z.number().int().default(90),
});

const selectableScenes = z.discriminatedUnion("type", [
  videoScene,
  titleScene,
  endcardScene,
  tableOfContentsScene,
  recorderScene,
]);

const noRecordingsScene = baseScene.extend({
  type: z.literal("norecordings"),
});

const noMoreRecordingsScene = baseScene.extend({
  type: z.literal("nomorerecordings"),
});

const noScenes = baseScene.extend({
  type: z.literal("noscenes"),
});

const computedScenes = z.discriminatedUnion("type", [
  noRecordingsScene,
  noMoreRecordingsScene,
  noScenes,
]);

export type SelectableScene = z.infer<typeof selectableScenes>;
type ComputedScene = z.infer<typeof computedScenes>;

export const videoConf = z.object({
  theme,
  canvasLayout,
  platform,
  scenes: z.array(selectableScenes),
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
  layout: VideoSceneLayout;
  pair: Pair;
  finalWebcamPosition: FinalWebcamPosition;
  chapter: string | null;
  startFrame: number;
  endFrame: number;
  bRolls: BRollWithDimensions[];
};

export type OtherScene = {
  type: "other-scene";
  scene: ComputedScene | SelectableScene;
  durationInFrames: number;
  from: number;
};

export type SceneAndMetadata = VideoSceneAndMetadata | OtherScene;
