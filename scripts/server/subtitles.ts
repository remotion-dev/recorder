import type { Request, Response } from "express";
import { writeFileSync } from "fs";
import { EOL } from "os";
import path from "path";
import { SaveSubtitlesPayload } from "./constants";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const saveSubtitles = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  console.log("inside save subtitle");
  console.log("Request: ", req.body);
  const json = (await req.body.json()) as SaveSubtitlesPayload;
  const publicFolder = path.join(import.meta.dir, "..", "..", "public");
  const relativeToPublic = path.relative(publicFolder, json.filename);
  if (relativeToPublic.startsWith("..")) {
    res.status(400);
    res.header(corsHeaders);
    res.send("Can only save in public folder");
  }

  writeFileSync(json.filename, JSON.stringify(json.data, null, 2) + EOL);

  res.header(corsHeaders);
  res.send("Subtitles saved!");
};
