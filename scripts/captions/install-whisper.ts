import type { WhisperModel } from "@remotion/install-whisper-cpp";
import {
  downloadWhisperModel,
  installWhisperCpp,
} from "@remotion/install-whisper-cpp";
import path from "path";

// TODO: Put this in config
export const WHISPER_PATH = path.join(process.cwd(), "whisper.cpp");
export const WHISPER_MODEL: WhisperModel = "medium.en";

export const ensureWhisper = async () => {
  await installWhisperCpp({
    to: WHISPER_PATH,
    version: "48a145",
    printOutput: true,
  });
  await downloadWhisperModel({
    model: "medium.en",
    folder: WHISPER_PATH,
    printOutput: true,
  });
};
