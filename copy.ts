import { getSilentParts } from "@remotion/renderer";
import { execSync } from "child_process";
import fs, { existsSync, mkdirSync } from "fs";
import path from "path";
import { getDownloadsFolder } from "./scripts/get-downloads-folder";

const prefix = "empty";

const downloadsDir = getDownloadsFolder();

const filesFromDownloads = fs.readdirSync(downloadsDir);

const webcam = filesFromDownloads.filter((file) => file.includes("webcam"));
const sorted = webcam.sort((a, b) => {
  const timestampA = Number(a.match(/([0-9]+)/)![1]);
  const timestampB = Number(b.match(/([0-9]+)/)![1]);

  return timestampB - timestampA;
});

const latest = sorted[0];
const latestTimestamp = Number(latest.match(/([0-9]+)/)![1]);

const folder = `public${path.sep}${prefix}`;

const displayLatest = `display${latestTimestamp}.webm`;
const webcamLatest = `webcam${latestTimestamp}.webm`;

const displaySrc = path.join(downloadsDir, displayLatest);

const webcamSrc = path.join(downloadsDir, webcamLatest);

mkdirSync(folder, { recursive: true });

const { audibleParts } = await getSilentParts({
  src: webcamSrc,
  minDurationInSeconds: 0.3,
});

const padding = 0.25;

const ffmpegTrim =
  audibleParts.length > 0
    ? [
        "-ss",
        audibleParts[0].startInSeconds - padding,
        "-to",
        audibleParts[audibleParts.length - 1].endInSeconds + padding * 2,
      ]
    : [];

const convert = (i: string, o: string) => {
  execSync(
    [
      "npx remotion ffmpeg",
      ...ffmpegTrim,
      "-i",
      i,
      "-movflags",
      "+faststart",
      "-r",
      "30",
      "-y",
      o,
    ].join(" "),
    {
      stdio: "inherit",
    },
  );
};

if (existsSync(displaySrc)) {
  convert(
    displaySrc,
    path.join(folder, displayLatest.replace(".webm", ".mp4")),
  );
}

convert(webcamSrc, path.join(folder, webcamLatest.replace(".webm", ".mp4")));
console.log("copied", latest, displayLatest);
