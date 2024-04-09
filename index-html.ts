import type { Request, Response } from "express";
import { readFileSync } from "node:fs";
import path from "path";
import type { ViteDevServer } from "vite";

export const indexHtmlDev = (vite: ViteDevServer, viteDir: string) => {
  const index = path.join(viteDir, "index.html");
  return async (req: Request, response: Response) => {
    const template = readFileSync(index, "utf-8");
    const transformed = await vite.transformIndexHtml(req.url, template);
    response.status(200);
    response.send(transformed);
    response.end();
  };
};
