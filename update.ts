import { $ } from "bun";
import { cpSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const tmp = path.join(tmpdir(), "recorder");

if ((await $`git status --porcelain`.quiet()).exitCode !== 0) {
  console.error(
    "Your Git status is dirty. Please commit or stash your changes before running this script.",
  );
  process.exit(1);
}

await $`git clone https://github.com/remotion-dev/recorder.git ${tmp}`;

const files = (await $`git ls-files`.quiet().cwd(tmp)).stdout
  .toString("utf-8")
  .split("\n")
  .filter(Boolean)
  .filter((file) => {
    if (file.startsWith("public")) {
      return false;
    }

    if (file.endsWith("Root.tsx")) {
      return false;
    }

    return true;
  });

for (const file of files) {
  const fullPath = path.join(tmp, file);
  cpSync(fullPath, path.join(process.cwd(), file));
}

console.log(
  "Pulled files from the current main branch of the Recorder (except public and Root.tsx)",
);
console.log("Please review the changes and commit them.");
