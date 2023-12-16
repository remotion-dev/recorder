import { getSilentParts } from "@remotion/renderer";
import { execSync } from "child_process";
import fs, { existsSync, mkdirSync } from "fs";
import path from "path";

const prefix = "costs";

const downloadsDir =
  process.platform === "win32"
    ? "C:\\Users\\Jonny\\Downloads"
    : "/Users/jonathanburger/Downloads";
const filesFromDownloads = await fs.readdirSync(downloadsDir);

const webcam = filesFromDownloads.filter((file) => file.includes("webcam"));
const sorted = webcam.sort((a, b) => {
  const timestampA = Number(a.match(/([0-9]+)/)[1]);
  const timestampB = Number(b.match(/([0-9]+)/)[1]);

  return timestampB - timestampA;
});

const latest = sorted[0];
const latestTimestamp = Number(latest.match(/([0-9]+)/)[1]);

const folder = `public${path.sep}${prefix}`;

const displayLatest = `display${latestTimestamp}.webm`;
const webcamLatest = `webcam${latestTimestamp}.webm`;

const displaySrc = `${downloadsDir}${path.sep}${displayLatest}`;

const webcamSrc = `${downloadsDir}${path.sep}${webcamLatest}`;

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

const convert = (i, o) => {
  console.log({ i, o, audibleParts });

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
    `${folder}${path.sep}${displayLatest.replace(".webm", ".mp4")}`,
  );
}

convert(
  webcamSrc,
  `${folder}${path.sep}${webcamLatest.replace(".webm", ".mp4")}`,
);
console.log("copied", latest, displayLatest);
