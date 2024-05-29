import { Dimensions } from "../../config/layout";

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

export type VideoSize = "4K" | "1080p" | "720p" | "480p";

export const VIDEO_SIZES: { [key in VideoSize]: Dimensions } = {
  "4K": { width: 3840, height: 2160 },
  "1080p": { width: 1920, height: 1080 },
  "720p": { width: 1280, height: 720 },
  "480p": { width: 640, height: 480 },
};

export const getSelectedVideoSource = ({
  deviceId,
  devices,
  resolutionConstraint,
}: {
  deviceId: string;
  devices: MediaDeviceInfo[];
  resolutionConstraint: VideoSize | null;
}): SelectedSource | null => {
  if (deviceId === "undefined") {
    return null;
  }

  const constrainedWidth =
    resolutionConstraint === null
      ? null
      : VIDEO_SIZES[resolutionConstraint].width;
  const constrainedHeight =
    resolutionConstraint === null
      ? null
      : VIDEO_SIZES[resolutionConstraint].height;

  const device = devices.find((d) => d.deviceId === deviceId);

  if (typeof InputDeviceInfo === "undefined") {
    return {
      type: "camera",
      deviceId: deviceId,
      maxWidth: constrainedWidth,
      maxHeight: constrainedHeight,
    };
  }

  if (!(device instanceof InputDeviceInfo)) {
    return {
      type: "camera",
      deviceId: deviceId,
      maxWidth: constrainedWidth,
      maxHeight: constrainedHeight,
    };
  }

  const capabilities = device.getCapabilities();
  const width = capabilities.width?.max ?? null;
  const height = capabilities.height?.max ?? null;

  const maxWidth =
    constrainedWidth === null
      ? width
      : Math.min(constrainedWidth, width ?? Infinity);
  const maxHeight =
    constrainedHeight === null
      ? height
      : Math.min(constrainedHeight, height ?? Infinity);

  return {
    type: "camera",
    deviceId: device.deviceId,
    maxWidth: maxWidth,
    maxHeight: maxHeight,
  };
};
