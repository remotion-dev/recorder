import { downloadWhisperModel } from "@remotion/install-whisper-cpp";
import { execSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "path";
import * as prettier from "prettier";

const validModelNames = [
  "tiny",
  "tiny.en",
  "base",
  "base.en",
  "small",
  "small.en",
  "medium",
  "medium.en",
  "large-v1",
  "large-v2",
  "large-v3",
];

// available models: tiny, tiny.en, base, base.en, small, small.en, medium, medium.en, large-v1, large-v2, large-v3
const SELECTED_WHISPER_MODEL = "base.en";

const getModelPathByName = (name) => {
  const whisperLocation = path.join(process.cwd(), "whisper.cpp");
  if (!validModelNames.includes(name)) {
    throw new Error(`Model ${name} is not supported`);
  }

  const prefix = "/ggml-";
  const suffix = ".bin";

  return `${whisperLocation}${prefix}${name}${suffix}`;
};

const modelExists = (name) => {
  const modelPath = getModelPathByName(name);

  return existsSync(modelPath);
};

const isWhisperInstalled = () => {
  if (os.platform() === "darwin" || os.platform() === "linux") {
    return existsSync(path.join(process.cwd(), "whisper.cpp"));
  }

  if (os.platform() === "win32") {
    return existsSync(path.join(process.cwd(), "whisper-bin-x64"));
  }
};

const extractToTempAudioFile = (fileToTranscribe, tempOutFile) => {
  // extracting audio from mp4 and save it as 16khz wav file
  execSync(
    `npx remotion ffmpeg -i ${fileToTranscribe} -ar 16000 ${tempOutFile}`,
  );
};

const subFile = async (filePath, fileName, folder) => {
  // defining the output file location and name
  const selectedModelPath = getModelPathByName(SELECTED_WHISPER_MODEL);
  const outPath = path.join(
    process.cwd(),
    `public/${folder}/${fileName.replace(".wav", ".json")}`,
  );

  if (!modelExists(SELECTED_WHISPER_MODEL)) {
    await downloadWhisperModel({
      model: SELECTED_WHISPER_MODEL,
      folder: path.join(process.cwd(), "whisper.cpp"),
    });
  }

  if (os.platform() === "darwin" || os.platform() === "linux") {
    execSync(
      `./main -f ${filePath} --output-file ${
        outPath.split(".")[0]
      } --output-json --max-len 1 --model ${selectedModelPath}`,
      { cwd: path.join(process.cwd(), "whisper.cpp") },
    );
  } else if (os.platform() === "win32") {
    // url to fetch base model on windows: https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin
    execSync(
      `main.exe -f ${filePath} --output-file ${
        outPath.split(".")[0]
      } --output-json --max-len 1 --model ${selectedModelPath}`,
      { cwd: path.join(process.cwd(), "whisper-bin-x64") },
    );
  }

  const json = readFileSync(outPath, "utf8");
  const options = await prettier.resolveConfig(".");
  const formatted = await prettier.format(json, { ...options, parser: "json" });

  writeFileSync(outPath.replace("webcam", "subs"), formatted);
  rmSync(outPath);
  rmSync(filePath);
};

const folders = readdirSync("public").filter((f) => f !== ".DS_Store");

if (!isWhisperInstalled()) {
  console.log("Whisper not installed");
  execSync(`node whisper-init.mjs`, { stdio: "inherit" });
}

if (!isWhisperInstalled()) {
  console.log("Whisper not installed. Exiting...");
  process.exit(1);
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
