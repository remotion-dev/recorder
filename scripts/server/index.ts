import { startServer } from "./server";

export const startStudioAndServer = () => {
  startServer();

  Bun.spawn(["bunx", "remotion", "studio"], {
    stdout: "inherit",
    shell: process.platform === "win32" ? "cmd.exe" : undefined,
  });
};
