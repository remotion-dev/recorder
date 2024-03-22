import { staticFile } from "remotion";
import { z } from "zod";

export const SOUNDS_FOLDER = "sounds";

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
    return staticFile(`${SOUNDS_FOLDER}/soft.mp3`);
  }

  if (track === "euphoric") {
    return staticFile(`${SOUNDS_FOLDER}/euphoric.wav`);
  }

  if (track === "none") {
    return "none";
  }

  if (track === "weird") {
    return staticFile(`${SOUNDS_FOLDER}/weird.wav`);
  }

  if (track === "epic") {
    return staticFile(`${SOUNDS_FOLDER}/epic.wav`);
  }

  if (track === "alittlesmile") {
    return staticFile(`${SOUNDS_FOLDER}/alittlesmile.wav`);
  }

  if (track === "dancelikemike") {
    return staticFile(`${SOUNDS_FOLDER}/dancelikemike.mp3`);
  }

  throw new Error(`No sound track for ${track}`);
};
