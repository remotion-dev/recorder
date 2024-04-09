import { spawn } from "child_process";
import { startExpressServer } from "./express-server";

export const startStudioAndServer = async () => {
  await startExpressServer();

  const proc = spawn("npm", ["run", "remotion", "studio"], {
    stdio: "inherit",
    shell: process.platform === "win32" ? "cmd.exe" : undefined,
    detached: false,
  });

  setTimeout(() => {
    proc.ref();
    proc.kill();
    console.log("kill");
  }, 3000);
};
