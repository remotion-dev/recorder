import { transcribe } from "@remotion/install-whisper-cpp";
import { spawn } from "child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { EOL, tmpdir } from "os";
import path from "path";
import { WHISPER_MODEL, WHISPER_PATH } from "../../config/whisper";

export const captionFile = async ({
  file,
  fileToTranscribe,
  outPath,
}: {
  file: string;
  fileToTranscribe: string;
  outPath: string;
}): Promise<void> => {
  const tmpDir = path.join(tmpdir(), "remotion-recorder");

  if (!existsSync(tmpDir)) {
    mkdirSync(tmpDir);
  }

  const wavFile = path.join(tmpDir, `${file.split(".")[0]}.wav`);

  // extracting audio from mp4 and save it as 16khz wav file
  await new Promise<void>((resolve, reject) => {
    const command = `bunx remotion ffmpeg -hide_banner -i ${fileToTranscribe} -ar 16000 -y ${wavFile}`;
    const [bin, ...args] = command.split(" ");
    const child = spawn(bin as string, args, { stdio: "ignore" });

    child.on("exit", (code, signal) => {
      if (code !== 0) {
        reject(new Error(`Exit code ${code} (signal ${signal})`));
        return;
      }
      resolve();
    });
  });

  const output = await transcribe({
    inputPath: wavFile,
    model: WHISPER_MODEL,
    tokenLevelTimestamps: true,
    whisperPath: WHISPER_PATH,
    translateToEnglish: false,
    printOutput: true,
  });

  rmSync(wavFile);
  writeFileSync(outPath, JSON.stringify(output, null, 2) + EOL);
};
