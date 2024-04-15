import type { NextFunction, Request, Response } from "express";
import fs, { createWriteStream } from "fs";
import path from "path";
import { convertAndTrimVideo } from "../convert-and-trim-video";

export const handleVideoUpload = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { prefix, endDateAsString, folder } = req.query;

    if (typeof prefix !== "string") {
      throw new Error("No `prefix` provided");
    }

    if (typeof endDateAsString !== "string") {
      throw new Error("No `endDate` provided");
    }

    if (typeof folder !== "string") {
      throw new Error("No `folder` provided");
    }

    const file = `${prefix}${endDateAsString}.webm`;

    const folderPath = path.join(process.cwd(), "public", folder);
    const filePath = path.join(folderPath, file);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    req.pipe(createWriteStream(filePath));
    req.on("end", () => {
      next();
    });
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: (e as Error).message }));
  }
};

export const convertVideos = async (req: Request, res: Response) => {
  console.log("converting videos...");
  try {
    const { endDateAsString, folder } = req.query;

    if (typeof endDateAsString !== "string") {
      throw new Error("No `endDate` provided");
    }

    if (typeof folder !== "string") {
      throw new Error("No `folder` provided");
    }

    const absoluteFolderPath = path.join(process.cwd(), "public", folder);

    const endDate = Number(endDateAsString);

    if (isNaN(endDate)) {
      res.status(500);
      return res.send({
        success: false,
        message: "NaN. Invalid endDate provided. ",
      });
    }

    await convertAndTrimVideo({
      caller: "server",
      latestTimestamp: endDate,
      customFileLocation: absoluteFolderPath,
    });

    console.log("Successfully converted to mp4.");
    res.status(200);
    return res.send(JSON.stringify({ success: true }));
  } catch (e) {
    console.error(e);
    res.status(500);
    return res.send({
      success: false,
      message:
        "Something went wrong while converting the webm files to mp4: " +
        (e as Error).message,
    });
  }
};
