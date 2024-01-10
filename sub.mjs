import { execSync } from "node:child_process";
import { existsSync, lstatSync, readdirSync } from "node:fs";
import path from "path";

const extractToTempAudioFile = async (fileToTranscribe, tempOutFile) => {
  execSync(
    `npx remotion ffmpeg -i ${fileToTranscribe} -ar 16000 ${tempOutFile}`,
  );
};

const subFile = async (file) => {
  console.log("file: ", file);
  const fileWOExt = file.split(".")[0];
  console.log("file without extension: ", fileWOExt);
  console.log("CWD: ", process.cwd());
  execSync(
    ` cd whisper.cpp && ./main -f ${file} --output-file ${fileWOExt} --output-json --max-len 1 `,
  );

  console.log("after execSync");
  // const output = file.replace(".wav", ".json");
  // console.log("output: ", output);
  // const json = readFileSync(output, "utf8");
  // const options = await prettier.resolveConfig(".");
  // const formatted = await prettier.format(json, { ...options, parser: "json" });
  // writeFileSync(output.replace("webcam", "subs"), formatted);
  // rmSync(output);
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

    if (!existsSync(path.join(process.cwd(), "temp"))) {
      execSync(`mkdir temp`);
    }

    const tempOutFile = path.join(
      process.cwd(),
      `temp/${file.split(".")[0] + ".wav"}`,
    );

    extractToTempAudioFile(fileToTranscribe, tempOutFile);

    await subFile(tempOutFile);
  }
}

console.log(folders);
