import { $ } from "bun";
import { renameSync } from "fs";
import { WEBCAM_PREFIX } from "./config/cameras";

type FfmpegVolumeOutput = {
  input_i: string;
  input_tp: string;
  input_lra: string;
  input_thresh: string;
  output_i: string;
  output_tp: string;
  output_lra: string;
  output_thresh: string;
  normalization_type: string;
  target_offset: string;
};

const id = "zoomblur";

const files = await $`ls public/${id}`.quiet();
const webcamFiles = files.stdout
  .toString("utf8")
  .split("\n")
  .filter((f) => f.startsWith(WEBCAM_PREFIX));

const decibelValues: number[] = [];

for (const file of webcamFiles) {
  const path = `public/${id}/${file}`;
  const cmd =
    await $`ffmpeg -hide_banner -i ${path} -af loudnorm=I=-23:LRA=7:print_format=json -f null -`.quiet();
  const output = cmd.stderr.toString("utf8");
  const lines = output.split("\n");
  const indexOfLineBeforeStart = lines.findIndex((line) =>
    line.includes("[Parsed_loudnorm_0 @"),
  );
  const json = JSON.parse(
    lines.slice(indexOfLineBeforeStart + 1).join("\n"),
  ) as FfmpegVolumeOutput;
  console.log(path, `${json.input_i}dB`);
  decibelValues.push(parseFloat(json.input_i));
}

const average = decibelValues.reduce((a, b) => a + b, 0) / decibelValues.length;
console.log("Average", `${average}dB`);
const toApply = Math.max(average, -20);
console.log("Applying", `${toApply}dB`);

for (const file of webcamFiles) {
  const path = `public/${id}/${file}`;
  const copiedPath = `public/${id}/normalized-${file}`;
  await $`ffmpeg -hide_banner -i ${path} -af loudnorm=I=${toApply}:LRA=7:TP=-2.0 -c:v copy ${copiedPath} -y`;
  renameSync(copiedPath, path);
}
