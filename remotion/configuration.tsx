import type { StaticFile } from "remotion";
import { getStaticFiles, staticFile } from "remotion";
import { z } from "zod";
import type { CameraSceneLayout } from "./layout/get-layout";
import { music } from "./layout/music";
import { linkType } from "./scenes/EndCard/LeftSide";

export type Dimensions = {
  width: number;
  height: number;
};

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
};

export type SceneAndMetadata =
  | VideoSceneAndMetadata
  | {
      type: "other-scene";
      scene: SceneType;
      durationInFrames: number;
      from: number;
    };

const availablePositions = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
] as const;

const availablePositionsAndPrevious = [
  "previous",
  ...availablePositions,
] as const;

const theme = z.enum(["light", "dark"]);
export type Theme = z.infer<typeof theme>;
const platform = z.enum(["youtube", "linkedin", "instagram", "discord", "x"]);

export type Platform = z.infer<typeof platform>;

export type WebcamPosition = (typeof availablePositions)[number];

export const channel = z.enum(["jonny", "remotion"]);
export type Channel = z.infer<typeof channel>;

type ChannelConfig = { [key in Platform]: string | null };

export const channels: { [key in Channel]: ChannelConfig } = {
  jonny: {
    instagram: null,
    linkedin: "Jonny Burger",
    x: "@JNYBGR",
    youtube: "/JonnyBurger",
    discord: null,
  },
  remotion: {
    instagram: "@remotion",
    linkedin: "Remotion",
    x: "@remotion",
    youtube: "@remotion_dev",
    discord: null,
  },
};

export const avatars: { [key in Channel]: string } = {
  jonny: "https://jonny.io/avatar.png",
  remotion: staticFile("logo-on-white.png"),
};

export const videoScene = z.object({
  type: z.literal("scene"),
  webcamPosition: z.enum(availablePositionsAndPrevious),
  trimStart: z.number(),
  duration: z.number().nullable().default(null),
  transitionToNextScene: z.boolean().default(false),
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

export const canvasLayout = z.enum(["wide", "tall", "square"]);
export type CanvasLayout = z.infer<typeof canvasLayout>;

const scenes = z.array(configuration);
export type SceneType = z.infer<typeof configuration>;

export const videoConf = z.object({
  theme,
  canvasLayout,
  scenes,
});

export const getPairs = (prefix: string) => {
  const files = getStaticFiles().filter((f) => f.name.startsWith(prefix));

  const pairs = files
    .map((f): Pair | null => {
      if (f.name.startsWith(`${prefix}/webcam`)) {
        const timestamp = f.name
          .replace(`${prefix}/webcam`, "")
          .replace(".webm", "")
          .replace(".mp4", "");
        const display = files.find(
          (_f) =>
            _f.name === `${prefix}/display${timestamp}.webm` ||
            _f.name === `${prefix}/display${timestamp}.mp4`,
        );

        const sub = files.find((_f) => {
          return _f.name === `${prefix}/subs${timestamp}.json`;
        });

        return { display: display ?? null, webcam: f, sub: sub ?? null };
      }

      return null;
    })
    .filter(Boolean) as Pair[];
  return pairs;
};

export type Pair = {
  display: StaticFile | null;
  webcam: StaticFile;
  sub: StaticFile | null;
};

export const transitionDuration = 15;
export const fps = 30;
