import react from "@vitejs/plugin-react-swc";
import bodyParser from "body-parser";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { indexHtmlDev } from "../index-html";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const startServer = async () => {
  const app = express();
  app.use(bodyParser.json());

  // Create Vite server in middleware mode and configure the app type as
  // 'custom', disabling Vite's own HTML serving logic so parent server
  // can take control
  const rootDir = path.join(__dirname, "..");
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

  app.get("/recorder", indexHtmlDev(vite, viteDir));

  const port = process.env.PORT || 8080;

  app.listen(port);
  console.log(`Listening on http://localhost:${port}`);
};
