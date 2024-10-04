// Run this with `bun migrate.ts`

import { toCaptions } from "@remotion/install-whisper-cpp";
import { write } from "bun";
import { readFileSync, readdirSync, statSync } from "node:fs";

for (const item of readdirSync("public")) {
  const isFolder = statSync(`public/${item}`).isDirectory();
  if (!isFolder) {
    continue;
  }

  const subs = readdirSync(`public/${item}`).filter((f) => f.endsWith(".json"));
  for (const sub of subs) {
    const whisperCppOutput = JSON.parse(
      readFileSync(`public/${item}/${sub}`, "utf-8"),
    );
    if (!whisperCppOutput.systeminfo) {
      continue;
    }
    const { captions } = toCaptions({ whisperCppOutput });
    write(`public/${item}/${sub}`, JSON.stringify(captions, null, 2));
  }
}
