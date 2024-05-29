import { SizeConstraint } from "./helpers/get-selected-video-source";

export const setPreferredResolutionForDevice = (
  deviceId: string,
  videoSize: SizeConstraint | null,
) => {
  localStorage.setItem(
    `preferred-constraint-${deviceId}`,
    JSON.stringify(videoSize),
  );
};

export const getPreferredResolutionForDevice = (
  deviceId: string | null,
): SizeConstraint => {
  if (deviceId === null) {
    return {
      maxSize: null,
      highestResolution: false,
    };
  }

  const stored = localStorage.getItem(`preferred-constraint-${deviceId}`);
  if (stored === null || stored === "null") {
    return {
      maxSize: null,
      highestResolution: false,
    };
  }

  return JSON.parse(stored) as SizeConstraint;
};
