import fs, { existsSync } from "fs";
import path from "path";

const prefix = "asyncproblem";

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
const displayLatest = `display${latestTimestamp}.webm`;

const displaySrc = `${downloadsDir}${path.sep}${displayLatest}`;

if (existsSync(displaySrc)) {
  fs.copyFileSync(
    displaySrc,
    `public${path.sep}${prefix}${path.sep}${displayLatest}`
  );
}

fs.copyFileSync(
  `${downloadsDir}${path.sep}${latest}`,
  `public${path.sep}${prefix}${path.sep}${latest}`
);
console.log("copied", latest, displayLatest);
