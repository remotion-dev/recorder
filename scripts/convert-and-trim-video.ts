import { getSilentParts } from "@remotion/renderer";
import { execSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import path from "path";
import {
  ALTERNATIVE1_PREFIX,
  ALTERNATIVE2_PREFIX,
  DISPLAY_PREFIX,
  WEBCAM_PREFIX,
} from "../config/cameras";
import {
  MIN_DURATION_IN_SECONDS,
  PADDING_IN_SECONDS,
} from "../config/silence-removal";
import { getDownloadsFolder } from "./get-downloads-folder";

const convertAndRemoveSilence = ({
  input,
  output,
  ffmpegTrim,
}: {
  input: string;
  output: string;
  ffmpegTrim: string[];
}) => {
  execSync(
    [
      "npx remotion ffmpeg",
      ...ffmpegTrim,
      "-hide_banner",
      "-i",
      input,
      "-movflags",
      "+faststart",
      "-r",
      "30",
      "-y",
      output,
    ].join(" "),
    {
      stdio: "inherit",
    },
  );
};

export const convertAndTrimVideo = async (
  latestTimestamp: number,
  prefix: string,
) => {
  const downloadsDir = getDownloadsFolder();

  const displayLatest = `${DISPLAY_PREFIX}${latestTimestamp}.webm`;
  const webcamLatest = `${WEBCAM_PREFIX}${latestTimestamp}.webm`;
  const alt1Latest = `${ALTERNATIVE1_PREFIX}${latestTimestamp}.webm`;
  const alt2Latest = `${ALTERNATIVE2_PREFIX}${latestTimestamp}.webm`;

  const displaySrc = path.join(downloadsDir, displayLatest);
  const webcamSrc = path.join(downloadsDir, webcamLatest);
  const alt1Src = path.join(downloadsDir, alt1Latest);
  const alt2Src = path.join(downloadsDir, alt2Latest);

  const { audibleParts } = await getSilentParts({
    src: webcamSrc,
    minDurationInSeconds: MIN_DURATION_IN_SECONDS,
  });

  const folder = path.join("public", prefix);
  mkdirSync(folder, { recursive: true });

  if (audibleParts.length === 0) {
    throw new Error("Video has no audio");
  }

  const ffmpegTrim =
    audibleParts.length > 0
      ? [
          "-ss",
          String(audibleParts[0]!.startInSeconds - PADDING_IN_SECONDS),
          "-to",
          String(
            audibleParts[audibleParts.length - 1]!.endInSeconds +
              PADDING_IN_SECONDS * 2,
          ),
        ]
      : [];

  convertAndRemoveSilence({
    input: webcamSrc,
    output: path.join(folder, webcamLatest.replace(".webm", ".mp4")),
    ffmpegTrim,
  });

  if (existsSync(displaySrc)) {
    convertAndRemoveSilence({
      input: displaySrc,
      output: path.join(folder, displayLatest.replace(".webm", ".mp4")),
      ffmpegTrim,
    });
  }

  if (existsSync(alt1Src)) {
    convertAndRemoveSilence({
      input: alt1Src,
      output: path.join(folder, alt1Latest.replace(".webm", ".mp4")),
      ffmpegTrim,
    });
  }

  if (existsSync(alt2Src)) {
    convertAndRemoveSilence({
      input: alt2Src,
      output: path.join(folder, alt2Latest.replace(".webm", ".mp4")),
      ffmpegTrim,
    });
  }
};
