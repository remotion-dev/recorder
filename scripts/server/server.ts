import { writeFileSync } from "fs";
import { EOL } from "os";
import path from "path";
import { SERVER_PORT } from "../../config/server";
import type { SaveSubtitlesPayload } from "./constants";
import { SAVE_SUBTITLES } from "./constants";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST",
  "Access-Control-Allow-Headers": "Content-Type",
};

const saveSubtitles = async (req: Request): Promise<Response> => {
  const json = (await req.json()) as SaveSubtitlesPayload;
  const publicFolder = path.join(import.meta.dir, "..", "..", "public");
  const relativeToPublic = path.relative(publicFolder, json.filename);
  if (relativeToPublic.startsWith("..")) {
    return new Response("Can only save in public folder", {
      status: 400,
      headers: corsHeaders,
    });
  }

  writeFileSync(json.filename, JSON.stringify(json.data, null, 2) + EOL);

  return new Response("Subtitles saved!", {
    headers: corsHeaders,
  });
};

export const startServer = () => {
  Bun.serve({
    port: SERVER_PORT,
    fetch(req) {
      if (req.url.endsWith(SAVE_SUBTITLES) && req.method === "OPTIONS") {
        return new Response(null, {
          headers: corsHeaders,
        });
      }

      if (req.url.endsWith(SAVE_SUBTITLES) && req.method === "POST") {
        return saveSubtitles(req);
      }

      return new Response("Not found", {
        status: 404,
      });
    },
  });
};
