/* eslint-disable no-negated-condition */
/* eslint-disable no-alert */
import { useCallback, useMemo, useState } from "react";
import { WEBCAM_PREFIX } from "../config/cameras";
import { getDeviceLabel } from "./App";
import { CropIndicator } from "./CropIndicator";
import { PrefixLabel } from "./PrefixAndResolution";
import { RecordingStatus } from "./RecordButton";
import { ResolutionLimiter } from "./ResolutionLimiter";
import { ToggleRotate } from "./Rotate";
import { ResolutionAndFps, Stream } from "./Stream";
import { ToggleCrop } from "./ToggleCrop";
import { ClearCurrentVideo } from "./components/ClearCurrentVideo";
import { CurrentAudio } from "./components/CurrentAudio";
import { CurrentVideo } from "./components/CurrentVideo";
import { Divider } from "./components/Divider";
import { StreamPicker } from "./components/StreamPicker";
import { VolumeMeter } from "./components/VolumeMeter";
import { canRotateCamera } from "./helpers/can-rotate-camera";
import {
  MaxResolution,
  getMaxResolutionOfDevice,
} from "./helpers/get-max-resolution-of-device";
import {
  SizeConstraint,
  getSelectedVideoSource,
} from "./helpers/get-selected-video-source";
import { Prefix } from "./helpers/prefixes";
import {
  getPreferredDeviceIfExists,
  setPreferredDeviceForPrefix,
} from "./preferred-device-localstorage";
import { getPreferredResolutionForDevice } from "./preferred-resolution";
import { useMediaSources } from "./state/media-sources";
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
  paddingLeft: 10,
};

const streamViewport: React.CSSProperties = {
  flex: 1,
  position: "relative",
};

const localStorageKey = "showCropIndicator";

export const RecordingView: React.FC<{
  devices: MediaDeviceInfo[];
  prefix: Prefix;
  recordingStatus: RecordingStatus;
}> = ({ devices, prefix, recordingStatus }) => {
  const mediaSources = useMediaSources();
  const mediaStream = mediaSources[prefix];

  const initialCropIndicatorState = useMemo(() => {
    return (
      localStorage.getItem(localStorageKey) === "true" &&
      prefix === WEBCAM_PREFIX
    );
  }, [prefix]);

  const [showCropIndicator, setShowCropIndicator] = useState(
    initialCropIndicatorState,
  );

  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string | null>(
    () => getPreferredDeviceIfExists(prefix, "video", devices),
  );

  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string | null>(
    () => getPreferredDeviceIfExists(prefix, "audio", devices),
  );

  const [showPickerPreference, setShowPicker] = useState(
    () => !selectedVideoDevice && !selectedAudioDevice,
  );

  const recordAudio = prefix === WEBCAM_PREFIX;
  const [resolution, setResolution] = useState<ResolutionAndFps | null>(null);
  const [preferPortrait, setPreferPortrait] = useState(false);
  const [sizeConstraint, setSizeConstraint] = useState<SizeConstraint>(() =>
    getPreferredResolutionForDevice(selectedVideoDevice),
  );

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
    if (selectedVideoDevice === "display") {
      return "Screen Share";
    }

    if (!activeVideoDevice) {
      return null;
    }

    return getDeviceLabel(activeVideoDevice);
  }, [activeVideoDevice, selectedVideoDevice]);

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
      setPreferredDeviceForPrefix(prefix, "video", device.deviceId);
      if (recordAudio && !selectedAudioDevice) {
        return;
      }
      setShowPicker(false);
    },
    [prefix, recordAudio, selectedAudioDevice],
  );

  const onPickAudio = useCallback(
    (device: MediaDeviceInfo) => {
      setSelectedAudioDevice(device.deviceId);
      setPreferredDeviceForPrefix(prefix, "audio", device.deviceId);
      if (!selectedVideoDevice) {
        return;
      }
      setShowPicker(false);
    },
    [prefix, selectedVideoDevice],
  );

  const clear = useCallback(() => {
    setSelectedVideoDevice(null);
    setSelectedAudioDevice(null);
    setPreferredDeviceForPrefix(prefix, "video", null);
    setShowPicker(true);
    setResolution(null);
    console.log("clearing");
  }, [prefix]);

  const [resolutionLimiterOpen, setResolutionLimiterOpen] = useState(false);

  const canShowResolutionLimiter = Boolean(
    selectedVideoSource?.type === "display"
      ? false
      : videoDeviceLabel && activeVideoDevice && maxResolution,
  );

  const hasSelectedVideoOrAudio = Boolean(
    selectedVideoDevice || selectedAudioDevice,
  );

  const showPicker =
    showPickerPreference && recordingStatus.type !== "recording";
  const togglePicker = useCallback(() => {
    setShowPicker((prev) => !prev);
  }, []);

  return (
    <div
      style={viewContainer}
      data-recording={Boolean(
        recordingStatus.type === "recording" &&
          hasSelectedVideoOrAudio &&
          mediaStream.type === "loaded",
      )}
      className="outline-red-600 outline-0 data-[recording=true]:outline-2 outline"
    >
      <div style={topBar}>
        <div style={{ width: 10 }}></div>
        <PrefixLabel prefix={prefix} />
        <div style={{ width: 15 }}></div>
        <Divider></Divider>
        <CurrentVideo
          resolution={resolution}
          label={videoDeviceLabel ?? "No video selected"}
          isScreenshare={selectedVideoSource?.type === "display"}
          onClick={togglePicker}
          setResolutionLimiterOpen={setResolutionLimiterOpen}
          canShowResolutionLimiter={canShowResolutionLimiter}
          disabled={recordingStatus.type === "recording"}
        ></CurrentVideo>
        {selectedVideoSource && recordingStatus.type !== "recording" ? (
          <ClearCurrentVideo onClick={clear} />
        ) : null}
        {prefix === WEBCAM_PREFIX ? (
          <>
            <Divider></Divider>
            <CurrentAudio
              disabled={recordingStatus.type === "recording"}
              onClick={togglePicker}
              label={audioDeviceLabel}
            />
          </>
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
            disabled={recordingStatus.type === "recording"}
          />
        ) : null}
      </div>
      {prefix === WEBCAM_PREFIX ? (
        <VolumeMeter mediaStream={mediaStream} />
      ) : null}
      <div style={streamViewport}>
        <Stream
          selectedAudioSource={selectedAudioDevice}
          selectedVideoSource={selectedVideoSource}
          recordAudio={recordAudio}
          setResolution={setResolution}
          prefix={prefix}
          preferPortrait={preferPortrait}
          clear={clear}
        />
        {showCropIndicator && resolution && !showPicker ? (
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
            clear={clear}
            canClear={prefix !== WEBCAM_PREFIX}
          />
        ) : null}
        {canShowResolutionLimiter ? (
          <ResolutionLimiter
            sizeConstraint={sizeConstraint}
            setSizeConstraint={setSizeConstraint}
            maxResolution={maxResolution as MaxResolution}
            deviceName={videoDeviceLabel as string}
            deviceId={(activeVideoDevice as MediaDeviceInfo).deviceId}
            open={resolutionLimiterOpen}
            setOpen={setResolutionLimiterOpen}
          />
        ) : null}
      </div>
    </div>
  );
};
