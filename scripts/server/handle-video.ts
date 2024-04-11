import type { Request, Response } from "express";
import fs, { createWriteStream } from "fs";
import path from "path";

export const handleVideoUpload = (req: Request, res: Response) => {
  console.log("handling the video upload");
  try {
    const { file, folder } = req.query; // = name of the file

    if (typeof file !== "string") {
      throw new Error("No `file` provided");
    }

    if (typeof folder !== "string") {
      throw new Error("No `folder` provided");
    }

    const folderPath = path.join(process.cwd(), "public", folder); // replace this with actual folder from query params
    const filePath = path.join(folderPath, file);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    req.pipe(createWriteStream(filePath));
    req.on("end", () => {
      res.send(JSON.stringify({ success: true }));
    });
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: (e as Error).message }));
  }
};
