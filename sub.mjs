import { execSync } from "node:child_process";
import { renameSync } from "node:fs";
import path from "path";

const subFile = (file) => {
  execSync(
    `whisper --language=English --word_timestamps True --output_format=json --output_dir=${path.dirname(
      file
    )} ${file}`,
    {
      stdio: "inherit",
    }
  );

  const output = file.replace(".mp4", ".json");
  renameSync(output, output.replace("webcam", "subs"));
};

subFile(
  "/Users/jonathanburger/dual-recorder/public/dvd/webcam1691688332959.mp4"
);
