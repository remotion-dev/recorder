import { execSync } from "node:child_process";

export const checkVideoIntegrity = (mp4VideoPath: string) => {
  try {
    const output = execSync(
      `ffprobe -v error -show_format -show_streams ${mp4VideoPath}`,
    );
    return output.toString();
  } catch (error: any) {
    throw new Error(`Error occurred: ${error.stderr.toString()}`);
  }
};
