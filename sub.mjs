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

const subFile = async (file) => {
  execSync(
    `whisper --language=English --model=small.en --word_timestamps True --output_format=json --output_dir=${path.dirname(
      file,
    )} ${file}`,
    {
      stdio: "inherit",
    },
  );

  const output = file.replace(".mp4", ".json");
  const json = readFileSync(output, "utf8");
  const options = await prettier.resolveConfig(".");
  const formatted = await prettier.format(json, { ...options, parser: "json" });
  writeFileSync(output.replace("webcam", "subs"), formatted);
  rmSync(output);
};

const folders = readdirSync("public").filter((f) => f !== ".DS_Store");

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

    console.log(fileToTranscribe);
    await subFile(fileToTranscribe);
  }
}

console.log(folders);
