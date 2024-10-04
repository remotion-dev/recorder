import { Caption } from "@remotion/captions";
import { StaticFile } from "@remotion/studio";

export const fetchCaptions = async (
  file: StaticFile | null,
): Promise<Caption[] | null> => {
  if (!file) {
    return null;
  }

  try {
    const res = await fetch(file.src);
    const data = await res.json();
    const captions = data as Caption[];
    return captions;
  } catch (error) {
    console.error("Error fetching WhisperOutput from JSON:", error);
    return null;
  }
};
