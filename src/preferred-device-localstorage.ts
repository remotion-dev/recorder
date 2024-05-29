import { Prefix } from "./helpers/prefixes";

export const getPreferredDeviceForPrefix = (prefix: Prefix) => {
  return window.localStorage.getItem(`recorder.preferredDevice.${prefix}`);
};

export const setPreferredDeviceForPrefix = (
  prefix: Prefix,
  deviceId: string,
) => {
  window.localStorage.setItem(`recorder.preferredDevice.${prefix}`, deviceId);
};

export const getPreferredDeviceIfExists = (
  prefix: Prefix,
  devices: MediaDeviceInfo[],
) => {
  const deviceId = getPreferredDeviceForPrefix(prefix);
  if (deviceId === "" || deviceId === null) {
    return null;
  }

  const device = devices.find((d) => d.deviceId === deviceId);

  if (device === undefined) {
    return null;
  }

  return device.deviceId;
};
