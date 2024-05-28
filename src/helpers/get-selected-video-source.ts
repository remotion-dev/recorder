export type SelectedSource =
  | {
      type: "camera";
      deviceId: string;
      maxWidth: number | null;
      maxHeight: number | null;
    }
  | {
      type: "display";
    };

export enum VideoSize {
  "4K" = "4k",
  "Full HD" = "FullHD",
  HD = "HD",
  SD = "SD",
}

export const VIDEO_SIZES: Record<VideoSize, { width: number; height: number }> =
  {
    [VideoSize["4K"]]: { width: 3840, height: 2160 },
    [VideoSize["Full HD"]]: { width: 1920, height: 1080 },
    [VideoSize.HD]: { width: 1280, height: 720 },
    [VideoSize.SD]: { width: 640, height: 480 },
  };

export const getSelectedVideoSource = ({
  value,
  devices,
  size = VideoSize.HD,
}: {
  value: string;
  devices: MediaDeviceInfo[];
  size?: VideoSize;
}): SelectedSource | null => {
  if (value === "undefined") {
    return null;
  }

  const device = devices.find((d) => d.deviceId === value);

  if (
    typeof InputDeviceInfo !== "undefined" &&
    device instanceof InputDeviceInfo
  ) {
    const capabilities = device.getCapabilities();
    const width = capabilities.width?.max ?? null;
    const height = capabilities.height?.max ?? null;

    return {
      type: "camera",
      deviceId: device.deviceId,
      maxWidth:
        !width || width < VIDEO_SIZES[size].width
          ? width
          : VIDEO_SIZES[size].width,
      maxHeight:
        !height || height < VIDEO_SIZES[size].height
          ? height
          : VIDEO_SIZES[size].height,
    };
  }

  return {
    type: "camera",
    deviceId: value,
    maxWidth: null,
    maxHeight: null,
  };
};
