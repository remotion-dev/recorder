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

export const loadSelectedProjectFromLS = () => {
  if (!window.remotionServerEnabled) {
    return null;
  }

  const projectFromLS = window.localStorage.getItem("selectedProject");
  if (projectFromLS === "") {
    return null;
  }

  return projectFromLS;
};
