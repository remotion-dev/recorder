import type { StaticFile } from "remotion";
import { getStaticFiles } from "remotion";
import { z } from "zod";

export type SceneMetadata = {
  durationInFrames: number;
  webcamWidth: number;
  webcamHeight: number;
  displayWidth: number;
  displayHeight: number;
};

export const configuration = z.object({
  webcamPosition: z.enum([
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
  ]),
  trimStart: z.number(),
  duration: z.number().nullable().default(null),
  isTitle: z
    .object({
      title: z.string(),
      subtitle: z.string().nullable(),
    })
    .nullable()
    .default(null),
});

export const videoConf = z.object({
  scenes: z.array(configuration),
});

export const getPairs = (prefix: string) => {
  const files = getStaticFiles().filter((f) => f.name.startsWith(prefix));

  const pairs = files
    .map((f): Pair | null => {
      if (f.name.startsWith(`${prefix}/webcam`)) {
        const timestamp = f.name
          .replace(`${prefix}/webcam`, "")
          .replace(".webm", "");
        const display = files.find(
          (_f) => _f.name === `${prefix}/display${timestamp}.webm`
        );

        return { display: display ?? null, webcam: f };
      }

      return null;
    })
    .filter(Boolean) as Pair[];
  return pairs;
};

export type Pair = {
  display: StaticFile | null;
  webcam: StaticFile;
};

export const safeSpaceBottom = 120;
export const frameWidth = 10;
export const borderRadius = 10;

type Layout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const wideLayout = (width: number, height: number): Layout => {
  const canvasWidth = 1920;
  const canvasHeight = 1080;

  const safeSpace = 50;

  const maxHeight = canvasHeight - safeSpaceBottom - safeSpace;
  const maxWidth = canvasWidth - safeSpace * 2;

  const heightRatio = maxHeight / (height + frameWidth * 2);
  const widthRatio = maxWidth / (width + frameWidth * 2);

  const ratio = Math.min(heightRatio, widthRatio);

  const newWidth = (width + frameWidth * 2) * ratio;
  const newHeight = (height + frameWidth * 2) * ratio;

  const x = (canvasWidth - newWidth) / 2;
  const y = (canvasHeight - newHeight - safeSpaceBottom) / 2;

  return {
    x,
    y,
    width: newWidth,
    height: newHeight,
  };
};

export const getLayout = ({
  display,
  webcam,
}: {
  display: {
    width: number;
    height: number;
  } | null;
  webcam: {
    width: number;
    height: number;
  } | null;
}): { webcamLayout: Layout | null; displayLayout: Layout | null } => {
  const displayLayout = display
    ? wideLayout(display.width, display.height)
    : null;

  const webcamLayout = webcam ? { width: 350, height: 400, x: 0, y: 0 } : null;

  return { displayLayout, webcamLayout };
};

export const titleDuration = 50;
export const fps = 30;
