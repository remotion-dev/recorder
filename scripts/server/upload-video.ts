import fs, { createWriteStream } from "fs";
import { IncomingMessage, ServerResponse } from "http";
import path from "path";
import { ensureWhisper } from "../captions/install-whisper";
import { makeStreamPayload } from "./streaming";
import { transcribeVideo } from "./transcribe-video";

export const handleTranscribeVideo = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const url = req.url as string;
  const params = new URLSearchParams(url.substring(1));
  const endDateAsString = params.get("endDateAsString");
  const folder = params.get("folder");
  const publicDir = path.join(process.cwd(), "public");

  if (typeof endDateAsString !== "string") {
    throw new Error("No `endDate` provided");
  }

  if (typeof folder !== "string") {
    throw new Error("No `folder` provided");
  }

  try {
    await ensureWhisper({
      onInstall: () => {
        res.write(
          makeStreamPayload({
            message: {
              type: "install-whisper-progress",
              payload: {},
            },
          }),
        );
      },
      onModelProgressInPercent: (progress) => {
        res.write(
          makeStreamPayload({
            message: {
              type: "downloading-whisper-model-progress",
              payload: {
                progressInPercent: progress,
              },
            },
          }),
        );
      },
    });

    await transcribeVideo({
      endDateAsString,
      folder,
      publicDir,
      onProgress: ({ filename, progressInPercent: progress }) => {
        const payload = makeStreamPayload({
          message: {
            type: "transcribing-progress",
            payload: {
              filename,
              progress,
            },
          },
        });
        res.write(payload);
      },
      signal: null,
    });

    res.statusCode = 200;
    res.end();
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: (e as Error).message }));
  }
};

export const handleVideoUpload = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const url = req.url as string;
  const params = new URLSearchParams(url.substring(1));
  const endDateAsString = params.get("endDateAsString");
  const folder = params.get("folder");
  const prefix = params.get("prefix");
  const expectedFrames = Number(params.get("expectedFrames"));
  try {
    if (typeof prefix !== "string") {
      throw new Error("No `prefix` provided");
    }

    if (typeof endDateAsString !== "string") {
      throw new Error("No `endDate` provided");
    }

    if (typeof folder !== "string") {
      throw new Error("No `folder` provided");
    }

    if (typeof expectedFrames !== "number") {
      throw new Error("No `expectedFrames` provided");
    }

    const file = `${prefix}${endDateAsString}.mp4`;

    const publicDir = path.join(process.cwd(), "public");
    const folderPath = path.join(publicDir, folder);
    const filePath = path.join(folderPath, file);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    const writeStream = createWriteStream(filePath);

    req.pipe(writeStream);

    await new Promise((resolve) => writeStream.on("finish", resolve));

    res.statusCode = 200;
    res.end();
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: (e as Error).message }));
  }
};
