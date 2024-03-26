import { transcribe } from "@remotion/install-whisper-cpp";
import { execSync } from "child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
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
  execSync(
    `npx remotion ffmpeg -hide_banner -i ${fileToTranscribe} -ar 16000 -y ${wavFile}`,
  );

  const output = await transcribe({
    inputPath: wavFile,
    model: WHISPER_MODEL,
    tokenLevelTimestamps: true,
    whisperPath: WHISPER_PATH,
    translateToEnglish: false,
    printOutput: false,
  });

  rmSync(wavFile);
  writeFileSync(outPath, JSON.stringify(output, null, 2));
};
