export const SAVE_SUBTITLES = "/subtitles";
export const GET_FOLDERS = "/api/projects";
export const CREATE_PROJECTS = "/api/create-project";
export const UPLOAD_VIDEO = "/api/upload-video";

export type SaveSubtitlesPayload = {
  data: unknown;
  filename: string;
};
