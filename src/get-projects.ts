import { SERVER_PORT } from "../config/server";
import { GET_FOLDERS } from "../scripts/server/constants";
import type { FolderResBody } from "../scripts/server/projects";

export const fetchProjectFolders = async () => {
  const res = await fetch(`http://localhost:${SERVER_PORT}${GET_FOLDERS}`, {
    method: "GET",
  });

  const projectFolders = (await res.json()) as FolderResBody;

  return projectFolders;
};

const KEY = "remotionrecorder.selectedFolder";

export const loadSelectedFolder = () => {
  if (!window.remotionServerEnabled) {
    return null;
  }

  const projectFromLS = window.localStorage.getItem(KEY);
  if (projectFromLS === "") {
    return null;
  }

  return projectFromLS;
};

export const persistSelectedFolder = (folder: string) => {
  window.localStorage.setItem(KEY, folder);
};
