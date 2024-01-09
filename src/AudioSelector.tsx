/* eslint-disable no-alert */

import type { SetStateAction } from "react";
import { useCallback, useMemo } from "react";
import { getDeviceLabel } from "./App";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

export const AudioSelector: React.FC<{
  devices: MediaDeviceInfo[];
  setSelectedAudioSource: React.Dispatch<
    SetStateAction<ConstrainDOMString | null>
  >;
  audioSource: ConstrainDOMString | null;
}> = ({ devices, setSelectedAudioSource, audioSource }) => {
  const selectAudioSource = useCallback(
    (selectedAudioSource: ConstrainDOMString | null) => {
      setSelectedAudioSource(selectedAudioSource as string);
    },
    [setSelectedAudioSource],
  );
  const currentDeviceName = useMemo(() => {
    const currentDevice = devices.find((d) => d.deviceId === audioSource);

    if (!currentDevice) {
      return null;
    }

    return getDeviceLabel(currentDevice);
  }, [audioSource, devices]);

  return (
    <Select
      onValueChange={(value) => {
        selectAudioSource(value as ConstrainDOMString);
      }}
    >
      <SelectTrigger style={{ maxWidth: 200 }}>
        <SelectValue placeholder="Select audio">
          {currentDeviceName ?? "Select audio"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {devices
          .filter((d) => d.kind === "audioinput")
          .map((d) => {
            console.log(d);
            const label = getDeviceLabel(d);
            return (
              <SelectItem key={d.deviceId} value={d.deviceId}>
                {label}
              </SelectItem>
            );
          })}
      </SelectContent>
    </Select>
  );
};
