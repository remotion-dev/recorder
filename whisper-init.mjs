import fs from "fs";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { Readable } from "node:stream";
import { finished } from "node:stream/promises";
import path from "path";

const installWhisperForMacOS = () => {
  console.log("Installing whisper. This may take a while...");
  execSync(`git clone https://github.com/ggerganov/whisper.cpp.git 2>&1`);

  execSync(`make`, {
    cwd: path.join(process.cwd(), "whisper.cpp"),
  });

  // check if base model for english exists
  console.log("Checking whisper models...");
  if (
    !existsSync(path.join(process.cwd(), "whisper.cpp/models/ggml-base.en.bin"))
  ) {
    console.log("Downloading english base model...");
    execSync(` bash ./models/download-ggml-model.sh base.en`, {
      cwd: path.join(process.cwd(), "whisper.cpp"),
    });
  }
};

// TODO: refactor for less redundnacy
const downloadWindowsBinary = async () => {
  const url =
    "https://github.com/ggerganov/whisper.cpp/releases/download/v1.5.4/whisper-bin-x64.zip";

  const filePath = path.join(process.cwd(), "whisper-bin-x64.zip");
  const fileStream = fs.createWriteStream(filePath);

  const { body } = await fetch(url);
  await finished(Readable.fromWeb(body).pipe(fileStream));

  execSync(
    `Expand-Archive -Force ${filePath} ${path.join(
      process.cwd(),
      "whisper-bin-x64",
    )}`,
    { shell: "powershell" },
  );
};

const downloadWhisperBaseModel = async () => {
  const baseModelUrl =
    "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin";

  const dirPath = path.join(process.cwd(), "whisper-bin-x64", "models");
  fs.mkdir(dirPath, (err) => {
    if (err) {
      return console.error(err);
    }
  });

  const filePath = path.join(dirPath, "ggml-base.en.bin");
  const fileStream = fs.createWriteStream(filePath);

  const { body } = await fetch(baseModelUrl);
  await finished(Readable.fromWeb(body).pipe(fileStream));

  // create models directory
};

const installWhisperForWindows = async () => {
  await downloadWindowsBinary();
  await downloadWhisperBaseModel();
};

if (process.platform === "darwin") {
  installWhisperForMacOS();
}

if (process.platform === "win32") {
  installWhisperForWindows()
    .then(() => {
      console.log("Download successful");
    })
    .catch((e) => {
      console.error("An error occured while downloading: ", e);
    });
}
