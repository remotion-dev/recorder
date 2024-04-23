import type { Request, Response } from "express";
import { existsSync, readdirSync } from "fs";
import path from "path";
import { SUBS_PREFIX, WEBCAM_PREFIX } from "../../config/cameras";
import { captionFile } from "../captions/caption-file";
import { ensureWhisper } from "../captions/install-whisper";

export const transcribeVideo = async (
  req: Request,
  res: Response,
  publicDir: string,
) => {
  try {
    await ensureWhisper();

    const { endDateAsString, folder } = req.query;

    if (typeof endDateAsString !== "string") {
      throw new Error("No `endDate` provided");
    }

    if (typeof folder !== "string") {
      throw new Error("No `folder` provided");
    }

    const folderPath = path.join(publicDir, folder);

    // get webcam file of provided end date
    const webcamFiles = readdirSync(folderPath).filter((f) => {
      return (
        f !== ".DS_Store" &&
        f.includes(endDateAsString) &&
        f.startsWith(WEBCAM_PREFIX)
      );
    });

    if (webcamFiles.length === 0) {
      throw new Error(
        `Webcam file ${WEBCAM_PREFIX}${endDateAsString}.mp4  not found.`,
      );
    }

    if (webcamFiles.length > 1) {
      throw new Error("Dublicate files found.");
    }

    const fileName = webcamFiles[0] as string;
    const filePath = path.join(folderPath, fileName);

    const outPath = path.join(
      folderPath,
      `${(fileName.split(".")[0] as string).replace(WEBCAM_PREFIX, SUBS_PREFIX)}.json`,
    );

    if (existsSync(outPath)) {
      res.status(200);
      return res.send({
        success: true,
        message: `Already transcribed at ${outPath}`,
      });
    }

    await captionFile({
      file: fileName,
      outPath,
      fileToTranscribe: filePath,
    });

    res.status(200);
    return res.send({
      success: true,
      message: "Successfully transcribed.",
    });
  } catch (e) {
    res.status(500);
    return res.send({ success: false, message: e });
  }
};
