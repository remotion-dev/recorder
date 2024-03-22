import { staticFile } from "remotion";
import { z } from "zod";

export const music = z.enum([
  "previous",
  "none",
  "dancelikemike",
  "soft",
  "weird",
  "epic",
  "euphoric",
  "alittlesmile",
]);
export type Music = z.infer<typeof music>;

export const getAudioSource = (track: Music) => {
  if (track === "soft") {
    return staticFile("sounds/soft.mp3");
  }

  if (track === "euphoric") {
    return staticFile("sounds/euphoric.wav");
  }

  if (track === "none") {
    return "none";
  }

  if (track === "weird") {
    return staticFile("sounds/weird.wav");
  }

  if (track === "epic") {
    return staticFile("sounds/epic.wav");
  }

  if (track === "alittlesmile") {
    return staticFile("sounds/alittlesmile.wav");
  }

  if (track === "dancelikemike") {
    return staticFile("sounds/dancelikemike.mp3");
  }

  throw new Error("undefined");
};
