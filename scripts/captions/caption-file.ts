import { transcribe } from "@remotion/install-whisper-cpp";
import { execSync } from "child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import path from "path";
import { WHISPER_MODEL, WHISPER_PATH } from "./install-whisper";

const extractToTempAudioFile = (
  fileToTranscribe: string,
  tempOutFile: string,
) => {
  // extracting audio from mp4 and save it as 16khz wav file
  execSync(
    `npx remotion ffmpeg -i ${fileToTranscribe} -ar 16000 ${tempOutFile}`,
  );
};

export const captionFile = async ({
  file,
  folder,
  fileToTranscribe,
}: {
  file: string;
  folder: string;
  fileToTranscribe: string;
}) => {
  const fileName = file.split(".")[0] + ".wav";

  const isTranscribed = existsSync(
    fileToTranscribe.replace(".mp4", ".json").replace("webcam", "subs"),
  );
  // defining the output file location and name
  const outPath = path
    .join(
      process.cwd(),
      `public/${folder}/${fileName.replace(".wav", ".json")}`,
    )
    .replace("webcam", "subs");

  if (isTranscribed) {
    return { outPath };
  }

  if (!existsSync(path.join(process.cwd(), "temp"))) {
    mkdirSync("temp");
  }

  const wavFile = path.join(process.cwd(), `temp/${fileName}`);
  extractToTempAudioFile(fileToTranscribe, wavFile);

  const output = await transcribe({
    inputPath: wavFile,
    model: WHISPER_MODEL,
    tokenLevelTimestamps: true,
    whisperPath: WHISPER_PATH,
    translateToEnglish: false,
  });

  rmSync(wavFile);
  writeFileSync(outPath, JSON.stringify(output, null, 2));

  return { outPath };
};
