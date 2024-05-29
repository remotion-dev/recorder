import { VideoSize } from "./helpers/get-selected-video-source";

export const setPreferredResolutionForDevice = (
  deviceId: string,
  videoSize: VideoSize | null,
) => {
  localStorage.setItem(`preferred-resolution-${deviceId}`, String(videoSize));
};

export const getPreferredResolutionForDevice = (deviceId: string | null) => {
  if (deviceId === null) {
    return {
      maxSize: null,
      minimumFps: null,
    };
  }

  const stored = localStorage.getItem(`preferred-resolution-${deviceId}`);
  if (stored === null || stored === "null") {
    return {
      maxSize: null,
      minimumFps: null,
    };
  }

  return stored as VideoSize;
};
