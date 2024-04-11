import react from "@vitejs/plugin-react-swc";
import bodyParser from "body-parser";
import type { Request, Response } from "express";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { SERVER_PORT } from "../../config/server";
import { indexHtmlDev } from "../../index-html";
import { SAVE_SUBTITLES } from "./constants";
import { copyEndpoint } from "./copy-example";
import { handleVideoUpload } from "./handle-video";
import { getProjectFolder } from "./projects";
import { getOptions, saveSubtitles } from "./subtitles";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const startExpressServer = async () => {
  console.log("starting express server...");
  const app = express();
  app.use(bodyParser.json());

  const rootDir = path.join(__dirname, "..", "..");
  const viteDir = rootDir; // will change once vite is put in its own directory
  const publicDir = path.join(rootDir, "public");
  const vite = await createServer({
    configFile: false,
    root: viteDir,
    server: {
      middlewareMode: true,
    },
    appType: "custom",
    plugins: [react()],
    publicDir,
  });

  app.use((req, res, next) => {
    vite.middlewares.handle(req, res, next);
  });

  app.get("/", indexHtmlDev(vite, viteDir));

  app.post("/api/copy", copyEndpoint);

  app.get("/api/projects", (req: Request, res: Response) => {
    getProjectFolder(req, res, rootDir);
  });

  app.post("/api/upload-video", handleVideoUpload);
  // app.post("/api/transcribe");

  app.post(SAVE_SUBTITLES, saveSubtitles);
  app.options(SAVE_SUBTITLES, getOptions);

  const port = process.env.PORT || SERVER_PORT;

  app.listen(port);
  console.log(`Recorder running on http://localhost:${port}`);
};
