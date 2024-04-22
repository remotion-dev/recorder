import { $ } from "bun";
import { renameSync, unlinkSync } from "fs";
const ls = (await $`ls public/marathon`).stdout.toString("utf-8");
const files = ls.split("\n");

for (const file of files) {
  if (
    file.toLowerCase().endsWith(".mov") ||
    file.toLowerCase().endsWith(".mp4")
  ) {
    await $`ffmpeg -i public/marathon/${file} public/marathon/_${file}.mp4`;
    unlinkSync(`public/marathon/${file}`);
    renameSync(
      `public/marathon/_${file}.mp4`,
      `public/marathon/${file.replace(/ /g, "_")}`,
    );
  }
}
