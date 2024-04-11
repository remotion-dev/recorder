import type { Request, Response } from "express";
import { readFileSync } from "node:fs";
import path from "path";
import type { ViteDevServer } from "vite";

declare global {
  interface Window {
    remotionServerEnabled: boolean | undefined;
  }
}

export const indexHtmlDev = (vite: ViteDevServer, viteDir: string) => {
  const index = path.join(viteDir, "index.html");
  return async (req: Request, response: Response) => {
    const template = readFileSync(index, "utf-8");
    const transformed = await vite.transformIndexHtml(req.url, template);
    const injected = transformed.replace(
      "<!--remotion-server-placeholder-->",
      "<script>window.remotionServerEnabled = true</script>",
    );
    response.status(200);
    response.send(injected);
    response.end();
  };
};
