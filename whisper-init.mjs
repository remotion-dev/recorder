import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "path";

const installWhisper = () => {
  console.log("Installing whisper.cpp. This may take a while...");
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

installWhisper();
