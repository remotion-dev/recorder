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
  backgroundColor: "rgba(0, 0, 0, 0.9)",
  padding: 20,
  gap: 20,
  overflowY: "auto",
};

const clearStyle: React.CSSProperties = {
  borderBottom: "1px solid",
  color: "rgba(255, 255, 255, 0.5)",
  fontSize: 14,
  marginTop: 10,
  display: "inline-block",
  cursor: "pointer",
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
  clear: () => void;
  canClear: boolean;
}> = ({
  canSelectAudio,
  devices,
  canSelectScreen,
  onPickAudio,
  onPickVideo,
  onPickScreen,
  selectedAudioDevice,
  selectedVideoDevice,
  clear,
  canClear,
}) => {
  const videoInputs = useMemo(() => {
    return devices.filter((d) => d.kind === "videoinput");
  }, [devices]);
  const audioInputs = useMemo(() => {
    return devices.filter((d) => d.kind === "audioinput");
  }, [devices]);

  return (
    <AbsoluteFill style={container}>
      <div
        style={{
          flex: 1,
          opacity:
            canSelectAudio && selectedVideoDevice && !selectedAudioDevice
              ? 0.5
              : 1,
        }}
      >
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
        {selectedVideoDevice && canClear ? (
          <a style={clearStyle} onClick={clear}>
            Clear
          </a>
        ) : null}
      </div>
      {canSelectAudio ? (
        <div
          style={{
            flex: 1,
            opacity: !selectedVideoDevice && selectedAudioDevice ? 0.5 : 1,
          }}
        >
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
