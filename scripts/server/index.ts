import { StudioServerInternals } from "@remotion/studio-server";
import { spawn } from "child_process";
import { SERVER_PORT } from "../../config/server";
import { startServer } from "./express-server";

export const startStudioAndServer = async () => {
  await startServer();
  StudioServerInternals.openBrowser({
    url: `http://localhost:${SERVER_PORT}`,
    browserArgs: undefined,
    browserFlag: undefined,
  });
  const bunxProcess = spawn("bunx", ["remotion", "studio"], {
    stdio: "inherit",
    shell: process.platform === "win32" ? "cmd.exe" : undefined,
    detached: false,
  });

  // Forces the process to crash in case of error
  process.on("uncaughtException", (e) => {
    console.error(e);
    bunxProcess.kill();
  });
};
