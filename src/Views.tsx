/* eslint-disable no-negated-condition */
/* eslint-disable no-alert */
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ALTERNATIVE1_PREFIX,
  ALTERNATIVE2_PREFIX,
  DISPLAY_PREFIX,
  WEBCAM_PREFIX,
} from "../config/cameras";
import type { Dimensions } from "../config/layout";
import { getDeviceLabel } from "./App";
import { AudioSelector } from "./AudioSelector";
import { canRotateCamera } from "./can-rotate-camera";
import { Button } from "./components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { VolumeMeter } from "./components/VolumeMeter";
import { PrefixAndResolution } from "./PrefixAndResolution";
import { ToggleRotate } from "./Rotate";
import { Stream } from "./Stream";
import { ToggleCrop } from "./ToggleCrop";
import type { SelectedSource } from "./video-source";
import { getSelectedVideoSource } from "./video-source";

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

export const prefixes = [
  WEBCAM_PREFIX,
  DISPLAY_PREFIX,
  ALTERNATIVE1_PREFIX,
  ALTERNATIVE2_PREFIX,
] as const;
export type Prefix = (typeof prefixes)[number];

const localStorageKey = "showCropIndicator";

export const View: React.FC<{
  devices: MediaDeviceInfo[];
  setMediaStream: (prefix: Prefix, source: MediaStream | null) => void;
  mediaStream: MediaStream | null;
  prefix: Prefix;
}> = ({ devices, setMediaStream, prefix, mediaStream }) => {
  const sourceRef = useRef<HTMLVideoElement>(null);

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
    const stream = await window.navigator.mediaDevices
      // GetDisplayMedia asks the user for permission to capture the screen
      .getDisplayMedia({ video: true });

    setMediaStream(prefix, stream);
    if (!sourceRef.current) {
      return;
    }

    sourceRef.current.srcObject = stream;
    sourceRef.current.play();
  }, [prefix, setMediaStream]);

  const onValueChange = useCallback(
    (value: string) => {
      setSelectedVideoSource(getSelectedVideoSource({ value, devices }));
    },
    [devices],
  );

  return (
    <div style={viewContainer}>
      <div style={viewName}>
        <PrefixAndResolution prefix={prefix} resolution={resolution} />
        {prefix === WEBCAM_PREFIX ? (
          <ToggleCrop
            pressed={showCropIndicator}
            onPressedChange={onToggleCrop}
          />
        ) : null}
        {canRotateCamera({
          selectedSource: selectedVideoSource,
          preferPortrait,
          resolution,
        }) ? (
          <ToggleRotate
            pressed={preferPortrait}
            onPressedChange={onToggleRotate}
          />
        ) : null}
        <Select onValueChange={onValueChange}>
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
