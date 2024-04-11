import type { Request, Response } from "express";
import { writeFileSync } from "fs";
import { EOL } from "os";
import path from "path";
import type { SaveSubtitlesPayload } from "./constants";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const getOptions = (req: Request, res: Response) => {
  res.header(corsHeaders);
  return res.send(null);
};

export const saveSubtitles = async (req: Request, res: Response) => {
  const json = req.body as SaveSubtitlesPayload;

  const publicFolder = path.join(process.cwd(), "public");

  const relativeToPublic = path.relative(publicFolder, json.filename);
  if (relativeToPublic.startsWith("..")) {
    res.status(400);
    res.header(corsHeaders);
    return res.send("Can only save in public folder");
  }

  writeFileSync(json.filename, JSON.stringify(json.data, null, 2) + EOL);

  res.header(corsHeaders);
  res.send("Subtitles saved!");
};
