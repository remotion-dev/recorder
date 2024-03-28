import { execSync } from "child_process";
import { statSync } from "fs";
import os from "os";

function darwin() {
  return `${process.env.HOME}/Downloads`;
}

function unix() {
  let dir;
  try {
    dir = execSync("xdg-user-dir DOWNLOAD", { encoding: "utf8" }).trim();
  } catch (_) {}

  if (dir && dir !== process.env.HOME) return dir;

  let stat;
  const homeDownloads = `${process.env.HOME}/Downloads`;
  try {
    stat = statSync(homeDownloads);
  } catch (_) {}

  if (stat) return homeDownloads;

  return "/tmp/";
}

function windows() {
  return process.env.USERPROFILE + "/Downloads";
}

export const getDownloadsFolder = () => {
  return {
    darwin,
    freebsd: unix,
    linux: unix,
    sunos: unix,
    win32: windows,
  }[os.platform()]();
};
