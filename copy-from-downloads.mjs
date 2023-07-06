import fs from "fs";
import { late } from "zod";

const prefix = "day5";

const downloadsDir = "/Users/jonathanburger/Downloads";
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

fs.copyFileSync(
  `${downloadsDir}/${displayLatest}`,
  `public/${prefix}/${displayLatest}`
);
fs.copyFileSync(`${downloadsDir}/${latest}`, `public/${prefix}/${latest}`);
console.log("copied", latest, displayLatest);
