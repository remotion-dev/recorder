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

const params = new URLSearchParams(window.location.search);
const folderFromUrl = params.get("folder");

export const loadFolderFromUrl = () => {
  if (!folderFromUrl) {
    return null;
  }

  const newUrl = window.location.origin + window.location.pathname;
  window.history.replaceState({}, "", newUrl);
  return folderFromUrl;
};

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
