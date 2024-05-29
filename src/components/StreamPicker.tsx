import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { getDeviceLabel } from "../App";
import { DeviceItem } from "../DeviceItem";
import { getMaxResolutionOfDevice } from "../helpers/get-max-resolution-of-device";

const title: React.CSSProperties = {
  fontWeight: "bold",
};

const container: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  padding: 20,
  gap: 20,
};

export const StreamPicker: React.FC<{
  devices: MediaDeviceInfo[];
  canSelectAudio: boolean;
  canSelectScreen: boolean;
  onPickVideo: (device: MediaDeviceInfo) => void;
  onPickAudio: (device: MediaDeviceInfo) => void;
  onPickScreen: () => void;
  selectedVideoDevice: string | null;
  selectedAudioDevice: string | null;
}> = ({
  canSelectAudio,
  devices,
  canSelectScreen,
  onPickAudio,
  onPickVideo,
  onPickScreen,
  selectedAudioDevice,
  selectedVideoDevice,
}) => {
  const videoInputs = useMemo(() => {
    return devices.filter((d) => d.kind === "videoinput");
  }, [devices]);
  const audioInputs = useMemo(() => {
    return devices.filter((d) => d.kind === "audioinput");
  }, [devices]);

  return (
    <AbsoluteFill style={container}>
      <div style={{ flex: 1 }}>
        <div style={title}>Select video</div>
        {canSelectScreen ? (
          <DeviceItem
            handleClick={() => {
              onPickScreen();
            }}
            deviceLabel={"Screen capture"}
            maxResolution={null}
            type="screen"
            selected={selectedVideoDevice === "display"}
          />
        ) : null}
        {videoInputs.map((d) => {
          return (
            <DeviceItem
              type="camera"
              key={d.deviceId}
              deviceLabel={getDeviceLabel(d)}
              maxResolution={getMaxResolutionOfDevice(d)}
              handleClick={() => {
                onPickVideo(d);
              }}
              selected={selectedVideoDevice === d.deviceId}
            />
          );
        })}
      </div>
      {canSelectAudio ? (
        <div style={{ flex: 1 }}>
          <div style={title}>Select audio</div>

          {audioInputs.map((d) => {
            return (
              <DeviceItem
                type="microphone"
                key={d.deviceId}
                deviceLabel={getDeviceLabel(d)}
                maxResolution={null}
                handleClick={() => {
                  onPickAudio(d);
                }}
                selected={selectedAudioDevice === d.deviceId}
              />
            );
          })}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
