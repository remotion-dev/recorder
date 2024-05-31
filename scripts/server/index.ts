import { StudioServerInternals } from "@remotion/studio-server";
import { spawn } from "child_process";
import { startExpressServer } from "./express-server";

export const startStudioAndServer = async () => {
  await startExpressServer();
  StudioServerInternals.openBrowser({
    url: "http://localhost:4000",
    browserArgs: undefined,
    browserFlag: undefined,
  });
  const bunxProcess = spawn("bunx", ["remotion", "studio"], {
    stdio: "inherit",
    shell: process.platform === "win32" ? "cmd.exe" : undefined,
    detached: false,
  });

  // Must be started with Node.js for the moment (npx tsx studio.ts)
  process.on("uncaughtException", (e) => {
    console.error(e);
    bunxProcess.kill();
  });
};
