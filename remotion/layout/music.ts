import { staticFile } from "remotion";
import { z } from "zod";

export const music = z.enum(["none", "dancelikemike", "soft"]);
export type Music = z.infer<typeof music>;

export const getAudioSource = (track: Music) => {
  if (track === "soft") {
    return staticFile("sounds/soft.mp3");
  }

  if (track === "dancelikemike") {
    return staticFile("sounds/dancelikemike.mp3");
  }
};
