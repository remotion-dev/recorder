import type { Request, Response } from "express";
import { readdir } from "fs";
import path from "path";

export type FolderResBody = {
  folders: string[];
};

export const getProjectFolder = (
  req: Request,
  res: Response,
  rootDir: string,
) => {
  const publicDir = path.join(rootDir, "public");

  try {
    readdir(publicDir, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
        throw new Error("Error reading directory: ", err);
      }

      const folders = files.filter((file) => file.isDirectory());

      const folderNames = folders
        .map((folder) => folder.name)
        .filter((f) => f !== "sounds");

      res.status(200);
      return res.send({ folders: folderNames });
    });
  } catch (e) {
    res.status(500);
    return res.send(e);
  }
};
