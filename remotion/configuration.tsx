import type { StaticFile } from "remotion";
import { getStaticFiles } from "remotion";
import { z } from "zod";

type Dimensions = {
  width: number;
  height: number;
};

export type SceneMetadata = {
  durationInFrames: number;
  webcam: Dimensions | null;
  display: Dimensions | null;
};

export const configuration = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("scene"),
    webcamPosition: z.enum([
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
      "center",
    ]),
    trimStart: z.number(),
    duration: z.number().nullable().default(null),
  }),
  z.object({
    type: z.literal("title"),
    title: z.string(),
    subtitle: z.string().nullable(),
  }),
]);

export const canvasSize = z.enum(["wide", "tall", "square"]);
export type CanvasSize = z.infer<typeof canvasSize>;

export const videoConf = z.object({
  music: z.enum(["none", "dancelikemike"]),
  layout: canvasSize,
  scenes: z.array(configuration),
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
            _f.name === `${prefix}/display${timestamp}.mp4`
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

export const titleDuration = 50;
export const fps = 30;
