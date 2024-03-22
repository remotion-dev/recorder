import { z } from "zod";
import type { Pair } from "../remotion/configuration";
import { linkType } from "../remotion/configuration";
import type { CameraSceneLayout } from "../remotion/layout/get-layout";
import type { Dimensions } from "../remotion/layout/layout-types";
import { music } from "../remotion/layout/music";
import { channel, platform } from "./socials";

const availablePositions = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
] as const;

export type WebcamPosition = (typeof availablePositions)[number];

const availablePositionsAndPrevious = [
  "previous",
  ...availablePositions,
] as const;

export const videoScene = z.object({
  type: z.literal("videoscene"),
  webcamPosition: z.enum(availablePositionsAndPrevious),
  trimStart: z.number(),
  duration: z.number().nullable().default(null),
  transitionToNextScene: z.boolean().default(true),
  newChapter: z.string().optional(),
  stopChapteringAfterThis: z.boolean().optional(),
  music,
});

export type VideoScene = z.infer<typeof videoScene>;

export const configuration = z.discriminatedUnion("type", [
  videoScene,
  z.object({
    type: z.literal("title"),
    title: z.string(),
    subtitle: z.string().nullable(),
    durationInFrames: z.number().int().default(50),
    music,
  }),
  z.object({
    type: z.literal("titlecard"),
    durationInFrames: z.number().int().default(100),
    title: z.string(),
    image: z.string(),
    music,
    youTubePlug: z.boolean().default(false),
  }),
  z.object({
    type: z.literal("remotionupdate"),
    durationInFrames: z.number().int().default(100),
    music,
  }),
  z.object({
    type: z.literal("endcard"),
    durationInFrames: z.number().int().default(200),
    music,
    channel,
    platform,
    links: z.array(linkType),
  }),
  z.object({
    type: z.literal("tableofcontents"),
    durationInFrames: z.number().int().default(200),
    music,
  }),
]);

export const scenes = z.array(configuration);
export type SceneType = z.infer<typeof configuration>;

export type SceneVideos = {
  webcam: Dimensions;
  display: Dimensions | null;
};

export type VideoSceneAndMetadata = {
  type: "video-scene";
  scene: VideoScene;
  durationInFrames: number;
  from: number;
  videos: SceneVideos;
  layout: CameraSceneLayout;
  pair: Pair;
  finalWebcamPosition: WebcamPosition;
  chapter: string | null;
};

export type SceneAndMetadata =
  | VideoSceneAndMetadata
  | {
      type: "other-scene";
      scene: SceneType;
      durationInFrames: number;
      from: number;
      chapter: string | null;
    };
