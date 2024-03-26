import type { WhisperModel } from "@remotion/install-whisper-cpp";
import path from "path";

export const WHISPER_PATH = path.join(process.cwd(), "whisper.cpp");
export const WHISPER_MODEL: WhisperModel = "medium.en";
