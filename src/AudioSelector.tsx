/* eslint-disable no-alert */

import type { SetStateAction } from "react";
import { useCallback } from "react";

export const AudioSelector: React.FC<{
  devices: MediaDeviceInfo[];
  setSelectedAudioSource: React.Dispatch<
    SetStateAction<ConstrainDOMString | null>
  >;
  updateAudioChannel: () => void;
}> = ({ devices, setSelectedAudioSource, updateAudioChannel }) => {
  const selectAudioSource = useCallback(
    (selectedAudioSource: ConstrainDOMString | null) => {
      setSelectedAudioSource(selectedAudioSource as string);
    },
    [setSelectedAudioSource],
  );

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      Audio Source
      <select
        onChange={(e) => {
          selectAudioSource(e.target.value as ConstrainDOMString);
          updateAudioChannel();
        }}
        style={{ margin: "10px 0px" }}
      >
        {devices
          .filter((d) => d.kind === "audioinput")
          .map((d) => {
            return (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label}
              </option>
            );
          })}
      </select>
    </div>
  );
};
