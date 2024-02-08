export type Label = { id: string; label: string };

const removeUsbIdentifier = (label: string) => {
  return label.replace(/\(\w{4}:\w{4}\)/, "").trim();
};

const removeBuiltIn = (label: string) => {
  return label.replace(/\(Built-in\)/, "").trim();
};

const removeVirtual = (label: string) => {
  return label.replace(/\(Virtual\)/, "").trim();
};

const takeStringInBraces = (label: string): string => {
  const match = label.match(/\((.*)\)/);
  if (!match) {
    return label;
  }

  if (match[1] === "Bluetooth") {
    return label.replace(/\(Bluetooth\)/, "").trim();
  }

  return match[1] as string;
};

const removeLeadingNumber = (label: string) => {
  return label.replace(/^\d+- /, "").trim();
};

export const formatLabel = (device: Omit<MediaDeviceInfo, "toJSON">) => {
  const { label } = device;

  const withoutUsb = removeUsbIdentifier(label);
  const withoutBuiltIn = removeBuiltIn(withoutUsb);
  const withoutVirtual = removeVirtual(withoutBuiltIn);
  const stringFromBraces = takeStringInBraces(withoutVirtual);
  const withoutLeadingNumber = removeLeadingNumber(stringFromBraces);

  return withoutLeadingNumber;
};

export const getDeviceLabel = (device: MediaDeviceInfo): string => {
  const labels: Label[] = JSON.parse(localStorage.getItem("labels") ?? "[]");
  const found = labels.find((l) => l.id === device.deviceId);
  if (found) {
    return found.label;
  }

  return formatLabel(device);
};
