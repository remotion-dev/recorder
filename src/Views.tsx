/* eslint-disable no-negated-condition */
/* eslint-disable no-alert */
import { useCallback, useEffect, useMemo, useState } from "react";
import { WEBCAM_PREFIX } from "../config/cameras";
import type { Dimensions } from "../config/layout";
import { getDeviceLabel } from "./App";
import { AudioSelector } from "./AudioSelector";
import { PrefixAndResolution } from "./PrefixAndResolution";
import { ToggleRotate } from "./Rotate";
import { Stream } from "./Stream";
import { ToggleCrop } from "./ToggleCrop";
import { VolumeMeter } from "./components/VolumeMeter";
import { Button } from "./components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { getMaxResolutionOfDevice } from "./get-max-resolution-of-device";
import { canRotateCamera } from "./helpers/can-rotate-camera";
import {
  SelectedSource,
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
};

const viewName: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  padding: 4,
  paddingLeft: 10,
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

  const [selectedAudioSource, setSelectedAudioSource] =
    useState<ConstrainDOMString | null>(null);
  const [selectedVideoSource, setSelectedVideoSource] =
    useState<SelectedSource | null>(null);
  const recordAudio = prefix === WEBCAM_PREFIX;
  const [resolution, setResolution] = useState<Dimensions | null>(null);
  const [preferPortrait, setPreferPortrait] = useState(false);
  const [activeDeviceId, setActiveDeviceId] = useState<string | null>(null);
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
    setSelectedVideoSource({ type: "display" });
  }, []);

  const activeDevice = useMemo(() => {
    return devices.find((d) => d.deviceId === activeDeviceId);
  }, [activeDeviceId, devices]);

  const deviceLabel = useMemo(() => {
    if (!activeDevice) {
      return null;
    }

    return getDeviceLabel(activeDevice);
  }, [activeDevice]);

  const maxResolution = useMemo(() => {
    if (!activeDevice) {
      return null;
    }

    return getMaxResolutionOfDevice(activeDevice);
  }, [activeDevice]);

  useEffect(() => {
    if (!activeDevice) {
      return;
    }

    setSelectedVideoSource(
      getSelectedVideoSource({
        device: activeDevice,
        resolutionConstraint: sizeConstraint,
        maxResolution,
      }),
    );
  }, [activeDeviceId, sizeConstraint, devices, activeDevice, maxResolution]);

  const cameraRotateable = useMemo(() => {
    return canRotateCamera({
      selectedSource: selectedVideoSource,
      preferPortrait,
      resolution,
    });
  }, [preferPortrait, resolution, selectedVideoSource]);

  return (
    <div style={viewContainer}>
      <div style={viewName}>
        <PrefixAndResolution
          deviceName={deviceLabel}
          setSizeConstraint={setSizeConstraint}
          sizeConstraint={sizeConstraint}
          prefix={prefix}
          resolution={resolution}
          maxResolution={maxResolution}
        />
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
        <Select onValueChange={(value: string) => setActiveDeviceId(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select video" />
          </SelectTrigger>
          <SelectContent>
            {devices
              .filter((d) => d.kind === "videoinput")
              .map((d) => {
                const label = getDeviceLabel(d);
                return (
                  <SelectItem key={d.deviceId} value={d.deviceId}>
                    {label}
                  </SelectItem>
                );
              })}
          </SelectContent>
        </Select>

        {prefix !== WEBCAM_PREFIX ? (
          <Button type="button" onClick={selectScreen}>
            Select screen
          </Button>
        ) : null}

        {recordAudio ? (
          <AudioSelector
            devices={devices}
            setSelectedAudioSource={setSelectedAudioSource}
            audioSource={selectedAudioSource}
          />
        ) : null}
      </div>
      {prefix === WEBCAM_PREFIX ? (
        <VolumeMeter mediaStream={mediaStream} />
      ) : null}
      <Stream
        selectedAudioSource={selectedAudioSource}
        selectedVideoSource={selectedVideoSource}
        recordAudio={recordAudio}
        resolution={resolution}
        setResolution={setResolution}
        mediaStream={mediaStream}
        setMediaStream={setMediaStream}
        prefix={prefix}
        showCropIndicator={showCropIndicator}
        preferPortrait={preferPortrait}
      />
    </div>
  );
};
