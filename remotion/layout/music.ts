import { staticFile } from "remotion";
import { z } from "zod";

export const music = z.enum(["none", "dancelikemike", "soft", "weird"]);
export type Music = z.infer<typeof music>;

export const getAudioSource = (track: Music) => {
  if (track === "soft") {
    return staticFile("sounds/soft.mp3");
  }

  if (track === "weird") {
    return staticFile("sounds/weird.wav");
  }

  if (track === "dancelikemike") {
    return staticFile("sounds/dancelikemike.mp3");
  }
};
