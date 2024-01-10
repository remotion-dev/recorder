import { execSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "path";
import * as prettier from "prettier";

const isWhisperInstalled = () => {
  return existsSync(path.join(process.cwd(), "whisper.cpp"));
};

const extractToTempAudioFile = async (fileToTranscribe, tempOutFile) => {
  // extracting audio from mp4 and save it as 16khz wav file
  execSync(
    `npx remotion ffmpeg -i ${fileToTranscribe} -ar 16000 ${tempOutFile}`,
  );
};

const subFile = async (filePath, fileName, folder) => {
  // defining the output file location and name
  const outPath = path.join(
    process.cwd(),
    `public/${folder}/${fileName.replace(".wav", ".json")}`,
  );

  // transcribing the audiofile and saving the json to the public folder as defined in outPath
  execSync(
    `./main -f ${filePath} --output-file ${
      outPath.split(".")[0]
    } --output-json --max-len 1 `,
    { cwd: path.join(process.cwd(), "whisper.cpp") },
  );

  const json = readFileSync(outPath, "utf8");
  const options = await prettier.resolveConfig(".");
  const formatted = await prettier.format(json, { ...options, parser: "json" });

  writeFileSync(outPath.replace("webcam", "subs"), formatted);
  rmSync(outPath);
  rmSync(filePath);
};

const folders = readdirSync("public").filter((f) => f !== ".DS_Store");
if (!isWhisperInstalled()) {
  execSync(`node whisper-init.mjs`);
}

for (const folder of folders) {
  if (!lstatSync(`public/${folder}`).isDirectory()) {
    continue;
  }

  const files = readdirSync(`public/${folder}`).filter(
    (f) => f !== ".DS_Store",
  );
  for (const file of files) {
    if (!file.startsWith("webcam")) {
      continue;
    }

    const fileToTranscribe = path.join(
      process.cwd(),
      `public/${folder}/${file}`,
    );

    const isTranscribed = existsSync(
      fileToTranscribe.replace(".mp4", ".json").replace("webcam", "subs"),
    );
    if (isTranscribed) {
      continue;
    }

    if (!existsSync(path.join(process.cwd(), "temp"))) {
      execSync(`mkdir temp`);
    }

    const tempWavFileName = file.split(".")[0] + ".wav";

    const tempOutFilePath = path.join(process.cwd(), `temp/${tempWavFileName}`);

    extractToTempAudioFile(fileToTranscribe, tempOutFilePath);

    await subFile(tempOutFilePath, tempWavFileName, folder);
  }
}
