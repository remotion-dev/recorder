import {
  downloadWhisperModel,
  installWhisperCpp,
} from "@remotion/install-whisper-cpp";
import { WHISPER_MODEL, WHISPER_PATH, WHISPER_REF } from "../../config/whisper";

export const ensureWhisper = async () => {
  await installWhisperCpp({
    to: WHISPER_PATH,
    version: WHISPER_REF,
    printOutput: true,
  });
  await downloadWhisperModel({
    model: WHISPER_MODEL,
    folder: WHISPER_PATH,
    printOutput: true,
  });
};
