export type MaxResolution =
  | {
      width: number;
      height: null;
    }
  | {
      width: null;
      height: number;
    }
  | {
      width: number;
      height: number;
    };

export const getMaxResolutionOfDevice = (
  device: MediaDeviceInfo,
): MaxResolution | null => {
  if (typeof InputDeviceInfo === "undefined") {
    return null;
  }

  if (!(device instanceof InputDeviceInfo)) {
    return null;
  }

  const capabilities = device.getCapabilities();

  const width = capabilities.width?.max ?? null;
  const height = capabilities.height?.max ?? null;

  if (width === null && height === null) {
    return null;
  }

  return {
    width,
    height,
  } as MaxResolution;
};
