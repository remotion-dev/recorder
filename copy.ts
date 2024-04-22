import fs from "fs";
import { WEBCAM_PREFIX } from "./config/cameras";
import { convertAndTrimVideo } from "./scripts/convert-and-trim-video";
import { getDownloadsFolder } from "./scripts/get-downloads-folder";

const prefix = "empty";

export const copyToDownloads = async () => {
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

  if (sorted.length === 0) {
    console.error(
      "No recordings found in your downloads folder. Copy process aborted.",
    );
    process.exit();
  }

  const latest = sorted[0];
  let latestTimestamp: number;
  try {
    latestTimestamp = Number(latest.match(/([0-9]+)/)![1]);
  } catch (err) {
    console.error("An error occured in the copying process: ", err);
    process.exit();
  }

  await convertAndTrimVideo({ caller: "script", latestTimestamp, prefix });

  console.log("Copied", latest);
};
