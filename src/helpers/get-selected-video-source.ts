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

export const getSelectedVideoSource = ({
  value,
  devices,
}: {
  value: string;
  devices: MediaDeviceInfo[];
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
    return {
      type: "camera",
      deviceId: device.deviceId,
      maxWidth: capabilities.width?.max ?? null,
      maxHeight: capabilities.height?.max ?? null,
    };
  }

  return {
    type: "camera",
    deviceId: value,
    maxWidth: null,
    maxHeight: null,
  };
};
