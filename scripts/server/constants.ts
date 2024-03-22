export const SERVER_PORT = 4000;
export const SAVE_SUBTITLES = "/subtitles";

export type SaveSubtitlesPayload = {
  data: unknown;
  filename: string;
};
