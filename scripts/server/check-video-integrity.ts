import { execSync } from "node:child_process";

export const checkVideoIntegrity = (mp4VideoPath: string) => {
  const output = execSync(
    `ffprobe -v error -show_format -show_streams ${mp4VideoPath}`,
  );
  return output.toString();
};
