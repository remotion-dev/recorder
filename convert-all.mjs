import { execSync } from "child_process";
import fs from "fs";

const folders = fs.readdirSync("public").filter((f) => f !== ".DS_Store");

for (const folder of folders) {
  const files = fs
    .readdirSync(`public/${folder}`)
    .filter((f) => f !== ".DS_Store");
  console.log(files);
  for (const file of files) {
    if (file.endsWith("mp4")) {
      continue;
    }

    console.log(`public/${folder}/${file}`);

    execSync(
      `npx remotion ffmpeg -i public/${folder}/${file} -movflags +faststart -r 30 -y public/${folder}/${file.replace(
        ".webm",
        ".mp4"
      )}`,
      {
        stdio: "inherit",
      }
    );
  }
}

console.log(folders);
