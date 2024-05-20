import { StaticFile } from "@remotion/studio";
import { WhisperCppOutput } from "../captions/types";

export const fetchWhisperCppOutput = async (
  file: StaticFile | null,
): Promise<WhisperCppOutput | null> => {
  if (!file) {
    return null;
  }

  try {
    const res = await fetch(file.src);
    const data = await res.json();
    return data as WhisperCppOutput;
  } catch (error) {
    console.error("Error fetching WhisperOutput from JSON:", error);
    return null;
  }
};
