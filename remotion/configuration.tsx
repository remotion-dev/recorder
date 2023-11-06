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
  sumUpDuration: number;
  videos: SceneVideos;
  layout: CameraSceneLayout;
};

export type SceneAndMetadata =
  | VideoSceneAndMetadata
  | {
      type: "other-scene";
      scene: SceneType;
      durationInFrames: number;
      sumUpDuration: number;
    };

const webcamPosition = z.enum([
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
  "center",
]);

const platform = z.enum(["youtube", "linkedin", "instagram", "x"]);

export type Platform = z.infer<typeof platform>;

export type WebcamPosition = z.infer<typeof webcamPosition>;

export const channel = z.enum(["jonny", "remotion"]);
export type Channel = z.infer<typeof channel>;

type ChannelConfig = { [key in Platform]: string | null };

export const channels: { [key in Channel]: ChannelConfig } = {
  jonny: {
    instagram: null,
    linkedin: "Jonny Burger",
    x: "@JNYBGR",
    youtube: "/JonnyBurger",
  },
  remotion: {
    instagram: "@remotion",
    linkedin: "Remotion",
    x: "@remotion",
    youtube: "@remotion_dev",
  },
};

export const avatars: { [key in Channel]: string } = {
  jonny: "https://jonny.io/avatar.png",
  remotion: staticFile("logo-on-white.png"),
};

export const videoScene = z.object({
  type: z.literal("scene"),
  webcamPosition,
  trimStart: z.number(),
  duration: z.number().nullable().default(null),
  zoomInAtStart: z.boolean().default(false),
  zoomInAtEnd: z.boolean().default(false),
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
]);

export const canvasLayout = z.enum(["wide", "tall", "square"]);
export type CanvasLayout = z.infer<typeof canvasLayout>;

const scenes = z.array(configuration);
export type SceneType = z.infer<typeof configuration>;

export const videoConf = z.object({
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

export const transitionDuration = 10;
export const fps = 30;
