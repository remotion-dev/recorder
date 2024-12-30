import { createContext, useContext, useEffect, useState } from "react";
import { enumerateDevicesOrTimeOut } from "./helpers/enumerate-devices-or-time-out";
import { Label, formatDeviceLabel } from "./helpers/format-device-label";

export const DevicesContext = createContext<MediaDeviceInfo[] | null>(null);

const storeLabelsToLS = (devices: MediaDeviceInfo[]) => {
  const labels: Label[] = JSON.parse(localStorage.getItem("labels") ?? "[]");
  devices.forEach((device) => {
    const id = device.deviceId;
    const cleanLabel = formatDeviceLabel(device.label);

    if (!labels.some((l) => l.id === id) && cleanLabel !== "") {
      labels.push({ id, label: cleanLabel });
    }
  });

  localStorage.setItem("labels", JSON.stringify(labels));
};

const hasNewDevices = (devices: MediaDeviceInfo[]): boolean => {
  const labels: Label[] = JSON.parse(localStorage.getItem("labels") || "[]");

  const hasNew = !devices.every((device) => {
    return labels.some((l) => l.id === device.deviceId);
  });

  return hasNew;
};

export const WaitingForDevices: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[] | null>(null);

  useEffect(() => {
    const checkDeviceLabels = async () => {
      try {
        const fetchedDevices = await enumerateDevicesOrTimeOut();

        const hasEmptyLabels = fetchedDevices.some(
          (device) => device.label === "",
        );
        const hasNew = hasNewDevices(fetchedDevices);
        if (hasNew && hasEmptyLabels) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          const _devices = await navigator.mediaDevices.enumerateDevices();
          storeLabelsToLS(_devices);
          stream.getAudioTracks().forEach((track) => track.stop());
          stream.getVideoTracks().forEach((track) => track.stop());
        } else if (hasNew) {
          storeLabelsToLS(fetchedDevices);
        }

        setDevices(fetchedDevices);
      } catch (err) {
        alert((err as Error).message);
        console.log(err);
      }
    };

    checkDeviceLabels();
  }, []);

  if (devices === null) {
    return (
      <div className="absolute inset-0 flex justify-center items-center text-sm text-muted-foreground">
        Finding devices...
      </div>
    );
  }

  return (
    <DevicesContext.Provider value={devices}>
      {children}
    </DevicesContext.Provider>
  );
};

export const useDevices = (): MediaDeviceInfo[] => {
  const context = useContext(DevicesContext);
  if (context === null) {
    throw new Error("useDevices must be used within a DevicesContextProvider");
  }

  return context;
};
