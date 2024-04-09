import react from "@vitejs/plugin-react-swc";
import bodyParser from "body-parser";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { SERVER_PORT } from "../../config/server";
import { indexHtmlDev } from "../../index-html";
import { copyEndpoint } from "../../server/copy-example";
import { SAVE_SUBTITLES } from "./constants";
import { saveSubtitles } from "./subtitles";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const startExpressServer = async () => {
  const app = express();
  // app.use(bodyParser.json());

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

  app.use(bodyParser.json());

  app.get("/recorder", indexHtmlDev(vite, viteDir));

  app.post("/api/copy", copyEndpoint);
  app.post(SAVE_SUBTITLES, saveSubtitles);

  const port = process.env.PORT || SERVER_PORT;

  app.listen(port);
  console.log(`Listening on http://localhost:${port}`);
};
