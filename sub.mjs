import { execSync } from "node:child_process";
import { existsSync, readdirSync, renameSync } from "node:fs";
import path from "path";

const subFile = (file) => {
  execSync(
    `whisper --language=English --model=small.en --word_timestamps True --output_format=json --output_dir=${path.dirname(
      file
    )} ${file}`,
    {
      stdio: "inherit",
    }
  );

  const output = file.replace(".mp4", ".json");
  renameSync(output, output.replace("webcam", "subs"));
};

const folders = readdirSync("public").filter((f) => f !== ".DS_Store");

for (const folder of folders) {
  const files = readdirSync(`public/${folder}`).filter(
    (f) => f !== ".DS_Store"
  );
  for (const file of files) {
    if (!file.startsWith("webcam")) {
      continue;
    }

    const fileToTranscribe = path.join(
      process.cwd(),
      `public/${folder}/${file}`
    );

    const isTranscribed = existsSync(
      fileToTranscribe.replace(".mp4", ".json").replace("webcam", "subs")
    );
    if (isTranscribed) {
      continue;
    }

    console.log(fileToTranscribe);
    subFile(fileToTranscribe);
  }
}

console.log(folders);
