import { SERVER_PORT } from "../config/server";
import type { FolderResBody } from "../scripts/server/projects";

export const fetchProjectFolders = async () => {
  const res = await fetch(`http://localhost:${SERVER_PORT}/api/projects`, {
    method: "GET",
  });

  const projectFolders = (await res.json()) as FolderResBody;

  return projectFolders;
};
