import type { WhisperModel } from "@remotion/install-whisper-cpp";
import path from "path";

export const WHISPER_PATH = path.join(process.cwd(), "whisper.cpp");
export const WHISPER_MODEL: WhisperModel = "medium.en";
// The git reference, can be a commit, branch or tag
export const WHISPER_REF = "9fab28135c7867bb7eccd9ebcd2ea8d52e42ca81";
