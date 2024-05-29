import React, { useCallback, useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { getDeviceLabel } from "../App";
import {
  MaxResolution,
  getMaxResolutionOfDevice,
} from "../helpers/get-max-resolution-of-device";

const iconStyle: React.CSSProperties = {
  width: 20,
  height: 20,
};

const CameraIcon: React.FC = () => {
  return (
    <svg style={iconStyle} viewBox="0 0 576 512">
      <path
        fill="white"
        d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"
      />
    </svg>
  );
};

const MicIcon: React.FC = () => {
  return (
    <svg style={iconStyle} viewBox="0 0 384 512">
      <path
        fill="white"
        d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"
      />
    </svg>
  );
};

const deviceRow: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  width: "100%",
  paddingTop: 10,
  paddingBottom: 10,
  borderBottom: "1px solid #333",
  cursor: "pointer",
};

const spacer: React.CSSProperties = {
  width: 8,
};

const label: React.CSSProperties = {
  fontSize: 14,
};

const MaxResolutionLabel: React.FC<{
  maxResolution: MaxResolution | null;
}> = ({ maxResolution }) => {
  if (maxResolution === null) {
    return null;
  }

  return (
    <span style={label}>
      {maxResolution.width}x{maxResolution.height}
    </span>
  );
};

const DeviceItem: React.FC<{
  device: MediaDeviceInfo;
  label: string;
  type: "camera" | "microphone";
  onPick: (device: MediaDeviceInfo) => void;
}> = ({ device, type, onPick }) => {
  const maxResolution = useMemo(() => {
    return getMaxResolutionOfDevice(device);
  }, [device]);

  const handleClick = useCallback(() => {
    onPick(device);
  }, [device, onPick]);

  return (
    <div onClick={handleClick} style={deviceRow}>
      {type === "camera" ? <CameraIcon></CameraIcon> : null}
      {type === "microphone" ? <MicIcon></MicIcon> : null}
      <div style={spacer}></div>{" "}
      <span style={label}>{getDeviceLabel(device)}</span>
      <div style={{ flex: 1 }}></div>
      <MaxResolutionLabel maxResolution={maxResolution}></MaxResolutionLabel>
    </div>
  );
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
        {videoInputs.map((d) => {
          return (
            <DeviceItem
              onPick={onPickVideo}
              type="camera"
              device={d}
              key={d.deviceId}
            />
          );
        })}
      </div>
      {canSelectAudio ? (
        <div style={{ flex: 1 }}>
          {audioInputs.map((d) => {
            return (
              <DeviceItem
                onPick={onPickAudio}
                type="microphone"
                device={d}
                key={d.deviceId}
              />
            );
          })}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
