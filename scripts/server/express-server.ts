import react from "@vitejs/plugin-react-swc";
import bodyParser from "body-parser";
import type { Request, Response } from "express";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { SERVER_PORT } from "../../config/server";
import { indexHtmlDev } from "../../index-html";
import {
  CREATE_FOLDER,
  GET_FOLDERS,
  PROCESS_VIDEOS,
  TRANSCRIBE_VIDEO,
  UPLOAD_VIDEO,
} from "./constants";
import { createProject } from "./create-project";
import { handleVideoConvertRequest, handleVideoUpload } from "./handle-video";
import { getProjectFolder } from "./projects";
import { transcribeVideo } from "./transcribe-video";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const startExpressServer = async () => {
  console.log("Starting recording interface");
  const app = express();
  app.use(
    bodyParser.json({
      limit: "100mb",
    }),
  );

  const rootDir = path.join(__dirname, "..", "..");
  const publicDir = path.join(rootDir, "public");

  const vite = await createServer({
    configFile: false,
    root: rootDir,
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

  app.get("/", indexHtmlDev(vite, rootDir));

  app.get(GET_FOLDERS, (req: Request, res: Response) => {
    getProjectFolder(req, res, rootDir);
  });

  app.post(CREATE_FOLDER, (req: Request, res: Response) => {
    createProject(req, res, rootDir);
  });

  app.post(UPLOAD_VIDEO, handleVideoUpload);
  app.post(PROCESS_VIDEOS, handleVideoConvertRequest);
  app.post(TRANSCRIBE_VIDEO, (req: Request, res: Response) => {
    transcribeVideo(req, res, publicDir);
  });

  const port = process.env.PORT || SERVER_PORT;

  app.listen(port);
  console.log(`Recording interface running on http://localhost:${port}`);
};
