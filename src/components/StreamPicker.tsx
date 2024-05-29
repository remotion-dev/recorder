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
}> = ({
  canSelectAudio,
  devices,
  canSelectScreen,
  onPickAudio,
  onPickVideo,
  onPickScreen,
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
              />
            );
          })}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
