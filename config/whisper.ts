import type { Language, WhisperModel } from "@remotion/install-whisper-cpp";
import path from "path";

export const WHISPER_PATH = path.join(process.cwd(), "whisper.cpp");
export const WHISPER_MODEL: WhisperModel = "medium.en";
// The git reference, can be a commit, branch or tag
export const WHISPER_REF = "1.5.5";
export const TRANSCRIPTION_LANGUAGE: Language | null = null;
