import fs from "fs";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
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

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to download binary. Status code ${res.status}`);
  }

  const filePath = path.join(process.cwd());
  const fileStream = fs.createWriteStream(filePath);

  return new Promise((resolve, reject) => {
    res.body.pipe(fileStream);

    res.body.on("error", (err) => {
      reject(err);
    });

    fileStream.on("finish", () => {
      resolve();
    });

    fileStream.on("error", (err) => {
      reject(err);
    });
  });
};

const downloadWhisperBaseModel = async () => {
  const baseModelUrl =
    "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin";

  const res = await fetch(baseModelUrl);

  if (!res.ok) {
    throw new Error(
      `Failed to download whisper base model. Status code ${res.status}`,
    );
  }

  const filePath = path.join(process.cwd(), "whisper-bin-x64", "models");

  fs.mkdir(filePath, (err) => {
    if (err) {
      return console.error(err);
    }
  });

  // create models directory
  const fileStream = fs.createWriteStream(filePath);

  return new Promise((resolve, reject) => {
    res.body.pipe(fileStream);

    res.body.on("error", (err) => {
      reject(err);
    });

    fileStream.on("finish", () => {
      resolve();
    });

    fileStream.on("error", (err) => {
      reject(err);
    });
  });
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
