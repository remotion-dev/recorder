import type { StaticFile } from "remotion";
import { getStaticFiles } from "remotion";
import { z } from "zod";
import { scenes } from "../config/scenes";

const theme = z.enum(["light", "dark"]);
export type Theme = z.infer<typeof theme>;

export const linkType = z.object({
  link: z.string(),
});

export type LinkType = z.infer<typeof linkType>;

export const canvasLayout = z.enum(["landscape", "square"]);
export type CanvasLayout = z.infer<typeof canvasLayout>;

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
