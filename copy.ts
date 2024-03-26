import fs from "fs";
import { WEBCAM_PREFIX } from "./config/cameras";
import { getDownloadsFolder } from "./scripts/get-downloads-folder";
import { removeSilence } from "./scripts/remove-silence";

const prefix = "empty";

const downloadsDir = getDownloadsFolder();
const filesFromDownloads = fs.readdirSync(downloadsDir);

const webcam = filesFromDownloads.filter((file) =>
  file.startsWith(WEBCAM_PREFIX),
);
const sorted = webcam.sort((a, b) => {
  const timestampA = Number(a.match(/([0-9]+)/)![1]);
  const timestampB = Number(b.match(/([0-9]+)/)![1]);

  return timestampB - timestampA;
});

const latest = sorted[0];
const latestTimestamp = Number(latest.match(/([0-9]+)/)![1]);

await removeSilence(latestTimestamp, prefix);

console.log("Copied", latest);
