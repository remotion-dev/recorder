import { lstatSync, readdirSync } from "node:fs";
import path from "path";
import { captionFile } from "./scripts/captions/caption-file";
import { ensureWhisper } from "./scripts/captions/install-whisper";

await ensureWhisper();

const publicFolder = path.join(process.cwd(), "public");
const folders = readdirSync(publicFolder).filter((f) => f !== ".DS_Store");

for (const folder of folders) {
  if (!lstatSync(path.join(publicFolder, folder)).isDirectory()) {
    continue;
  }

  const files = readdirSync(path.join(publicFolder, folder)).filter(
    (f) => f !== ".DS_Store",
  );

  for (const file of files) {
    if (!file.startsWith("webcam")) {
      continue;
    }

    const fileToTranscribe = path.join(publicFolder, folder, file);

    console.log("Transcribing", fileToTranscribe);
    const { outPath } = await captionFile({ file, folder, fileToTranscribe });
    console.log("Transcribed to", outPath);
  }
}
