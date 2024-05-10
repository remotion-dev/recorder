import { execSync } from "node:child_process";
import { existsSync, unlinkSync } from "node:fs";
import path from "path";
import { prefixes } from "../src/Views";
import { getDownloadsFolder } from "./get-downloads-folder";
import { checkVideoIntegrity } from "./server/check-video-integrity";

const convertAndRemoveSilence = ({
  input,
  output,
}: {
  input: string;
  output: string;
}) => {
  execSync(
    [
      "bunx remotion ffmpeg",
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

  checkVideoIntegrity(output);
  unlinkSync(input);
};

type ScriptProps = {
  caller: "script";
  latestTimestamp: number;
  prefix: string;
};

type ServerProps = {
  caller: "server";
  latestTimestamp: number;
  customFileLocation: string;
};

export const convertVideosA = async (props: ScriptProps | ServerProps) => {
  const { latestTimestamp, caller } = props;

  let fileLocation;
  if (props.caller === "server") {
    fileLocation = props.customFileLocation;
  } else {
    fileLocation = getDownloadsFolder();
  }

  for (const prefix of prefixes) {
    const latest = `${prefix}${latestTimestamp}.webm`;
    const src = path.join(fileLocation, latest);
    const folder =
      caller === "server"
        ? props.customFileLocation
        : path.join("public", props.prefix);

    if (existsSync(src)) {
      convertAndRemoveSilence({
        input: src,
        output: path.join(folder, latest.replace(".webm", ".mp4")),
      });
    }
  }
};
