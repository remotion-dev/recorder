import { existsSync, lstatSync, readdirSync } from "node:fs";
import path from "path";
import { WEBCAM_PREFIX } from "./config/cameras";
import { captionFile } from "./scripts/captions/caption-file";
import { ensureWhisper } from "./scripts/captions/install-whisper";

await ensureWhisper();

const publicFolder = path.join(process.cwd(), "public");
const foldersInPublicFolder = readdirSync(publicFolder).filter((f) => {
  return lstatSync(path.join(publicFolder, f)).isDirectory();
});

for (const folder of foldersInPublicFolder) {
  const absoluteFolder = path.join(publicFolder, folder);

  const files = readdirSync(absoluteFolder).filter((f) => f !== ".DS_Store");

  for (const file of files) {
    if (!file.startsWith(WEBCAM_PREFIX)) {
      continue;
    }

    const fileToTranscribe = path.join(absoluteFolder, file);

    const outPath = path.join(
      absoluteFolder,
      `${(file.split(".")[0] as string).replace(WEBCAM_PREFIX, "subs")}.json`,
    );

    if (existsSync(outPath)) {
      console.log("Already transcribed", outPath);
    } else {
      console.log("Transcribing", fileToTranscribe);
      await captionFile({ file, outPath, fileToTranscribe });
      console.log("Transcribed to", outPath);
    }
  }
}
