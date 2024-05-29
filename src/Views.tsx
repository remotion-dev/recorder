/* eslint-disable no-negated-condition */
/* eslint-disable no-alert */
import { useCallback, useMemo, useState } from "react";
import { WEBCAM_PREFIX } from "../config/cameras";
import type { Dimensions } from "../config/layout";
import { getDeviceLabel } from "./App";
import { CropIndicator } from "./CropIndicator";
import { PrefixLabel } from "./PrefixAndResolution";
import { ToggleRotate } from "./Rotate";
import { Stream } from "./Stream";
import { ToggleCrop } from "./ToggleCrop";
import { CurrentAudio } from "./components/CurrentAudio";
import { CurrentVideo } from "./components/CurrentVideo";
import { StreamPicker } from "./components/StreamPicker";
import { NoVolumeMeter, VolumeMeter } from "./components/VolumeMeter";
import { canRotateCamera } from "./helpers/can-rotate-camera";
import { getMaxResolutionOfDevice } from "./helpers/get-max-resolution-of-device";
import {
  VideoSize,
  getSelectedVideoSource,
} from "./helpers/get-selected-video-source";
import { Prefix } from "./helpers/prefixes";

const viewContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  margin: 10,
  backgroundColor: "#242424",
  borderRadius: 10,
  overflow: "hidden",
  width: "100%",
  height: "100%",
  maxHeight: "100%",
  maxWidth: "100%",
  position: "relative",
};

const topBar: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: 4,
  paddingLeft: 10,
  height: 48,
};

const streamViewport: React.CSSProperties = {
  flex: 1,
  position: "relative",
};

const localStorageKey = "showCropIndicator";

export const View: React.FC<{
  devices: MediaDeviceInfo[];
  setMediaStream: (prefix: Prefix, source: MediaStream | null) => void;
  mediaStream: MediaStream | null;
  prefix: Prefix;
}> = ({ devices, setMediaStream, prefix, mediaStream }) => {
  const initialCropIndicatorState = useMemo(() => {
    return (
      localStorage.getItem(localStorageKey) === "true" &&
      prefix === WEBCAM_PREFIX
    );
  }, [prefix]);

  const [showCropIndicator, setShowCropIndicator] = useState(
    initialCropIndicatorState,
  );

  // TODO: Based on initial value
  const [showPicker, setShowPicker] = useState(true);

  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string | null>(
    null,
  );

  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string | null>(
    null,
  );

  const recordAudio = prefix === WEBCAM_PREFIX;
  const [resolution, setResolution] = useState<Dimensions | null>(null);
  const [preferPortrait, setPreferPortrait] = useState(false);
  const [sizeConstraint, setSizeConstraint] = useState<VideoSize | null>(null);

  const onToggleCrop = useCallback(() => {
    setShowCropIndicator((prev) => {
      window.localStorage.setItem(localStorageKey, String(!prev));
      return !prev;
    });
  }, []);

  const onToggleRotate = useCallback(() => {
    setPreferPortrait((prev) => {
      return !prev;
    });
  }, []);

  const selectScreen = useCallback(async () => {
    setSelectedVideoDevice("display");
    setShowPicker(false);
  }, []);

  const activeVideoDevice = useMemo(() => {
    return devices.find((d) => d.deviceId === selectedVideoDevice);
  }, [selectedVideoDevice, devices]);
  const activeAudioDevice = useMemo(() => {
    return devices.find((d) => d.deviceId === selectedAudioDevice);
  }, [selectedAudioDevice, devices]);

  const maxResolution = useMemo(() => {
    if (!activeVideoDevice) {
      return null;
    }

    return getMaxResolutionOfDevice(activeVideoDevice);
  }, [activeVideoDevice]);

  const selectedVideoSource = useMemo(() => {
    if (selectedVideoDevice === "display") {
      return { type: "display" as const };
    }
    if (!activeVideoDevice) {
      return null;
    }

    return getSelectedVideoSource({
      device: activeVideoDevice,
      resolutionConstraint: sizeConstraint,
      maxResolution,
    });
  }, [activeVideoDevice, maxResolution, selectedVideoDevice, sizeConstraint]);

  const videoDeviceLabel = useMemo(() => {
    if (!activeVideoDevice) {
      return null;
    }

    return getDeviceLabel(activeVideoDevice);
  }, [activeVideoDevice]);

  const audioDeviceLabel = useMemo(() => {
    if (!activeAudioDevice) {
      return null;
    }

    return getDeviceLabel(activeAudioDevice);
  }, [activeAudioDevice]);

  const cameraRotateable = useMemo(() => {
    return canRotateCamera({
      selectedSource: selectedVideoSource,
      preferPortrait,
      resolution,
    });
  }, [preferPortrait, resolution, selectedVideoSource]);

  const onPickVideo = useCallback(
    (device: MediaDeviceInfo) => {
      setSelectedVideoDevice(device.deviceId);
      if (recordAudio && !selectedAudioDevice) {
        return;
      }
      setShowPicker(false);
    },
    [recordAudio, selectedAudioDevice],
  );

  const onPickAudio = useCallback(
    (device: MediaDeviceInfo) => {
      setSelectedAudioDevice(device.deviceId);
      if (!selectedVideoDevice) {
        return;
      }
      setShowPicker(false);
    },
    [selectedVideoDevice],
  );

  return (
    <div style={viewContainer}>
      <div style={topBar}>
        <PrefixLabel prefix={prefix} />
        <div style={{ width: 15 }}></div>

        {resolution && (
          <CurrentVideo
            resolution={resolution}
            label={videoDeviceLabel ?? "Screen Share"}
            sizeConstraint={sizeConstraint}
            setSizeConstraint={setSizeConstraint}
            maxResolution={maxResolution}
            isScreenshare={selectedVideoSource?.type === "display"}
            onClick={() => {
              setShowPicker((p) => !p);
            }}
          ></CurrentVideo>
        )}
        {audioDeviceLabel ? (
          <CurrentAudio
            onClick={() => {
              setShowPicker((p) => !p);
            }}
            label={audioDeviceLabel}
          ></CurrentAudio>
        ) : null}
        {prefix === WEBCAM_PREFIX ? (
          <ToggleCrop
            pressed={showCropIndicator}
            onPressedChange={onToggleCrop}
          />
        ) : null}
        {cameraRotateable ? (
          <ToggleRotate
            pressed={preferPortrait}
            onPressedChange={onToggleRotate}
          />
        ) : null}
      </div>
      {prefix === WEBCAM_PREFIX ? (
        <VolumeMeter mediaStream={mediaStream} />
      ) : (
        <NoVolumeMeter></NoVolumeMeter>
      )}
      <div style={streamViewport}>
        <Stream
          selectedAudioSource={selectedAudioDevice}
          selectedVideoSource={selectedVideoSource}
          recordAudio={recordAudio}
          setResolution={setResolution}
          mediaStream={mediaStream}
          setMediaStream={setMediaStream}
          prefix={prefix}
          preferPortrait={preferPortrait}
        />
        {showCropIndicator && resolution ? (
          <CropIndicator resolution={resolution} />
        ) : null}
        {showPicker ? (
          <StreamPicker
            onPickVideo={onPickVideo}
            onPickAudio={onPickAudio}
            canSelectAudio={recordAudio}
            devices={devices}
            canSelectScreen={prefix !== WEBCAM_PREFIX}
            onPickScreen={selectScreen}
            selectedAudioDevice={selectedAudioDevice}
            selectedVideoDevice={selectedVideoDevice}
          />
        ) : null}
      </div>
    </div>
  );
};
