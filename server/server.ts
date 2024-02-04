import { writeFileSync } from "fs";
import { SAVE_SUBTITLES, SERVER_PORT } from "./constants";

const saveSubtitles = (req: Request): Response => {
  const json = req.json();
  writeFileSync("subtitles.json", JSON.stringify(json));
  return new Response("Subtitles saved!", {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
    },
  });
};

export const startServer = () => {
  Bun.serve({
    port: SERVER_PORT,
    fetch(req) {
      if (req.url === SAVE_SUBTITLES && req.method === "POST") {
        return saveSubtitles(req);
      }

      return new Response("Not found", {
        status: 404,
      });
    },
  });
};
