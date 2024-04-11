import type { Request, Response } from "express";
import { readdir } from "fs";
import path from "path";

export const getProjectFolder = (req: Request, res: Response) => {
  const rootDir = path.join(__dirname, "..", "..");
  const publicDir = path.join(rootDir, "public");

  readdir(publicDir, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    const folders = files.filter((file) => file.isDirectory());

    const folderNames = folders.map((folder) => folder.name);

    res.send;
    {
      JSON.stringify({ folders: folderNames });
    }
  });
};
